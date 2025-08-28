<img src="/assets/ishan.png" alt="headshot" width="200">

Hi, I'm Ishan.

[Github](https://github.com/ishan-gaur)
[Twitter](https://x.com/Ishan__Gaur)
[LinkedIn](https://www.linkedin.com/in/ishangaur/)
[Scholar](https://scholar.google.com/citations?user=PgW-8YIAAAAJ&hl=en)

## ABOUT
I’m a second-year PhD student at Berkeley AI Research, advised by [Jennifer Listgarten](http://www.jennifer.listgarten.com/). I work on generative models and agents for scientific discovery.

I spent part of my gap year at [Aviv Regev](https://www.gene.com/scientists/our-scientists/aviv-regev)'s group at Genentech, working on multimodal language models with the wonderful [Yongju Lee](https://x.com/LeeTaliq). Before that, I graduated from Stanford with bachelors and masters degrees in computer science and electrical engineering. During my time there, I was fortunate to have worked with [Emma Lundberg](https://lundberglab.stanford.edu/) on vision models for mapping dynamic changes in the human proteome. I also had a blast working on using new hardware accelerators to run machine learning algorithms in computer networks, advised by [Kunle Olukotun](https://engineering.stanford.edu/people/oyekunle-olukotun) and [Muhammad Shahbaz](https://gitlab.com/mshahbaz/mshahbaz.gitlab.io/-/wikis/home).

## RESEARCH

{% assign chron_papers = collections.paper | sort: 'data.sort_date' | reverse %}
{% for paper in chron_papers %}
  {% include "paper.liquid" paper: paper %}
{% endfor %}
