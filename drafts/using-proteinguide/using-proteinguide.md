---
title: A UserGuide for ProteinGuide
layout: blog.liquid
---

<section>

<!--
Benefits of guidance vs DPO--not SFT
- Lighter weight so you can change design objectives on the fly
- Easier to ensemble predictors than generative models (although LoRA)
- You have more control over the architecture of the predictor than the generative model, so you can bake in more domain knowledge
- You can do hacky stuff like setting hard minimums for mutational distance
- DPO might have noisier gradient estimates because order matters?? Maybe that's shared for both though.
-->
Generative models of protein sequence, such as ProteinMPNN, ESM, and ProGen, lack an interface for users to specify their functional design objectives. Models like ProteinMPNN and ESM3 can be used to generate sequences that fold into a target backbone, but they have no understanding of the biological properties we actually care about. <!-- For example, someone designing a biologic might like to achieve a certain balance of binding affinity, off-target activity, and thermostability. -->

In our recent pre-print, [ProteinGuide](https://arxiv.org/abs/2505.04823), we describe a method that allows users to design libraries according to multiple functional constraints simultaneously. It also enables users to get more out of pretrained generative models by leveraging their wet-lab data during the design process. In this guide, we will review how ProteinGuide works, how to troubleshoot some common issues, and what a practical workflow for using ProteinGuide looks like.

ProteinGuide provides a way to extract sequences from a pretrained {% color "blue" %}generative model{% endcolor %} that are predicted to satisfy functional properties we care about. To do this, ProteinGuide uses a lightweight {% color "darkorange" %}property prediction model{% sidenote "<img src='predictive_model.png' alt='Predictive model diagram' style='max-width:100%;height:auto' />" %}{% endcolor %}, trained on your wet-lab data, to iteratively "guide" the generative model towards sequences with higher fitness.

Although ProteinGuide is theoretically sound, its performance can be contingent on whether or not:
1. the {% color "blue" %}generative model{% endcolor %} produces relevant sequences for the task (even if they are suboptimal), and
2. the {% color "darkorange" %}predictive model{% endcolor %} sufficiently captures your remaining preferences about which proteins would be desireable.

These two assumptions can be restated as:
1. the generative model must accurately capture your {% color "blue" %}prior beliefs{% endcolor %} about which sequences make sense for this task
2. the predictive model must be able to determine which sequences from your prior have {% color "darkorange" %}sufficiently high fitness{% endcolor %}, based on your *wet-lab data*.

In this guide, we first review the basic procedure for using ProteinGuide, assuming these two conditions hold. Then we examine common ways in which these assumptions break down, and how these issues can be addressed. Finally, we walk through a practical workflow{% sidenote "In order to make it easier to use, ProteinGuide [is now available](https://ishan-gaur.github.io/proteingen/workflows/protein-guide/) in the [ProtStar](https://ishan-gaur.github.io/proteingen/) python package for ML-based libary design."%} for ProteinGuide and link to an FAQ page with edge cases that you can explore as needed.

<!-- TODO link the FAQs -->
<!-- TODO write the post on unifying discrete generative models -->

</section>

<section>

## Table of Contents

<nav>
  <ol>
    <li><a href="#intro">ProteinGuide in Theory</a></li>
    <li><a href="#reality">Reality Check</a></li>
    <li><a href="#workflow">A Practical Workflow</a></li>
  </ol>
</nav>

</section>

<section>

## ProteinGuide in Theory {#intro}

This section provides an intuitive introduction{% marginnote "For readers with a statistics or machine learning background, we provide formal definitions and equations in the margins." %} to protein sequence generative models and ProteinGuide. 

ProteinGuide uses a predictive model of protein fitness to guide{% sidenote "ProteinGuide is a form of classifier guidance for discrete generative models."%} a pretrained sequence generative model. To understand how this works, we first need to understand how generative models operate. Then we will layer in how the predictive model enables guidance, and how the predictive model is trained.{% marginnote "<img src='generative_model.png' alt='Generative model diagram' style='max-width:100%;height:auto' />" %} 

{% color "blue" %}Generative models{% endcolor %} are trained to "fill-in-the-blank". As input, they take protein sequences where some positions are masked and they predict the missing amino acids. This allows them to design sequences by iteratively inserting amino acids into masked positions in the original sequence, until the sequence is fully unmasked.

An important detail is that they don't directly output the amino acid to be inserted. Instead, they look at all the 20 amino acids and assign each of them a probability of being the correct amino acid for that position. We then look at these probabilities and use them to randomly sample an amino acid for that position. Because of this, the generative model is not deterministic. Even if you start with the same masked sequence, you can get different outputs each time you run the sampling procedure.

<figure class="fullwidth"><img src='masked_generation.png' alt='Timeseries of the Masked Generation Process/' style='max-width:100%;height:auto' /></figure>

<br><br>
{%- capture pg_mask_note -%}
When we talk about generative models here, we're referring to any-order autoregressive models (or equivalently masked language, discrete diffusion, or discrete flow matching models). 
<br><br>
We model a protein as a sequence $x$ of amino acids $\mathcal{A}$ of length $L$ (*i.e.* $x \in \mathcal{A}^L$). Let $M(x, t):(\mathcal{A}^L \times [0, 1]) \rightarrow \\{\mathcal{A} \cup \text{\<mask\>}\\}^L$ be a function that randomly masks each position in $x$ with probability $t$. The generative model, typically parameterized by a decoder-only transformer, estimates the marginal distribution  $P(x_i|M(x, t))$ at all masked positions $x_i$, conditioned on a partially masked input sequence. We denote the distribution induced by the generative model's predictions $P_\theta$.
<br><br>
The generative model is typically trained using an ELBO and can be sampled from in a variety of ways. In the main text, we describe sampling from the model using an *any-order autoregressive* procedure.
{%- endcapture -%}

This non-determinism is a very important property.{% marginnote pg_mask_note %} It is exactly what allows us to use the generative model to create a library of diverse proteins. Specifically, the chance that we select a given variant is proportional to how good the model thinks it is. Unfortunately, if the model doesn't know the specifics of our design problem, then this will be reflected in the proteins it generates. They will be reasonable sequences, but may not actually work for our task. This is where the predictive model comes in.

**top-down view of the tree with proteins at the end, labeled by prior and fitness, **

We can visualize this process as the model navigating a tree of decisions until it reaches a complete sequence at the end. We can even label the tree based on which endpoints are realistic proteins. We can also label the endpoints which have high fitness for our task, such as binding a target receptor.

In proteinguide, the goal is to tweak the model's amino acid choices at each step so that it only produces sequences that are reasonable proteins with high fitness (boxed). What's the natural way to do this? Well, imagine there was only one amio acid left.

**Depth one tree with labels**

All we have to do is allow the model to make the mutations that work, and stop it from making the mutations that are bad. What if we're two steps away? We might count the proportion of the model-generated sequences from each node that end up having high fitness. It turns out that multiplying these probabilities by the model's original probabilities gives you a new distribution, called a conditional distribution. It is the distribution of your generative model conditioned on the fact that it needs to generate a high fitness variant. In fact, if you could calculate these probabilities exactly, and at least one high fitness variant exists, this procedure would never fail.

**Depth two tree and multiplying distributions to get the conditional distribution**

However, this procedure clearly isn't realistic. If we are going to test every possible sequence anyway, we wouldn't have needed ML models in the first place. Instead, what we actually do is try to train a model of the true probability of succes from a partially masked sequence from a set of assay-labeled samples from the model. This is called the noisy predictor. The way this works is you generate a bunch of partial masking of the sequences in your dataset and have the model predict the label of the original sequence. 

Now that we have a pre-trained generative model and a noisy predictor, in order to sample a sequence conditioned on the fact that we wanted to have a certain fitness, all we have to do is at each step get the predictions from the noisy predictor for which amino acids are likely to result in a success. Multiply that against the generative model's original belief for which amino acids are appropriate. And then randomly sample an amino acid according to those probabilities.

We can summarize the ProteinGuide algorithm as follows: 



## Reality Check {#reality}



## A Practical Workflow {#workflow}



</section>