---
title: Writing
layout: base.liquid
---
## By Topic

<nav>
  <ol>
    <li><a href="./archival-ml/">Archival ML</a></li>
    <li><a href="./using-proteinguide/">Using ProteinGuide</a></li>
  </ol>
</nav>

# Most Recent Posts

<ul>
{%- for post in collections.all reversed -%}
  {%- if post.data.layout == "blog.liquid" and post.inputPath contains "./writing/" and post.inputPath contains ".md" -%}
    {%- unless post.inputPath contains "-draft.md" -%}
  <li>[{{ post.date | date: "%Y-%m-%d" }}] <a href="{{ post.url }}">{{ post.data.title }}</a></li>
    {%- endunless -%}
  {%- endif -%}
{%- endfor -%}
</ul>