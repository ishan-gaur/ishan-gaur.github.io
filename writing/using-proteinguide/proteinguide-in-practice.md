---
title: ProteinGuide in Practice
layout: blog.liquid
date-updated: 2026-04-26
---

<section>

This post assumes some basic familiarity with generative models, training regression models, Bayes' rule, and ProteinGuide itself. {% sidenote "For a brief introduction, checkout my [Intuitive Introduction to ProteinGuide](../ddm-and-pg-intuition/)." %} It is intended for those with some background in machine learning who are interested in applying ProteinGuide in their research.

{% marginnote "If you're interested in generative modeling, I post pieces that synthesize my learnings about this field [on my substack](https://substack.com/@ishangaurr). Two upcoming essays that I'm particularly excited about will investigate the origins of our probabilistic perspective in generative modeling. I'll not only be tracing through the history of generative models in machine learning (Diffusion, GPT, GANs, VAEs, Deep Belief Networks, etc.) but will also examine the intellectual precursors of the field, including topics like the invention of Monte Carlo methods to create the atomic bomb and the invention of Markov chains to analyze Russian literature. [Subscribe to my substack](https://substack.com/@ishangaurr/subscribe) to get notified when these pieces come out." %}

What follows is a living document recording the Listgarten lab's current best practices for using ProteinGuide. The post is divided into three sections. The first section describes a conceptual framework for how ProteinGuide works in the ideal case. The second uses this framework to categorize the main failure modes you might encounter. It then covers how to address them. The final section organizes these ideas into the reasonable default workflow for using ProteinGuide in the lab.

## Understanding ProteinGuide and its Vulnerabilities

ProteinGuide is trying to sample from a function-conditioned distribution over proteins using classifier guidance. The key equation to remember is the following application of Bayes' rule:

{%- capture predictive_for_continuous -%}
When your function of interest is a discerete variable, like a binary label for whether a sequence adopts a particular fold, the notation to the left suffices. In those cases, the predictive model will be a classifier. When the function of interest is a continuous variable, such as binding affinity, $p(y \mid x)$ is shorthand for $p(y > \tau \mid x)$, where $\tau$ is the threshold for function that you want to achieve with your library. When $y$ is continuous, the predictive model is a regression model and is normally setup to parameterize an tractable distribution over function values (e.g. predicting the mean and variance of a Gaussian). The threshold $\tau$ can then be applied later, when actually sampling, to get a probability.
{%- endcapture -%}
<br>

<figure><p>$$p(x \mid y) \propto p(y \mid x) \cdot p(x).$$</p></figure>

In this equation,
- $p(x)$ is your prior distribution over sequences for the task. In ProteinGuide, this is instantiated as a pretrained sequence generative model.
- $p(y \mid x)$ is your predictive model of protein function. It estimates the probability{% sidenote predictive_for_continuous %} that a sequence $x$ can acheive your function of interest $y$.
- $p(x \mid y)$ is what we actually want to sample from: plausible sequences that solve the task.

For more background on ProteinGuide, check out the [overview](../../using-proteinguide/index.html#overview) on the homepage of this series of posts.

Now let's develop a conceptual framework for understanding how ProteinGuide should work in the ideal case. Consider the following schematic of the sequence space for a given design problem. Sequences with an blue check are those that are predicted to be realistic by the generative model, and sequences with an orange check are those that are predicted to solve the task by the predictive model.

<figure>
  <div data-proteinguide-graphic></div>
  <figcaption>
    Sequence-space sketch generated client-side. Gray X marks are mostly implausible sequences,
    orange checks are realistic proteins, blue checks satisfy the task, and the red outline marks
    the sampling neighborhood for experiments.
  </figcaption>
</figure>
<script type="module" src="/assets/js/proteinguide-workflow-graphic.js"></script>

In the ideal scenario, the sequence-function data from our first library is concentrated on the intersection of these two. This ensures that we are likely to find good sequences in the next rounds, that the predictive model is well-trained on the same region of sequence space that the generative model concentrates in, and that the generative model doesn't have too much mass away from the region of sequence space that we're really interested in. 

When these conditions hold, ProteinGuide works well. After all, the mathematical machinery underlying the technique stems from the basic axioms of probability. If we're having trouble with ProteinGuide, it's because our mathematical assumptions don't match the reality of the computational pipeline we've setup.

So far, in our experience, every time we find a "new" failure mode for ProteinGuide, it turns out to be a manifestation of one of the following two basic problems:
1. the way your generative model is set up, it doesn't actually capture all your prior knowledge about the task and it often produces sequences that are clearly suboptimal for your task of interest, or
2. the sequences produced by the generative model are out of distribution for the predictive model; equivalently, the generative model produces sequences that are very different from those in your assay labeled data.

How easy it is to solve these problems depend on if you already have some assay labeled data collected already.

## Scenario 1: No wet-lab data yet

If you haven't run your first experimental library yet, congratulations! You can avoid these problems pretty safely{% sidenote "Click [here]() to jump to our workflow that includes running the first library." %}. Just generate the sequences for your first library using the generative model. The main thing you need to get right is to setup the sampling problem to bake-in as much of your prior knowledge about the task as possible. Don't just use the unconditional generative model directly. Play with:
- picking a specific region of the protein to design
- biasing the generative model towards wildtype sequences
- filtering the generations with plddt or refolding metrics
- you can even [guide with the stability predictor](https://ishan-gaur.github.io/proteingen/examples/stability-guided-generation/) from our paper.
Then, to sample the second round of designs, set up the generation pipeline the **same** way. Just take care to plug in the guided model wherever you used the pretrained model the first time around{% sidenote "If you use the ProteinGen package, this just corresponds to, e.g. changing wherever you have <code>ESM3</code> in your code to <code>DEG(ESM3, predictive_model)</code>. push " %}. The only caveat is that, if you filter generated sequences–such as selecting generated sequences for the library by plddt–you may need to finetune the generative model on the library sequences first. Otherwise the generative process will be OOD for the predictive model, since it will be no longer be biased towards high plddt sequences like the library was.

The benefit of setting up your first library this way is that it will make it much more likely that ProteinGuide works for you. The only downside is that a simple baseline for generating the initial library, like a DMS scan of the WT, might still outperform the generative model on average. This means even if ProteinGuide works, it is starting from a disadvantage compared to wildtype. 

We don't have a ton of anecdotal evidence on this question yet, but if you have the budget for multiple rounds of design, ProteinGuide starting with the generative model sequences should be fine. If you have a more limited budget, we would recommend first finetuning the generative model on the WT or successful sequences from a pilot mutational library before using it to geenrate your first library.

## Scenario 2: You collected wet-lab data without the pretrained generative model

On the other hand, If you already have some data collected, don't worry, that's what this guide is for. We'll walk you through how to reason about setting up ProteinGuide to work for your use-case.

Realities:
- predictive model does not know about the general pre-conditions for success assumed in your data like stability and folding. It just learns what's needed in the small region of sequence space sampled by your data. This leads to points outside the data region having positives
- the generative model doesn't know about the specific task you want. since it's a generative model, it also is okay with several sequences outside of the region you trained the predictive model on

Failure modes:
- get reward hacking

Solution:
- restrict generation to a small region of the protein
- train the generative model on homologs
- train the generative model on the initial library
- include model generated sequences in the predictive model training data as sequences with probability zero of success (not recommended, if you need to do this, you should probably restrict the region you're designing or finetune on the initial library instead) 

Common gotchas:
- if you're too aggressive with these techniques guidance might not do anything because the sequences from the generative model no longer covers a large enough range of function for the predictive model to guide towards the good ones. you can always try to increase guidance temperature to solve this, but we've found that it's better to give the model more residues to design or increase regularization towards the original weights when doing finetuning. Note that you can check this in silico with the clean predictive model's scores for the sequences you get from guidance.
- if these homologs are in-distribution for the model, this is unlikely to change how the model ranks them, it just makes that protein family more likely than all other protein families.
- if you train on the initial library, there is a chance that the pretrained model overfits and forgets information it knows about the natural distribution of sequences. to guard against this, use a low LoRA rank and monitor the model's performance on a held-out set of natural sequences.

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

Reality:
- noisy classification is a computationally hard task because you have to predict the generative model's completions of each sequence to solve it fully

Failure modes:
- predictive models are likely to have their predictions collapse onto the population mean, or have the overall variance of their predictions contract significantly

Solutions:
- initialize the noisy predictive model with the clean model's weights. then freeze the weights of the noisy predictive model that take non-masked features as input. Only allow the weights for masked inputs and hidden+output layers to be updated during training. This way, the noisy predictive model is unlikely to decrease MSE at high masking rates by learning an bias towards the population mean.

Common gotchas:
- If you try to solve this problem with simultaneously learning a predictor for all noise levels by training multiple predictors, differences in how they model the denoising process that often cause them to guide the pretrained model in conflicting ways, killing the success rate

Theoretical issue:
- There is a small chance that you somehow figure out that there is a region of sequence space that is very likely to solve your task, but for which the generative model does not assign very high probability. In this case, you can just finetune your model on algorithmically generated or filtered sequences from that region. Changing the predictive model might be tricky since you might not want to destroy the correct function-related features it already recognizes.


- ideal computation; how proteinguide approximates it
  - you can see that the generative model and the predictive model share the burden of finding successful sequences. if the generative model is poor, the predictive model needs to be able to predict stability and expression to correctly predict function. if the predictive model is weak just identifying a few motifs or mutational patterns that work on sequences close to the wildtype, but the generative model is already likely to produce reasonable sequences, you may still get reasonable results.
  - important things are to explain:
    - that the predictive model is what defines the conditional distribution
    - so anything you want in your protein that isn't captured by the generative model needs to be captured by the predictive model
      - because the predictive model is normally trained on limited experimental data, it's normally easier to improve your generative model or constrain the design task to something that your generative model can handle reasonably well.
    - that because we are guiding intermediate generation steps, the generative model must forecast how the generative model will complete a partial sequence--the closer the predictive model's training data is to the generative model, the better
      - this is most easy to solve at the very beginning with designing the initial library
      - barring that, if you like that initial library, you can make your generative model approximate it, at the danger of losing some of its in-built knowledge of the natural distribution of sequences
      - finally you can try to distill the clean model's predictions on the generative model's distribution
      - because it would be difficult to train a predictive model on limited data that capture all your design desiderate, you have to make sure that the base generative model is setup to produce sequences that are as relevant to your task as possible
    - that the predictive model needs to be calibrated to the generative model's distribution (at least roughly) in order to make good decisions for partially masked sequences
    - that ideally your generative model and predictive model are amplifying each other's strengths. if your generative model is not concentrated enough of the relevant sequences, the predictive model might end up having to 

ProteinGuide is a method for *classifier guidance* of discrete generative models.

First thing I want to make clear is the ideal sampling algorithm that ProteinGuide is approximating. This should make clear what the method aims to achieve and what its natural limitations are. I hope it also helps to motivate the practical tricks we will discuss in this post, as they are designed to reduce the gap between the ideal sampling algorithm and what actually happens when we run ProteinGuide under realistic conditions.

The goal of ProteinGuide is to allow us to sample from a property-conditional distribution of our pretrained generative model. The pretrained generative model is a randomized algorithm that produces different protein sequence each time we run it. The population of sequences it produces implicitly defines a probability distribution over the set of all possible sequences. If us machine learning practitioners did our job well, this distribution should have large peaks on regions of sequence space that correspond to reasonable sequences with functions that are likely to be observed in nature. The pretrained model's distribution should also place very little weight on sequences that are unlikely to fold stably or express well. We'll 

A pre-trained generative model can produce a huge variety of sequences; however, not all of them will be relevant to the task that we want to design a protein to solve. In order to get sequences that will actually serve the purpose we want them to achieve, we have to somehow reject some of the undesirable sequences. Equivalently, we have to try to concentrate the pre-trained generative model towards the sequences that are desirable.
You can imagine the ideal scenario where we take every single sequence the model might generate and manually label each of them with the probability that they will solve our task. Then we can pick sequences from this set according to the probability that they'll work and the probability that the model thinks they are real proteins.
Proteinguide attempts to approximate this ideal computation by guiding the generative model at each step of its sampling process by steering it away from sequences that might not work for the task at hand. This hinges on two things:
1. Having a generative model that reliably produces sequences that are relevant to the task
2. Having a predictive model that is able to identify which of these potentially relevant sequences are actually going to work
Related to this, it needs to be able to make that prediction for sequences that are only partially complete thus far.

Now, ensuring these two conditions is not actually trivial and, in practice, requires a couple of tricks that we want to share with you through this post. We'll start with an overview of the actual ProteinGuide algorithm, and then we'll talk about tricks for setting up ProteinGuide that we've found to be helpful in making it work for designing real sequences in the lab.


Over the last few years, various research groups have poured huge amounts of money into pretrainingi protein generative models. 
The hope is, eventurally, that these models will give us proteins that reliably fold well, express, and mimic the natural distribution of folds and functions among the organisms we'e studied--essentually a compact representation of all the sequence/structure data we have.
These models are now getting good enough to create proteins that express well, fold stably, and even have functions that are comm

But when we're designing a protein for a real-world problem, we don't want any random protein, even if it is realistic and performs some random function well. We want a protein that solves our problem. We can imagine that if we enumerated every single sequence that our model might produce, what we want is just the subset that adequately solve our task of intrest.

ProteinGuide is a way to approximately achieve that idealized operation using some tools from machine learning and statistics. The idea is that we'll first cook up a model that can rate any sequence and give us a probability that iwill succed in solving our task of interest, such as catalyzing a reaction with a certain efficiencu under laboratory conditions. However, instead of waiting until the model has already generated a sequence in order to reject the undesirable sequences, we will actually guide the model at every step of generation to discard the moves we think are unlikely to work--or at least modify the probabliity that we make those modes according to their likelihood of success.  This operation, blending the predictive model of function with a pretrained generative model ends up stemming from one of the modst basic laws of probability theory, Bayes' rule.

In this sense, ProteinGuide, always does what it's supposed to. It always gives us the sequence from our generative model that are likely to satisfy our predictor. However, the quality of those samples in terms of actually solving our task of interest depend on the quality of the pretrained generative model and the predictive model.  In this post, we will walk you through a high livel framework for the kinds of ways in which the predictive model or generative model break down and then give you a practical workflow that's a good starting place for using ProteinGuide in your work.



what if I assume that the reader has all the basic knowledge and just go from there.


</section>