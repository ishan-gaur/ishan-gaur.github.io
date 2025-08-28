---
title: Guide your favorite protein sequence generative model
venue: arXiv preprint arXiv:2505.04823
pub_date: May 7, 2025
sort_date: 2025-05-07
authors: Junhao Xiong<sup>*</sup>, Hunter Nisonoff<sup>*</sup>, Maria Lukarska<sup>*</sup>, <strong>Ishan Gaur<sup>*</sup></strong>, Luke M Oltrogge, David F Savage, Jennifer Listgarten
equal_contribution_note: "* Equal contribution"
links: [
  {
    url: https://arxiv.org/abs/2505.04823,
    text: "Paper"
  },
  {
    url: https://github.com/junhaobearxiong/protein_discrete_guidance,
    text: "Code"
  },
  {
    url: https://zenodo.org/records/15635061?token=eyJhbGciOiJIUzUxMiJ9.eyJpZCI6ImMzY2FlYTM4LWFlMzAtNDllMy1iOTE1LTJiYmRkNDVmZDQxMSIsImRhdGEiOnt9LCJyYW5kb20iOiJlZTY4NDVmNGQ5NWFiM2MxYmI0YjRmODJiOTJhYTE3MCJ9.VNKn_YoWTdp0QMDMUWcNaWOhyxYo-HwpFHYDXwfaYCMI6Gycg_xcwox216VlFFp6C584MYJ3jwItPvHW7ERlQw,
    text: "Dataset"
  }
]
tags: paper
---
Generative machine learning models on sequences are transforming protein engineering. However, no principled framework exists for conditioning these models on auxiliary information, such as experimental data, in a plug-and-play manner. Herein, we present ProteinGuide -- a principled and general method for conditioning -- by unifying a broad class of protein generative models under a single framework. We demonstrate the applicability of ProteinGuide by guiding two protein generative models, ProteinMPNN and ESM3, to generate amino acid and structure token sequences, conditioned on several user-specified properties such as enhanced stability, enzyme classes, and CATH-labeled folds. We also used ProteinGuide with inverse folding models and our own experimental assay to design adenine base editor sequences for high activity.
