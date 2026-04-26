---
title: Using ProteinGuide
layout: blog.liquid
---

<section>

Earlier this year, we released a [pre-print](https://arxiv.org/abs/2505.04823) entitled ProteinGuide. It describes a general method for blending wet-lab data and pretrained generative models for library design.

This page contains a brief overview of ProteinGuide and an index of resources to help you use it. These links cover everything from getting up to speed on the [basics of generative modeling](./ddm-and-pg-intuition.md), to making [ProteinGuide work in practice](./proteinguide-in-practice.md), and [implementing your first pipeline](https://ishan-gaur.github.io/proteingen/workflows/protein-guide/) in Python.

If you have any questions or comments, we'd love to hear from you! Feel free to email me at <a href="mailto:ishang@berkeley.edu">ishang@berkeley.edu</a>.

## Resources

<nav>
  <ol>
    <li><a href="./ddm-and-pg-intuition.md">Intuitive Introduction to ProteinGuide</a></li>
    <li><a href="https://arxiv.org/abs/2505.04823">ProteinGuide Paper</a></li>
    <li><a href="./proteinguide-in-practice.md">Using ProteinGuide in Practice</a></li>
    <li><a href="https://ishan-gaur.github.io/proteingen/workflows/protein-guide/">ProteinGuide Python Workflow on ProtGen</a></li>
  </ol>
</nav>

## Overview

Pretrained generative models such as ESM3, ProteinMPNN, and DPLM, are trained to fill in partial protein sequences, enabling them to even generate full sequences from scratch. However, as protein designers, these tools offer no way to input our design goals, such as optimizing stability or binding affinity.

ProteinGuide provides a way to extract {% color "blue" %}sequences{% endcolor %} from a {% color "blue" %}pretrained generative model{% sidenote "<img src='generative_model.png' alt='Generative model diagram' style='max-width:100%;height:auto' />" %}{% endcolor %}—like ProteinMPNN, ESM, or ProGen—that are predicted to satisfy the {% color "darkorange" %}functional properties{% endcolor %} we care about. To do this, ProteinGuide uses a lightweight {% color "darkorange" %}property predictive model{% sidenote "<img src='predictive_model.png' alt='Predictive model diagram' style='max-width:100%;height:auto' />" %}{% endcolor %}, trained on your wet-lab data, to iteratively "guide" the generative model towards sequences with higher fitness.

Although ProteinGuide is theoretically sound, its performance can be contingent on whether or not:
1. the {% color "blue" %}generative model{% endcolor %} produces relevant, even if suboptimal, sequences for your task, and
2. the {% color "darkorange" %}predictive model{% endcolor %} sufficiently captures the remaining factors that determine your protein's fitness.

These two assumptions can be restated as:
1. the generative model must capture your {% color "blue" %}prior beliefs{% endcolor %} about which sequences make sense for this task
2. the predictive model must accurately determine, based on your {% color "darkorange" %}wet-lab data{% endcolor %}, which sequences from your {% color "blue" %}prior{% endcolor %} are most desireable.

<!-- TODO link the FAQs -->
<!-- TODO write the post on unifying discrete generative models -->

</section>