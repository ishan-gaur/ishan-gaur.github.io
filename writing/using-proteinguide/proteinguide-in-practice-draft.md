---
title: ProteinGuide in Practice (Draft)
layout: blog.liquid
date-updated: 2026-04-26
---

<section>

This post assumes some basic familiarity with generative models, training regression/classification models, and Bayes' rule. {% sidenote "If you'd like a refresher, I wrote an [intuitive overview of ProteinGuide](./ddm-and-pg-intuition/). I will also be posting intuitive introductions to discrete diffusion and guidance on [my Substack](https://substack.com/@ishangaurr) soon." %} It is intended for people with some ML background who are interested in applying ProteinGuide to real projects.

{% marginnote "This is a living document in the literal sense: as we keep running projects, we will keep updating this playbook." %}

What follows is our current framework in the Listgarten lab for making ProteinGuide work in practice. The first half is intentionally essay-like: a conceptual model for what ProteinGuide is trying to do and why different failures often have the same root cause. The second half switches into playbook mode: concrete interventions and a reasonable first-try workflow.

At a high level, ProteinGuide is trying to sample from a task-conditional distribution:

<figure><p>$$p(x \mid y) \propto p(y \mid x)\,p(x).$$</p></figure>

- $p(x)$ is your pretrained generative model's prior over plausible sequences.
- $p(y \mid x)$ is your predictive model's estimate of task success.
- $p(x \mid y)$ is what we actually want to sample from: plausible sequences that solve the task.

In the ideal case, ProteinGuide approximates this conditional cleanly. In the real world, the approximation quality depends on whether your generator and predictor are aligned on the same part of sequence space.

Across projects, most apparent "new" failure modes end up being manifestations of one of two core problems:

1. **objective gap in the prior**: the generative model does not naturally put enough probability mass on sequences that can solve your task, and
2. **predictor-distribution mismatch**: the predictive model is asked to score (often partially masked) sequences that are out-of-distribution for what it was trained on.

Everything else in this post is best understood as diagnosis and mitigation for those two issues.

<!-- GRAPHIC DESCRIPTION: A large array of boxes connected by lines in a grid. Each one represents a sequence and the other sequences that are one mutation away from it. Each box is split in two diagonally. Most have a light gray x in both boxes. Some have an orange checkmark symbolizing that these are realistic proteins. Some have a blue checkmark symbolizing that these are proteins that solve the task of interest. A medium sized region, containing all of the blue checkmarks and some neighboring orange checkmarks is outlined in red. This is the region of sequences that we think is reasonable to sample from, and which our experimental data is collected from. -->

<figure class="fullwidth">
  <div data-proteinguide-graphic></div>
  <figcaption>
    Sequence-space sketch generated client-side. Gray X marks are mostly implausible sequences,
    orange checks are realistic proteins, blue checks satisfy the task, and the red outline marks
    the sampling neighborhood for experiments.
  </figcaption>
</figure>
<script type="module" src="/assets/js/proteinguide-workflow-graphic.js"></script>

## 1) Conceptual framework: how to read the diagram

The diagram above is the mental model I use before touching any hyperparameters.

Most of sequence space is gray X's: implausible variants, dead ends, or sequences that are simply not worth budget. The orange checks are "protein-like" sequences your pretrained model can plausibly support. The blue checks are sequences that actually solve your design objective. The red boundary is the neighborhood you're effectively exploring with your library and assays.

A useful way to think about ProteinGuide is that the generative model and predictive model split responsibility:

- the **generative model** should keep you in a region where folding/expression/basic plausibility are not constantly fighting you,
- the **predictive model** should rank sequences *within that region* for the specific property you care about.

If the generator is weak for your task, the predictor has to learn too much from limited assay labels (stability + expression + function + all your assay quirks), which is usually not realistic. If the predictor is weak, guidance can still help only if the generator already places meaningful mass near good solutions.

So before any fancy tuning, ask two blunt questions:

1. Is my base generator producing at least some plausibly assayable variants for this family/task?
2. Is my predictor trained on data that resembles what this generator emits during guidance (including partial/noisy states)?

If either answer is no, fix that first.

## 2) Why many failure modes are just two problems wearing different clothes

There are lots of ways a ProteinGuide pipeline can look broken: reward hacking, unstable guidance curves, high in-silico scores that die in assay, guidance that suddenly does nothing, etc. But in practice these usually trace back to the same two root causes.

### Problem A: objective gap in the prior

Your pretrained generative model knows how to be broadly protein-like, not how to solve your exact design goal. That means your target region might have very low prior mass even if it exists.

When that happens, guidance can only do so much: the predictor is trying to reweight candidates that the generator rarely proposes in the first place.

### Problem B: predictor-generator mismatch

Even if the prior is decent, guidance can fail when the predictor is not calibrated on the generator's distribution—especially on partially masked trajectories. In that case, guidance can be confidently wrong, because it is extrapolating outside its training regime.

These two problems also interact. A poor prior pushes generation into weird corners; that makes predictor mismatch worse; predictor mismatch then feeds bad guidance signals back into sampling. This is why failures often look nonlinear and "mysterious" round-to-round.

The practical implication is simple: most interventions are either trying to align the prior with your task neighborhood, or align predictor supervision with what the generator actually samples.

From here on, I'll switch to playbook mode.

## 3) Playbook: interventions by failure mode

### A) Prior misspecification (generator not pointed at the right region)

**What it looks like**
- Guided sequences score high in silico but fail in assay (classic reward hacking).
- Generated sequences look off-family or biophysically dubious.
- You rely heavily on post-hoc filtering just to rescue a few candidates.

**What to try**
- Restrict editable positions (reduce design entropy).
- Bias logits toward WT (or another trusted scaffold).
- Finetune the generator on homologs for your family.
- Finetune on your initial library distribution.
- Add structural/biophysical guardrails (e.g., AF-style filters).

**Common gotchas**
- If you over-constrain generation, guidance has no room to improve anything.
- Aggressive finetuning can erase useful pretrained priors.
- Homolog finetuning may mostly shift family-level mass, not necessarily improve local ranking.

### B) Predictor-distribution mismatch (predictor out-of-distribution during guidance)

**What it looks like**
- Volatile $p(y\mid x_t)$ behavior across denoising steps.
- Large disagreement between clean and noisy predictors on guided outputs.
- Strong predicted gains that fail to replicate experimentally.

**What to try**
- Generate model samples and pseudo-label with a clean predictor (distillation bootstrap).
- Use uncertainty-aware predictors (ensembles / predictive variance).
- If first-round hits are already decent, finetune generator on successful sequences before aggressive guidance.
- Build subsequent rounds from model-generated libraries to keep predictor and generator aligned.

**Common gotchas**
- Naively labeling model generations as "negatives" can distort the task.
- Distillation can amplify clean-model bias if not checked against held-out assay data.

### C) Noisy predictor collapse (hard supervision at high masking rates)

**What it looks like**
- Noisy predictor regresses toward the population mean.
- Prediction variance collapses at high masking rates.
- Guidance becomes weak or erratic over timesteps.

**What to try**
- Initialize noisy predictor from clean predictor weights.
- Freeze non-masked feature pathways; only train masked-input + upper layers.
- Monitor calibration by noise level, not just aggregate loss.

**Common gotcha**
- Training separate predictors per noise level can create conflicting guidance fields unless you align/regularize them carefully.

## 4) Playbook: a reasonable first-try algorithm

If you're setting up ProteinGuide for a new project and want a sane default:

1. **Define the design neighborhood.**
   Choose editable positions and anchors (WT/scaffold/homolog context).

2. **Sample the initial library with the same generator family you intend to guide later.**
   This is the highest-leverage step for avoiding predictor-generator mismatch.

3. **Assay the library and train a clean predictor.**
   Evaluate ranking quality on held-out measured variants.

4. **Train a noisy predictor for guidance.**
   Start from clean weights; add regularization/freezing to avoid collapse.

5. **Run in-silico diagnostics before committing wet-lab budget.**
   Check score distributions, diversity, uncertainty, and clean-vs-noisy agreement.

6. **Generate guided candidates conservatively first.**
   Sweep guidance strength/temperature and inspect fitness–diversity tradeoffs.

7. **Apply quality filters.**
   Structural plausibility, motif constraints, manufacturability, etc.

8. **Close the loop with new assay data.**
   Retrain predictors, optionally refresh/finetune the generator, and iterate.

## 5) Practical rules of thumb

- If guidance does nothing, you are usually either over-constrained or under-calibrated.
- If guidance only "works" at extreme temperatures, fix model alignment before turning knobs harder.
- If top in-silico variants fail in assay, suspect distribution shift before blaming optimization.
- Treat round 1 as calibration whenever possible; treat later rounds as optimization.

## 6) If you only remember two things

1. **Use the same generator family for initial-library construction and guided generation whenever you can.**
2. **Invest in predictor diagnostics (especially uncertainty and clean/noisy agreement), not just one headline validation metric.**

</section>
