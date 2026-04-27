---
title: ProteinGuide in Practice
layout: blog.liquid
date-updated: 2026-04-26
---

<section>

This post assumes some basic familiarity with generative models, training regression models, Bayes' rule, and ProteinGuide itself {% sidenote "For a brief introduction, checkout my [Intuitive Introduction to ProteinGuide](../ddm-and-pg-intuition/)." %}. It is intended for those with some background in machine learning who are interested in applying ProteinGuide in their research.

{% marginnote "If you're interested in generative modeling, I post pieces that synthesize my learnings about this field [on my substack](https://substack.com/@ishangaurr). Two upcoming essays that I'm particularly excited about will investigate the origins of the probabilistic framework for generative modeling. I'll not only trace through the history of generative models in machine learning (Diffusion, GPT, GANs, VAEs, Deep Belief Networks, etc.) but will also examine the intellectual precursors of the field, including topics like the invention of Monte Carlo methods to create the atomic bomb and the invention of Markov chains to analyze Russian literature. [Subscribe to my substack](https://substack.com/@ishangaurr/subscribe) to get notified when these pieces come out." %}

What follows is a living document recording the Listgarten lab's current best practices for using ProteinGuide. The post is divided into three sections. The first section describes a conceptual framework for how ProteinGuide works in the ideal case. The second uses this framework to categorize the main failure modes you might encounter. It then covers how to address them. The final section organizes these ideas into a reasonable default workflow for using ProteinGuide in the lab

## Table of Contents
- [Table of Contents](#table-of-contents)
- [Understanding ProteinGuide and its Vulnerabilities](#understanding-proteinguide-and-its-vulnerabilities)
- [Scenario 1: No wet-lab data yet](#scenario-1-no-wet-lab-data-yet)
- [Scenario 2: Wet-lab data collected without the pretrained generative model](#scenario-2-wet-lab-data-collected-without-the-pretrained-generative-model)
- [A Potpurri of Possible Problems](#a-potpurri-of-possible-problems)
  - ["Reward Hacking"](#reward-hacking)
  - [Library-Generative Model Mismatch](#library-generative-model-mismatch)
  - [Predicive models on Masked Sequences can be Very Biased](#predicive-models-on-masked-sequences-can-be-very-biased)
  - [Generative Model Doesn't Have Coverage](#generative-model-doesnt-have-coverage)
- [A Practical Workflow for ProteinGuide](#a-practical-workflow-for-proteinguide)


## Understanding ProteinGuide and its Vulnerabilities

ProteinGuide samples from a function-conditioned distribution over proteins using classifier guidance. The key equation to remember is the following application of Bayes' rule:

{%- capture predictive_for_continuous -%}
When your function of interest is a discerete variable, like a binary label for whether a sequence adopts a particular fold, the notation to the left suffices. In those cases, the predictive model will be a classifier. When the function of interest is a continuous variable, such as binding affinity, $p(y \mid x)$ is shorthand for $p(y > \tau \mid x)$, where $\tau$ is the threshold for function that you want to achieve with your library. When $y$ is continuous, the predictive model is a regression model and is normally setup to parameterize an tractable distribution over function values (e.g. predicting the mean and variance of a Gaussian). The threshold $\tau$ can then be applied later, when actually sampling, to get a probability.
{%- endcapture -%}
<br>

<figure><p>$$p(x \mid y) \propto p(y \mid x) \cdot p(x).$$</p></figure>

In this equation,
- $p(x)$ is your {% color "blue" %}prior distribution over sequences{% endcolor %}{% sidenote "Strictly speaking the generative model predicts the marginal probability of the next position to unmask $x_i$ given a partially masked sequence $x^{(t)}$, but we'll use $x$ as shorthand for this post." %} for the task. In ProteinGuide, this is instantiated as a pretrained {% color "blue" %}sequence generative model{% endcolor %}.
- $p(y \mid x)$ is your {% color "darkorange" %}predictive model{% endcolor %} of protein function. It estimates the probability{% sidenote predictive_for_continuous %} that a sequence $x$ can acheive your function of interest $y$.
- $p(x \mid y)$ is what we actually want to sample from: plausible sequences that solve the task.

For more background on ProteinGuide, check out the [overview](../../using-proteinguide/index.html#overview) on the homepage of this series of posts.

Now let's develop a conceptual framework for understanding how ProteinGuide should work in the ideal case. Consider the following schematic of the sequence space for a given design problem.

<figure>
  <div data-proteinguide-graphic></div>
</figure>
<script type="module" src="/assets/js/proteinguide-workflow-graphic.js"></script>

Sequences with a {% color "blue" %}blue check{% endcolor %} are those that are predicted to be realistic by the {% color "blue" %}generative model{% endcolor %}, and sequences with an {% color "darkorange" %}orange check{% endcolor %} are those that are predicted to solve the task by the {% color "darkorange" %}predictive model{% endcolor %}. The region enclosed by the dashed red line is the region of sequence space we think is relevant for our task.

In an ideal scenario, the sequence-function data from our first library is concentrated on the intersection of these two. This ensures that:
1. we are likely to find good sequences in the next rounds, 
2. the predictive model is well-trained on the same region of sequence space that the generative model concentrates on, and 
3. the generative model doesn't have too much probability mass outside of the region that we're interested in sampling from. 

When these conditions hold, ProteinGuide works well. After all, the mathematical machinery underlying the technique stems from the basic axioms of probability. If we're having trouble with ProteinGuide, it won't be because math decided to break that day. It will be because our computational pipeline doesn't adhere to our mathematical assumptions.

These assumptions are the same ones we discussed in the [overview]() to this series of posts:
1. the {% color "blue" %}generative model{% endcolor %} must capture your {% color "blue" %}prior beliefs{% endcolor %} about which sequences make sense for this task
2. the {% color "darkorange" %}predictive model{% endcolor %} must accurately determine, based on your {% color "darkorange" %}wet-lab data{% endcolor %}, which sequences from your prior are most desireable.

In our experience, every time we thought we found a "new" failure mode for ProteinGuide, it turned out to stem from a violation of one or both of these assumptions:
1. the way your generative model is set up, it doesn't actually capture all your prior knowledge about the task, often producing sequences that are clearly suboptimal for your task of interest, or
2. the sequences produced by the generative model are out of distribution for the predictive model; equivalently, the generative model produces sequences that are very different from those in your assay labeled data.

The remainder of this post covers tips and tricks to mitigate these issues. To begin, there are two possible scenarios we must analyse.

## Scenario 1: No wet-lab data yet

If you haven't run your first experimental library yet, congratulations! You can avoid these problems pretty safely{% sidenote "Click [here]() to jump to our workflow that includes running the first library." %}. Just generate the sequences for your first library using the generative model. The main thing you need to get right is to setup the sampling problem to bake-in as much of your prior knowledge about the task as possible. Don't just use the unconditional generative model directly. Play with:
- picking a specific region of the protein to design
- biasing the generative model towards wildtype sequences
- filtering the generations with plddt or refolding metrics
- you can even [guide with the stability predictor](https://ishan-gaur.github.io/proteingen/examples/stability-guided-generation/) from our paper.

Then, to sample the second round of designs, set up the generation pipeline the **same** way. Just take care to plug in the guided model wherever you used the pretrained model the first time around{% sidenote "If you use the ProteinGen package, this just corresponds to, e.g. changing wherever you have <code>ESM3</code> in your code to <code>DEG(ESM3, predictive_model)</code>." %}. 

The only caveat is that, if you filter generated sequences–such as selecting generated sequences for the library by pLDDT–you may need to finetune the generative model on the library sequences first. Otherwise the generative process will be OOD for the predictive model, since it will be no longer be biased towards high plddt sequences like the library was.

The benefit of setting up your first library this way is that the sequences in it will be sampled from the distribution of your generative model. Recall from the [Intuitive Introduction to ProteinGuide](./ddm-and-pg-intuition.md) that the predictive model has to approximately forcast how the *particular generative model* it is guiding will complete the current partially masked sequence and what distribution over function values that will induce. Making the predictive model's data distribution match the generative model sequences it will take as input during guidance will make ProteinGuide much more likely to work for you. 

The only downside is that a simple baseline for generating the initial library, like a DMS scan of the WT, might still outperform the generative model on average. This means even if ProteinGuide works, it is starting from a disadvantage compared to wildtype. We don't have a ton of anecdotal evidence on this question yet, but if you have the budget for multiple rounds of design, ProteinGuide starting with the generative model sequences should be fine. If you have a more limited budget, we would recommend first finetuning the generative model on the WT or successful sequences from a pilot mutational library before using it to generate your first library.

## Scenario 2: Wet-lab data collected without the pretrained generative model

On the other hand, If you already have some data collected, don't worry, that's what the rest of this guide is for. We'll walk you through how to reason about setting up ProteinGuide to work for your use-case.

## A Potpurri of Possible Problems

### "Reward Hacking"
In this scenario, the predictive model does not know about some sequence bias in your dataset that is a necessary precondition for success. This commonly includes bias to the wild-type sequence. The predictive model might not know that sequences in other protein families cannot solve your task. We can see this in the schematic as the presence of false positives outside the dashed red line.

<figure>
  <div data-proteinguide-reward-hacking="predictor-extrapolation"></div>
</figure>

This is normally fine if your generative model constrains the space of relevant sequences strongly enough. But if the generative model is too flexible, it might produce "successes" outside the reasonable region that are unlikely to work. These are the circled points in the following diagram.

<figure>
  <div data-proteinguide-reward-hacking="generator-shift"></div>
</figure>
<script type="module" src="/assets/js/proteinguide-reward-hacking-graphics.js"></script>

Solutions:
- Restrict generation to only allow the model to design a small region of the protein
- Finetune the generative model on homologs
- Finetune the generative model on the first library
- Self-distill the predictive model by training it on partially masked model generated sequences for which it scored the unmasked sequences itself{% sidenote "This can work but is the least less-understood option. If you need to do this, you should probably restrict the region you're designing or finetune on the initial library instead." %}

Common gotchas:
- If you're too aggressive with these techniques guidance might not do anything because the sequences from the generative model no longer covers a large enough range of function for the predictive model to guide towards the good ones. You can always try to increase guidance temperature to solve this, but we've found that it's better to give the model more residues to design or increase regularization towards the original weights when doing finetuning (*i.e.*, using a lower LoRA rank).
- If you finetune on homologs that are in-distribution for the model, the model is unlikely to change how it ranks them. It will just make your protein family of interest more likely than all other protein families. This is sufficient to address reward hacking, but is just a common assumption people have when they train on homologs–that the model will now learn new fitness information as well. We have not found the latter to be a reliable phenomenon.
- If you train on the initial library, there is a chance that the pretrained model overfits and forgets information it knows about the natural distribution of sequences. To guard against this, use a low LoRA rank and monitor the model's performance on a held-out set of natural sequences. This is related to the first problem above of have to little variance in the generative model's sequences.


### Library-Generative Model Mismatch

Realities:
- your first library was not generated by the generative model, therefore there is a mismatch between the predictive model's training distribution and the sequences the generative model will create
- similarly, the guided sequences are too different from the training data

Failure modes:
- the predictive model's behavior on the generative model's distribution is unpredictable
- this can be seen by very volatile p(y|x_t) curves or large disagreements between the clean predictor and the noisy predictor on the guided sequences

Solutions:
- while figuring out the best approach, it may be useful to employ some form of uncertainty quantification. we've found that predicting per-sample variance and creating an ensemble of these predictors that are trained on different subsets of the data is helpful for this purpose.
- if the best sequences in the initial library are good enough, finetune the generative model on the successful sequences from the first library
- otherwise, you can guide the pretrained model as is, but need to make sure to bring its sequences in distribution for the noisy predictor. to do this, generate a dataset of model-generated sequences and give them function labels using the clean model's predictions. if you've created an ensemble to get uncertainty estimates, sample several labels for the predictive model to train on.

### Predicive models on Masked Sequences can be Very Biased

Reality:
- noisy classification is a computationally hard task because you have to predict the generative model's completions of each sequence to solve it fully

Failure modes:
- predictive models are likely to have their predictions collapse onto the population mean, or have the overall variance of their predictions contract significantly

Solutions:
- initialize the noisy predictive model with the clean model's weights. then freeze the weights of the noisy predictive model that take non-masked features as input. Only allow the weights for masked inputs and hidden+output layers to be updated during training. This way, the noisy predictive model is unlikely to decrease MSE at high masking rates by learning an bias towards the population mean.

Common gotchas:
- If you try to solve this problem with simultaneously learning a predictor for all noise levels by training multiple predictors, differences in how they model the denoising process that often cause them to guide the pretrained model in conflicting ways, killing the success rate

### Generative Model Doesn't Have Coverage 

Theoretical issue:
- There is a small chance that you somehow figure out that there is a region of sequence space that is very likely to solve your task, but for which the generative model does not assign very high probability. In this case, you can just finetune your model on algorithmically generated or filtered sequences from that region. Changing the predictive model might be tricky since you might not want to destroy the correct function-related features it already recognizes.

## A Practical Workflow for ProteinGuide


</section>