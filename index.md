---
title: Ishan Gaur
layout: base.liquid
---
<!-- <img src="/assets/ishan.png" alt="headshot" width="250"> -->

<section>

## About

Hi, I'm Ishan. {% marginnote "<img src='/assets/ishan.png' alt='' class='headshot'>" %} I'm a second-year PhD student at Berkeley AI Research, advised by [Jennifer Listgarten](http://www.jennifer.listgarten.com/). I work on generative models and agents for scientific discovery.

<!-- {% sidenote "I am also an <a href='https://peers.eecs.berkeley.edu/'>EECS Peer</a> and help run the <a href='https://bair.berkeley.edu/blog/'>BAIR Blog</a>." %} -->

I spent part of my gap year at [Aviv Regev](https://www.gene.com/scientists/our-scientists/aviv-regev)'s group at Genentech, working on multimodal language models with [Yongju Lee](https://x.com/LeeTaliq). Before that, I was an undergrad at Stanford. During my time there, I studies computer systems, was active in the startup community, and was fortunate to have worked with [Emma Lundberg](https://lundberglab.stanford.edu/) on vision models for mapping dynamic changes in the human proteome. I also had a blast working with new hardware accelerators, with [Kunle Olukotun](https://engineering.stanford.edu/people/oyekunle-olukotun) and [Muhammad Shahbaz](https://gitlab.com/mshahbaz/mshahbaz.gitlab.io/-/wikis/home).

Links:&emsp;<a href='https://x.com/Ishan__Gaur'>Twitter</a>&emsp;<a href='ishang@berkley.edu'>Email</a>&emsp;<a href='https://scholar.google.com/citations?user=PgW-8YIAAAAJ&hl=en'>Scholar</a>&emsp;<a href='https://github.com/ishan-gaur'>GitHub</a>

</section>

<section>

## What's New?
- [4/9] Re-released DFM as [Prot★](https://ishan-gaur.github.io/proteingen/) ("ProtStar"): it's been expanded with several new protein design libraries, utilities for folding proteins and create MSA datasets, and extensive tooling to help you leverage agents to produce library design pipelines.
- [2/23] Released [DFM](https://github.com/ishan-gaur/dfm): a small library providing a uniform interface for MLMs, DDMs, DFMs, AO-ARMs, and even AR models. It facilitates plug-and-play experimentation with new sampling, conditioning, and finetuning methods.
- [2/23] Bear Xiong and I give a talk on [ProteinGuide](https://arxiv.org/abs/2505.04823b) at [Profluent](https://www.profluent.bio/)

</section>

<section>

## Research

</section>

{% assign chron_papers = collections.paper | sort: 'data.sort_date' | reverse %}
{% for paper in chron_papers %}
  {% include "paper.liquid" paper: paper %}
{% endfor %}
