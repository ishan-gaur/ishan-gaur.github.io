---
title: A Cell-Cycle Resolved Multi-Scale Map of the Cell
authors: <u>Ishan Gaur</u>, Trang Le, Emma Lundberg
pub_date: January 3, 2024
sort_date: 2024-01-03
venue: Poster at Pacific Symposium on Biocomputing
links: [
  {
    url: ./assets/music3_poster.jpg,
    text: Poster
  },
  {
    url: ./misc/music3_code,
    text: Code
  }
]
tags: paper
---
A large fraction of the human proteome displays significant cell-to-cell variability, but how this variability impacts functional assemblies across biological scales is poorly understood. In this work, we explore cell-cycle–dependent variation in the U2-OS cell line by building MuSIC hierarchies for cells in G1, the G1–S transition, and G2. MuSIC maps integrate immunofluorescence imaging and affinity-purification mass spectrometry data to predict a structural hierarchy of components constituting the cell. Using a pseudotime model trained to predict FUCCI marker dynamics from DAPI and tubulin reference channels, we are able to sample single-cell imaging data by cell-cycle phase to generate phase-specific maps. Examining these proteome-scale variations, we show that cell-cycle–dependent components form, dissolve, and translocate between phases across all scales. Using SC embeddings, we also find components that multilocalize across different organelles or show different robustness across cell-cycle phases. This method provides a general framework to model dynamic changes in cell physiology across disease or drug perturbations, environmental changes, or patient heterogeneity.
