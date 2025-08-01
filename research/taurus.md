---
title: "Taurus: A Data Plane Architecture for Per-Packet ML"
authors: Tushar Swamy, Alexander Rucker, Muhammad Shahbaz, <strong>Ishan Gaur</strong>, Kunle Olukotun
pub_date: Feb 28, 2022
venue: ASPLOS
awards: IETF Applied Networking Research Prize
links: [
  {
    url: https://dl.acm.org/doi/abs/10.1145/3503222.3507726,
    text: "Paper"
  },
  {
    url: https://gitlab.com/dataplane-ai/taurus/,
    text: "Code"
  }
]
tags: paper
---
Emerging applications---cloud computing, the internet of things, and augmented/virtual reality---demand responsive, secure, and scalable datacenter networks. These networks currently implement simple, per-packet, data-plane heuristics (e.g., ECMP and sketches) under a slow, millisecond-latency control plane that runs data-driven performance and security policies. However, to meet applications' service-level objectives (SLOs) in a modern data center, networks must bridge the gap between line-rate, per-packet execution and complex decision making.
In this work, we present the design and implementation of Taurus, a data plane for line-rate inference. Taurus adds custom hardware based on a flexible, parallel-patterns (MapReduce) abstraction to programmable network devices, such as switches and NICs; this new hardware uses pipelined SIMD parallelism to enable per-packet MapReduce operations (e.g., inference). Our evaluation of a Taurus switch ASIC—supporting several real-world models—shows that Taurus operates orders of magnitude faster than a server-based control plane while increasing area by 3.8% and latency for linerate ML models by up to 221 ns. Furthermore, our Taurus FPGA prototype achieves full model accuracy and detects two orders of magnitude more events than a state-of-the-art control-plane anomaly-detection system.
