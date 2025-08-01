---
title: "ColorSwap: A Color and Word Order Dataset for Multimodal Evaluation"
authors: Jirayu Burapacheep, <strong>Ishan Gaur</strong>, Agam Bhatia, Tristan Thrush
pub_date: Aug 6, 2024
venue: ACL
links: [
  {
    url: https://aclanthology.org/2024.findings-acl.99.pdf,
    text: "Paper"
  },
  {
    url: https://github.com/Top34051/colorswap,
    text: "Code"
  },
  {
    url: https://huggingface.co/datasets/stanfordnlp/colorswap,
    text: "Dataset"
  }
]
tags: paper
---
This paper introduces the ColorSwap dataset, designed to assess and improve the proficiency of multimodal models in matching objects with their colors. The dataset is comprised of 2,000 unique image-caption pairs, grouped into 1,000 examples. Each example includes a caption-image pair, along with a ``color-swapped'' pair. We follow the Winoground schema: the two captions in an example have the same words, but the color words have been rearranged to modify different objects. The dataset was created through a novel blend of automated caption and image generation with humans in the loop. We evaluate image-text matching (ITM) and visual language models (VLMs) and find that even the latest ones are still not robust at this task. GPT-4V and LLaVA score 72% and 42% on our main VLM metric, although they may improve with more advanced prompting techniques. On the main ITM metric, contrastive models such as CLIP and SigLIP perform close to chance (at 12% and 30%, respectively), although the non-contrastive BLIP ITM model is stronger (87%). We also find that finetuning on fewer than 2,000 examples yields significant performance gains on this out-of-distribution word-order understanding task.
