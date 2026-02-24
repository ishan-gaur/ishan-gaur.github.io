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
I'm a second-year PhD student at Berkeley AI Research, advised by [Jennifer Listgarten](http://www.jennifer.listgarten.com/). I work on generative models and agents for scientific discovery.<label for="sn-service" class="margin-toggle sidenote-number"></label><input type="checkbox" id="sn-service" class="margin-toggle"/><span class="sidenote">I am also an <a href="https://peers.eecs.berkeley.edu/">EECS Peer</a> and help run the <a href="https://bair.berkeley.edu/blog/">BAIR Blog</a>.</span>

I spent part of my gap year at [Aviv Regev](https://www.gene.com/scientists/our-scientists/aviv-regev)'s group at Genentech, working on multimodal language models with the wonderful [Yongju Lee](https://x.com/LeeTaliq). Before that, I graduated from Stanford with bachelor and master degrees in computer science and electrical engineering. During my time there, I was fortunate to have worked with [Emma Lundberg](https://lundberglab.stanford.edu/) on vision models for mapping dynamic changes in the human proteome. I also had a blast working on using new hardware accelerators to run machine learning algorithms in computer networks, advised by [Kunle Olukotun](https://engineering.stanford.edu/people/oyekunle-olukotun) and [Muhammad Shahbaz](https://gitlab.com/mshahbaz/mshahbaz.gitlab.io/-/wikis/home).

</section>

<section>

## What's New?

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
