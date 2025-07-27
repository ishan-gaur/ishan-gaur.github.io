<img src="/img/ishan.png" alt="headshot" width="200">

Hi, I'm Ishan.

## ABOUT
I’m a second-year PhD student at Berkeley AI Research, advised by [Jennifer Listgarten](http://www.jennifer.listgarten.com/). I work on generative models and agents for scientific discovery.

I spent part of my gap year at [Aviv Regev](https://www.gene.com/scientists/our-scientists/aviv-regev)'s group at Genentech, working on multimodal language models with the wonderful [Yongju Lee](https://x.com/LeeTaliq). Before that, I graduated from Stanford with bachelors and masters degrees in computer science and electrical engineering. During my time there, I was fortunate to have worked with [Emma Lundberg](https://lundberglab.stanford.edu/) on vision models for maping dynamic changes in the human proteome. I also worked on using hardware accelerators to do machine learning in computer networks, advised by [Kunle Olukotun](https://engineering.stanford.edu/people/oyekunle-olukotun) and [Muhammad Shahbaz](https://gitlab.com/mshahbaz/mshahbaz.gitlab.io/-/wikis/home).

## RESEARCH

{% for paper in collections.paper %}
  {% include "paper.liquid" paper: paper %}
{% endfor %}
