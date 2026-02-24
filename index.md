---
title: Ishan Gaur
layout: base.liquid
---
<img src="/assets/ishan.png" alt="headshot" width="250">

<section>

Hi, I'm Ishan.

[Github](https://github.com/ishan-gaur)
[Twitter](https://x.com/Ishan__Gaur)
[LinkedIn](https://www.linkedin.com/in/ishangaur/)
[Scholar](https://scholar.google.com/citations?user=PgW-8YIAAAAJ&hl=en)

</section>

<section>

## About
I’m a second-year PhD student at Berkeley AI Research, advised by [Jennifer Listgarten](http://www.jennifer.listgarten.com/). I work on generative models and agents for scientific discovery.

I spent part of my gap year at [Aviv Regev](https://www.gene.com/scientists/our-scientists/aviv-regev)'s group at Genentech, working on multimodal language models with the wonderful [Yongju Lee](https://x.com/LeeTaliq). Before that, I graduated from Stanford with bachelor and master degrees in computer science and electrical engineering. During my time there, I was fortunate to have worked with [Emma Lundberg](https://lundberglab.stanford.edu/) on vision models for mapping dynamic changes in the human proteome. I also had a blast working on using new hardware accelerators to run machine learning algorithms in computer networks, advised by [Kunle Olukotun](https://engineering.stanford.edu/people/oyekunle-olukotun) and [Muhammad Shahbaz](https://gitlab.com/mshahbaz/mshahbaz.gitlab.io/-/wikis/home).

I am also an [EECS peer](https://peers.eecs.berkeley.edu/) and help run the [BAIR Blog](https://bair.berkeley.edu/blog/).

</section>

<section>

## What's New?

- [2/23] We just put out a [small library called DFM](https://github.com/ishan-gaur/dfm) for wrapping discrete generative models and using them with ProteinGuide. Eventually we will support most common MLMs and discrete diffusion models out of the box. These are special cases of discrete flow matching models, hence the name. The goal is to provide a package that improves interoperability for models, samplers, guidance, and finetuning algorithms in this space.
- [2/23] ProteinGuide talk at [Profluent](https://www.profluent.bio/): [Bear Xiong](https://x.com/junhaobearxiong?lang=en) and I gave a talk on our new preprint of [ProteinGuide](https://arxiv.org/abs/2505.04823b)

</section>

<section>

## Research

</section>

{% assign chron_papers = collections.paper | sort: 'data.sort_date' | reverse %}
{% for paper in chron_papers %}
  {% include "paper.liquid" paper: paper %}
{% endfor %}
