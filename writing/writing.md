---
title: Writing
layout: writing.liquid
---
## By Topic

<nav>
  <ol>
    <li><a href="./archival-ml/">Archival ML</a></li>
    <li><a href="./using-proteinguide/">Using ProteinGuide</a></li>
  </ol>
</nav>

## Most Recent Posts

<ul>
{%- for post in collections.writingPosts -%}
  <li>[{{ post.data["date-updated"] | default: post.date | ymdUtc }}] <a href="{{ post.url }}">{{ post.data.title }}</a></li>
{%- endfor -%}
</ul>