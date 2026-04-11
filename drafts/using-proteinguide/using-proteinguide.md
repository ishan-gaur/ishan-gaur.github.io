---
title: An Informal UserGuide for ProteinGuide
layout: blog.liquid
---

<section>

Earlier this year, we released a [pre-print](https://arxiv.org/abs/2505.04823) entitled ProteinGuide. It describes a general method for blending wet-lab data and pretrained generative models for library design. Pretrained generative models such as ESM3, ProteinMPNN, and DPLM, are trained to fill in partial protein sequences, enabling them to even generate full sequences from scratch. However, as protein designers, these tools offer no way to input our design goals, such as optimizing stability or binding affinity.

ProteinGuide provides a way to extract {% color "blue" %}sequences from a pretrained generative model{% sidenote "<img src='generative_model.png' alt='Generative model diagram' style='max-width:100%;height:auto' />" %}{% endcolor %}—like ProteinMPNN, ESM, or ProGen—that are {% color "darkorange" %}predicted to satisfy the functional properties{% endcolor %} we care about. To do this, ProteinGuide uses a lightweight property prediction model, trained on your wet-lab data, to iteratively "guide" the generative model towards sequences with higher fitness.

Although ProteinGuide is theoretically sound, its performance can be contingent on whether or not:
1. the {% color "blue" %}generative model{% endcolor %} produces relevant, even if suboptimal, sequences for my task, and
2. the {% color "darkorange" %}predictive model{% sidenote "<img src='predictive_model.png' alt='Predictive model diagram' style='max-width:100%;height:auto' />" %}{% endcolor %} sufficiently captures my remaining preferences about which proteins are desireable.

These two assumptions can be restated as:
1. the generative model must capture your {% color "blue" %}prior beliefs{% endcolor %} about which sequences make sense for this task
2. the predictive model must accurately determine, based on your {% color "darkorange" %}wet-lab data{% endcolor %}, which sequences from your {% color "blue" %}prior{% endcolor %} are most desireable.

In this guide{% sidenote "Note that this post does not include a mathematical treatment of ProteinGuide. For more background please check out the [pre-print](https://arxiv.org/abs/2505.04823), our lab's [prior work](https://proceedings.iclr.cc/paper_files/paper/2025/hash/597254dc45be8c166d3ccf0ba2d56325-Abstract-Conference.html) on discrete classifier guidance, and my post on discrete generative models." %}, we first review the basic procedure for using ProteinGuide, assuming these two conditions hold. Then we examine common ways in which these assumptions break down, and how this can be addressed. Finally, we walk through a practical workflow for ProteinGuide and link to an FAQ page with edge cases that you can explore as needed. In order to make it easier to use, we've added this ProteinGuide workflow to the ProteinGen package as well.

<!-- TODO link the FAQs -->
<!-- TODO write the post on unifying discrete generative models -->

</section>

<section>

## Table of Contents

<nav>
  <ol>
    <li><a href="#intro">Introduction to ProteinGuide</a></li>
    <li><a href="#reality">Time for a Reality Check</a></li>
    <li><a href="#workflow">A Practical Workflow</a></li>
  </ol>
</nav>

</section>

<section>

## Introduction to ProteinGuide {#intro}

This section will provide an intuitive introduction to protein sequence generative models and ProteinGuide. For readers with a statistics or machine learning background, we provide more rigorous definitions and equations in the sidenotes.

**denoising image**

Generative models design sequences by iteratively inserting amino acids into masked positions in the original sequence.

**face and tree ahead; top-down view of the tree with proteins at the end, labeled by prior and fitness, **

We can visualize this process as the model navigating a tree of decisions until it reaches a complete sequence at the end. We can even label the tree based on which endpoints are realistic proteins. We can also label the endpoints which have high fitness for our task, such as binding a target receptor.

In proteinguide, the goal is to tweak the model's amino acid choices at each step so that it only produces sequences that are reasonable proteins with high fitness (boxed). What's the natural way to do this? Well, imagine there was only one amio acid left.

**Depth one tree with labels**

All we have to do is allow the model to make the mutations that work, and stop it from making the mutations that are bad. What if we're two steps away? We might count the proportion of the model-generated sequences from each node that end up having high fitness. It turns out that multiplying these probabilities by the model's original probabilities gives you a new distribution, called a conditional distribution. It is the distribution of your generative model conditioned on the fact that it needs to generate a high fitness variant. In fact, if you could calculate these probabilities exactly, and at least one high fitness variant exists, this procedure would never fail.

**Depth two tree and multiplying distributions to get the conditional distribution**

However, this procedure clearly isn't realistic. If we are going to test every possible sequence anyway, we wouldn't have needed ML models in the first place. Instead, what we actually do is try to train a model of the true probability of succes from a partially masked sequence from a set of assay-labeled samples from the model. This is called the noisy predictor. The way this works is you generate a bunch of partial masking of the sequences in your dataset and have the model predict the label of the original sequence. 

Now that we have a pre-trained generative model and a noisy predictor, in order to sample a sequence conditioned on the fact that we wanted to have a certain fitness, all we have to do is at each step get the predictions from the noisy predictor for which amino acids are likely to result in a success. Multiply that against the generative model's original belief for which amino acids are appropriate. And then randomly sample an amino acid according to those probabilities.

We can summarize the ProteinGuide algorithm as follows: 



## Time for a Reality Check {#reality}



## A Practical Workflow {#workflow}



</section>