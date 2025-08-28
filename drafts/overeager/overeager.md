---
title: Jumping the Gun, or Catastrophic Failure from Taylor-Approximated Guidance and What We Can Do About It.
---
8 **experimental plots**, 3 *theoretical calculations*

Overview
- Conclusion upfront: TBD, for now assume **comparison of TAG, normalized TAG, and exact**

Experiment setup
- ESM, classifier on top, level-4 ECs trying to guide towards top 10 [^5]

Brief intro to guidance
- *Bayes' rule as a specific optimization objective* [^4]
- Exact vs TAG and why TAG [^7]
<!-- - **Dataset proportion of target classes versus model** [^6] -->

Predicting guidance performance from importance reweighting of unconditional samples [^3]
- **exact Gillespie recovers predicted accuracy**
- **TAG severely underperforms**

Why TAG fails and what to do about it
- **TAG experiences big jumps**
- Using **single jumps recover forward progress**.
- *due to being unnormalized*.
- *Normalization*. Briefly discuss projection and truncation. [^2]

Single jumps are slow, can we recover speed?
- **Normalized TAG with numerical integration. Normalized TAG with Gillespie.**
- **Comparing normalized predictions with exact.** [^1]

How much does this generalize to other problems? Is this specific to the Enzyme problem?
- **Screen other experiments in the paper using the unconditional technique** and compare to TAG results
- Use **normalized TAG to see how close we get to ideal** (assume that exact gets the predicted results)

[^1] To do this practically, get a subsample of TAG and exact predictions for a set of residues. Plot gradient norm against $p_\text{exact}(y|x_t)-p_\text{TAG}(y|x_t) = [p_\text{exact}(y|\tilde{x}_t) - p_\text{TAG}(y|\tilde{x}_t)]p(\tilde{x}_t|x_t)$. Note this assumes exact gets a better $p(y|x_t)$ than TAG, which may not always be true.

[^2] Current ESM setup has a mask token to which gradients can accrue, but I just drop it--like conditioning on a transition. $p(y|M, x_t)=p(y|x_t)=\sum_{a\in A} p(y|a, x_t)p(a|x_t)$ so should be able to normalize this total ratio to 1.

[^3] Footnote about conditional probability versus Bayesian update and using update view-point to increase guidance strength.

[^4] To be expanded as a separate post, for now just find out what kind of KL or variational objective this corresponds to. Convert $p(y)$ stuff to expectations, take the log, apply jensens, check online to compare.

[^5] Include paper appendix description as a footnote.

[^6] Removing because that is more related to data guidance not TAG

[^7] TAG eats a lot of memory per backward pass if using model in classifier, whether or not you want that depends on how good the transition estimates are. It's not worth doing that comparison until I think of comparisons to finetuning, including LoRA, preference, and transition matching