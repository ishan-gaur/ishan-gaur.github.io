---
title: UserGuide for ProteinGuide
layout: blog.liquid
---

<section>

Earlier this year, we released a [pre-print](https://arxiv.org/abs/2505.04823) entitled ProteinGuide. It describes a general method for blending wet-lab data and pretrained generative models for library design. Pretrained generative models such as ESM3, ProteinMPNN, and DPLM, are trained to fill in partial protein sequences, enabling them even generate full sequences from scratch. However, as protein designers, we have no natural way to communicate our design goals, such as optimizing stability or binding affinity, to these tools. ProteinGuide provides a way to extract {% color "blue" %}sequences from the generative model{% endcolor %} that are {% color "darkorange" %}predicted to satisfy the functional properties we care about{% endcolor %}. To do this, ProteinGuide uses a lightweight property prediction model, trained on your wet-lab data, to iteratively "guide" the generative model towards sequences with higher fitness.

Although ProteinGuide is theoretically sound, its performance can vary according to the validity of the following assumptions:
1. that the {% color "blue" %}generative model{% endcolor %} produces relevant, but perhaps suboptimal sequences for my task, and
2. that the {% color "darkorange" %}predictive model{% endcolor %} sufficiently captures my remaining preferences about the protein I want to create.x    

These two conditions can be restated as:
1. the generative model captures my {% color "blue" %}prior beliefs{% endcolor %} about which sequences make sense for this task
2. the predictive model can accurately determine, based on your {% color "darkorange" %}wet-lab data{% endcolor %}, which of these sequences are most desireable.

In this guide{% sidenote "Note that this post does not include a mathematical treatment of ProteinGuide. For more background please check out the [pre-print](https://arxiv.org/abs/2505.04823), our lab's [prior work](https://proceedings.iclr.cc/paper_files/paper/2025/hash/597254dc45be8c166d3ccf0ba2d56325-Abstract-Conference.html) on discrete classifier guidance, and my post on discrete generative models." %}, we first review the basic procedure for using ProteinGuide, assuming these two conditions hold. Then we examine common ways in which these assumptions break down, and how this can be addressed. Finally, we walk through a practical workflow for ProteinGuide and link to an FAQ page with edge cases that you can explore as needed. In order to make it easier to use, we've added this ProteinGuide workflow to the ProteinGen package as well.

<!-- TODO link the FAQs -->
<!-- TODO write the post on unifying discrete generative models -->

</section>

<section>

## Table of Contents

<nav>
  <ol>
    <li><a href="#intro-to-rbms">Intro to RBMs and learning by MCMC</a></li>
    <li><a href="#finite-depth">Finite depth networks representing infinite depth stacks</a></li>
    <li><a href="#being-proper">Being proper and rigorous is overrated?</a></li>
  </ol>
</nav>

</section>

<section>

The job of the noisy predictor is to efficiently answer the question: "Suppose we inserted amino acid AA here and then the generative model went about its business filling in the rest of the sequence like normal. What would be the probability that the fitness of that sequence would exceed my target threshold, that $f(x) = y > y*$.

Notice earlier that I said *efficiently* answer the question. If you re-read the previous statement, it's clear that this could be answered by sufficient simulation. We could simply fix the AA at the current position and then have the generative model complete the sequence many times over. However, the empirical observation is that 


Every time you run a pretrained generative model, like ESM3, ProteinMPNN, or DPLM, the model will output a plausible sequence at random. We can think of this sequence as a random variable $x$ and imagine that if we kept sampling sequences from the model *ad-infinitum*, we should right down the frequency of each possible sequence, giving us a mapping from sequences to the probability of observing that sequence, a function we denote $p(x)$. 

{% sidenote "See these footnotes for some recent papers[^1][^2][^3] I think are asking interesting questions." %}
</section>

[^1]: How should we bring the computational or algorithmic properties of the observer into our understanding of the information that can be learned from a dataset (Epiplexity paper)?

[^2]: Should the unit of analysis in engineering stable, fast training be the "module" level and not end-to-end dynamics of a network (Muon)?

[^3]: How should we compare learning objectives when we know we won't minimize the loss? Is the traditional analysis of the minimizers being desirable enough?