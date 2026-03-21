---
title: The Elegance of Restricted Boltzmann Machines and the Effectiveness of an Intuitive but Improper Learning Algorithm
layout: base.liquid
---

<section>

I love machine learning because we can do magical things with neural networks, but the jury's still out on what an insightful, practical theory{% sidenote "Kuhn's view is that a useful theory helps us select a minimal set of properties from all the possible measurable attributes of a system, allowing the scientific community to drastically reduce the complexity of the problem. For successful theories, the resulting abstractions precipitate immense fecundity, enabling scientists to ask all kinds of new questions and make rapid progress on them." %} of machine learning will look like. Who knows which parts of probability and statistics, learning theory, optimization, etc. will end up being the "Newton's Laws" or "Central Dogma" for AI in the future.{% sidenote "See these footnotes for some recent papers[^1][^2][^3] I think are asking interesting questions." %}

As a result, since last November, I've been obsessed with reading old ML papers and piecing together how practitioners' mental models of machine learning algorithms have changed over time. Over the upcoming months, I'm planning to write about some of my favorite "Archival ML" papers. By "archival", I mean ground-breaking papers whose core ideas are now ubiquitous, but which most of us have never read; we learned those ideas from textbooks, blogs, or classes. 

I want to share the experience of rediscovering what was most beautiful about their work with you all. Some examples that I'm hoping to get to include Shannon's Theory of Communication (Information Theory), Markov Chains, "Discrete Diffusion"{% sidenote "[NADEs](https://jmlr.org/papers/v17/16-272.html) were essentially 'discrete diffusion' models known by another name, and predate GPT/BERT/MLMs!" %} and more. In this first post, I'm going to start with Boltzmann Machines which roughly refers to a line of work pioneered by Geoff Hinton, along with his students and collaborators in the 80s and 90s. Specifically, I'm going to cover the use of *Restricted* Boltzmann Machines in **Deep Belief Networks**. Curiously, Hinton and his collaborators first popularized unsupervised "pre-training" of these networks to get good initializations for training image classification models not for generative modeling. About a decade later, his student [Ilya Sutskever](https://en.wikipedia.org/wiki/Ilya_Sutskever){% sidenote "Whose [thesis](https://www.cs.utoronto.ca/~ilya/pubs/ilya_sutskever_phd_thesis.pdf) is low-key fire." %} would go on to lead the revolution in generative modeling and LLM scaling at OpenAI. 

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

## Intro to RBMs {#intro-to-rbms}

## Representing Stacks of RBMs that are Infinitely Deep {#finite-depth}

## Are rigorous learning objectives overrated? {#being-proper}



</section>

[^1]: How should we bring the computational or algorithmic properties of the observer into our understanding of the information that can be learned from a dataset (Epiplexity paper)?

[^2]: Should the unit of analysis in engineering stable, fast training be the "module" level and not end-to-end dynamics of a network (Muon)?

[^3]: How should we compare learning objectives when we know we won't minimize the loss? Is the traditional analysis of the minimizers being desirable enough?

