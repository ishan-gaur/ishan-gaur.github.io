Instead of trying to guide the base (unconditional) model to sample from a conditional distribution, our goal is to train a conditional generative model parameterized by the base model and a lightweight classifier. This makes it most comparable to LoRA-based conditional generation or a Flamingo-style architecture where we graft in some conditioning modality.

Why do it this way? Classifier has problems of distribution shift between it and the base model. This is both in terms of the $x_1$ distribution but also the generative distribution, where the unconditional model is an approximation of the minimizer. The conditional model is trained according to samples from the minimizer given the known $x\_1$ and the main problem here is that the minimizer is order agnostic whereas the base model isn't actually.

This doesn't solve issues of the event being rare and bayes' rule not working well. So long as the model is supported on the $x_1$ training distribution it does give a coherent way to train the classifier accordingly. What it doesn't do is solve the problem where you need other nuisance variables to describe the distribution shift between the model's distribution for $x_1$ when correctly conditioned on $y$ and the distribution you're training on--though I feel like I don't have a great framework here, maybe it does.

When we write down bayes rule (check out twisting papers): if the adjacent entries are equivalent, we just reweight at the end; if we group them into conditional terms we just have to sample those distributions coherently; if we make them consistent across terms.

Maybe there is a tradeoff in the data the classifier trains on. You can have transitions that are in-distribution for the unconditional model or you can have transitions that are relevant to the rare event. I think you can have both. You want to train your conditional model to work well on the early steps because it will greedily climb to increase y if any step has non-trivial spread in the values of y for each move. Once it reaches that, it will just sample the unconditional model. Once p(y|x) is high, guidance shouldn't do much *ideally*.

With the real model, p(y|x) jumps around a lot, but the classifier gets it almost always right in training. Furthermore, the unconditional model doesn't get the same accuracy as the classifier, indicating $p(y|x)p(x|x_0)$ is much different than $p(y|x_0)$. We must be leaving performance on the table.

Note here we get 20 predictions for $p(y|x)$.

We thought the issue was that the data was not the same as what the unconditional model was trained on. This is correct, but you can't train on that data or the unconditional samples because the event you want is so rare, p(y|x) will just go to random noise around 0. Instead, all we want is for the model to understand how much it needs to tilt the unconditional model at every stage in generation. Classifier accuracy indicates that the classifier is over optimistic--it doesn't understand cases where the unconditional model will miss the mark.

How does the training signal differ?

Does it matter that the y|x is inconsistent? no, we sample x every time and sampled y at the beginning. Bayes rule is just to write down the calculation for the distribution to sample x from, it doesn't exist by itself. We can just think of this as errors in the learned p(x|y). Maybe we can apply this constraint as an auxiliary loss but there are infinite such constraints. Regardless, this training method should help make it more consistent for inconsistencies showing up due to differences in the base model and the ideal transitions induced by $x_1$.
