---
title: Intuitive Introduction to ProteinGuide
layout: blog.liquid
---

<section>

This post provides an intuitive introduction{% marginnote "For readers with a statistics or machine learning background, we provide some formal definitions and equations in the margins, but feel free to skip these." %} to protein sequence generative models and ProteinGuide. This is part of our series of resources for using ProteinGuide, you can find the index page for this series [here](./../).

ProteinGuide uses a predictive model of protein fitness to guide{% sidenote "Specifically, ProteinGuide is a form of 'classifier guidance' for discrete generative models."%} a pretrained sequence generative model. {% marginnote "<img src='generative_model.png' alt='Generative model diagram' style='max-width:100%;height:auto' />" %} If you're unfamiliar with any of these terms, they will be explained below. At a high level, generative models design sequences, predictive models tell us which ones will work, and ProteinGuide gives a recipe for how to combine them to get high fitness sequences in a statistically sound way.

To understand how ProteinGuide works, we first need to understand how generative models operate. From there, we will layer in how predictive models enable guidance. Finally, we will discuss how the predictive model is trained and what the end-to-end ProteinGuide algorithm looks like.

### Discrete Generative Models in a Nutshell

{% color "blue" %}Generative models{% endcolor %} are trained to "fill-in-the-blank". As input, they take protein sequences where some positions are masked and they predict the missing amino acids. This allows them to design sequences by iteratively inserting amino acids into the masked positions, until the sequence is fully unmasked.

An important detail is that they don't directly output the amino acid to be inserted. Instead, they look at all the 20 amino acids and assign each of them a probability of being the correct amino acid for that position. We then look at these probabilities and use them to randomly sample an amino acid to actually insert.

<figure class="fullwidth"><img src='masked_generation.png' alt='Timeseries of the Masked Generation Process/' style='max-width:100%;height:auto' /></figure>

<!-- <pre><code>
Generative Model Sampling Procedure:

1. Start with a fully masked sequence: s = &lt;mask&gt;&lt;mask&gt;&lt;mask&gt;...&lt;mask&gt;
2. While s contains &lt;mask&gt;:
   a. Input s to the generative model
   b. The model returns probabilities of amino acids to insert at each position
   c. Randomly select a position to unmask, call this position i
   d. Insert an amino acid at position i according to the model's probabilities
   e. go to step 2
3. Return s
</code></pre> -->

<br>
{%- capture pg_mask_note -%}
When we talk about generative models here, we're referring to any-order autoregressive models (or equivalently masked language, discrete diffusion, or discrete flow matching models). 
<br><br>
We model a protein as a sequence $x$ of amino acids $\mathcal{A}$ of length $L$ (*i.e.* $x \in \mathcal{A}^L$). Let $M(x, t):(\mathcal{A}^L \times [0, 1]) \rightarrow \\{\mathcal{A} \cup \text{\<mask\>}\\}^L$ be a function that randomly masks each position in $x$ with probability $t$. The generative model, typically parameterized by a decoder-only transformer, estimates the marginal distribution  $P(x_i|M(x, t))$ at all masked positions $x_i$, conditioned on a partially masked input sequence. We denote the distribution induced by the generative model's predictions $P_\theta$.
{%- endcapture -%}

{% marginnote pg_mask_note %}Because of this, the generative model is not deterministic. Below is a video showing ESMC generating 8 different sequences in parallel. Observe that even though they all start with the same masked sequence, each sequence ends up being different.

<figure><video src='./../esm-sampling-crop.mp4' alt='Timeseries of the Masked Generation Process/' controls autoplay loop muted style='max-width:100%;height:auto;' /></figure>

This non-determinism is a very important property. It is exactly what allows us to use the generative model to create a library of diverse proteins. Using a generative model, the chance that we produce a given variant is proportional to how good the model thinks it is. But how does the model decide? Above I said that the model

>look\[s\] at all the 20 amino acids and assign\[s\] each of them a probability of being the correct amino acid for that position.

So what is this "probability of being correct"?

Imagine that we roll out all possible sequences that the model could generate from a given partially masked sequence. To keep things simple let's assume our "protein" is three amino acids long, is only made up of Leucine (<code>L</code>) and Tryptophan (<code>W</code>), and that we're unmasking it from left to right. We can now map out all the possible sequences we could generate as a tree. At each node, the model must decide which amino acid to add next. Each choice it makes moves it down the tree until it reaches a complete sequence at the end. 

For our toy problem, we'll say that any sequence with more <code>W</code>s than <code>L</code>s is a "real" protein. We'll label each of these with a blue checkmark.

<figure><img src='toy-generation-tree.png' alt='Tree of possible sequences' style='max-width:100%;height:auto;' /></figure>

Our goal is to create a generative model that is trained to all real proteins with equal probability{% sidenote "We want equal probability because this generative model is not for any specific task." %}. <!-- Of course, for a real sequence dataset like <code>Uniref</code> or <code>SwissProt</code>, it is not possible to memorize all the sequences so our models will be forced to understand properties of real proteins-->  {% marginnote "The generative model is typically trained using an ELBO and can be sampled from in a variety of ways. In the main text, we describe sampling from the model using an *any-order autoregressive* procedure." %} It turns out that it is really simple to define this idea model. Consider the node circled in red. All the model has to do is look downstream of a choice it might make and count how many real proteins it can generate from that point. Then it takes each of those counts and divides by the total number of real proteins it can generate from that point. If the model adds an <code>L</code> (left-hand branch in the tree), there is only one real protein it can make, which is <code>WLW</code>. If it adds a <code>W</code>, there are two real proteins it can make: <code>WWL</code> and <code>WWW</code>. Therefore, the model assigns a probability of $1/3$ to inserting an <code>L</code> and $2/3$ to inserting a <code>W</code>.

### Conditional Generation using Predictive Models

Now let's say, for our {% color "darkorange" %}design task{% endcolor %}, we want a protein that has at least one <code>L</code>. Of course, the protein has to be "real", so this requirement stacks on top of the first. We can mark the {% color "blue" %}"real" sequences{% endcolor %} with at least one <code>L</code> with an orange checkmark, and box the resulting {% color "purple" %}high fitness sequences{% endcolor %} that have at least one <code>L</code> in purple.

<figure><img src='guided_tree.png' alt='Tree of possible sequences with high fitness sequences boxed' style='max-width:100%;height:auto;' /></figure>

In the same way that the generative model picks out the "realistic" proteins in blue, the model that picks out our high fitness proteins is referred to as the {% color "purple" %}*property-conditioned* generative model{% endcolor %} or conditional generative model{% sidenote "Conditional generative model meaning a generative model that is taking into additional information about the desired protein at generation time. In this case, it is 'conditioning' on the fact that we want at least one L—it builds character, lol." %}. Note that this conditional generative model predicts different probabilities for selecting each branch at the circled node. Compared to the regular {% color "blue" %}*unconditional* generative model{% endcolor %}, the probability of adding a <code>W</code> went down from $2/3$ to $1/2$ under the conditional generative model, and the probability of adding an <code>L</code> went up from $1/3$ to $1/2$. 

{%- capture predictive_model -%}
WLOG, for a partially masked sequence $x^{(t)}=M(x, t)$, the predictive model estimates the probability of a property $y=f(x)$ of the sequence being above some threshold, $p(y>\tau|x)$. Here, $f$ is the "true" sequence-function relationship that we seek to optimize.
{%- endcapture -%}
<br><br>
In ProteinGuide, we want to generate sequences as if we had trained a conditional generative model—a task-specific model tuned to your design goal–but without actually training a new generative model from scratch. The way we do this is to first train a {% color "darkorange" %}predictive model{% endcolor %}{% sidenote predictive_model %}{% marginnote "<img src='predictive_model.png' alt='Generative model diagram' style='max-width:100%;height:auto' />" %} that predicts how likely the generative model is to create a high fitness sequence starting from a given sequence. In other words, it counts the proportion of sequences with the blue checkmarks that also have orange ones. We then use this model during sampling to adjust the {% color "blue" %}generative model's{% endcolor %} predictions for which amino acid to insert in such a way that the resulting probabilities become the same as a conditional generative model for our data. In other words, we implicitly construct a conditional generative model using the predictive model and generative model. We refer to this as the {% color "purple" %}guided generative model{% endcolor %} to contrast it conceptually with having to training a genuine conditional sequence generative model for your task.

{%- capture bayes_note_ -%}
Formally, $\color{purple}{p(x|y)} \color{black}{\propto} \color{orange}{p(y|x)} \color{black}{\cdot} \color{blue}{p(x)}$, where $\color{blue}{p(x)}$ is the distribution of sequences induced by the pretrained generative model, $\color{orange}{p(y|x)}$ is the distribution of fitness conditioned on sequence as estimated by the predictive model, and $\color{purple}{p(x|y)}$ is the distribution of sequences conditioned on fitness that we want to sample from. Note that at each generation step, we are only considering 20 amino acids, so we can compute the normalizing factor above directly.
{%- endcapture -%}
<br><br>
In ProteinGuide, the guided predictions for the next amino acid come from multiplying the predictive model's probability for getting a high fitness variant with the generative model's probabilty for that amino acid resulting in a realistic protein and renormalizing{% sidenote bayes_note_ %}. Informally, we can write this as:

<figure><p>$$\color{purple}{\text{Guided Model}} \color{black}{=} \color{darkorange}{\text{Predictive Model}} \color{black}{\times} \color{blue}{\text{Generative Model}}\color{black}{.}$$</p></figure>

Recall that each of these models is really solving a some counting problem. Specifically they count how many sequences in our tree are downstream of a certain node and satisfy particular conditions, with the conditions differing between the models. It turns out that each of these counting problems can be expressed as a fraction, allowing us to see that, under the hood, ProteinGuide is actually doing a very simple, intuitive operation
<figure><p>$$\color{purple}{\frac{\text{# high fitness}}{\text{# possible sequences}}} \color{black}{=} \color{darkorange}{\frac{\text{# high fitness proteins}}{\text{# proteins}}} \color{black}{\times} \color{blue}{\frac{\text{# proteins}}{\text{# possible sequences}}}\color{black}{.}$$</p></figure>

in order to make sure we only generate high fitness variants from the sequence landscape.

### Training the Predictive Model (coming soon)

<!--{% marginnote "This section is a stub, more coming soon." %}

All that's left is to train the predictive model. This ends up being quite simple. We take the sequences and fitness measurements from our wet-lab data and train a model to predict the fitness from the sequence. The only twist is that before inputting the sequence to the predictive model, we randomly pick a subset of the positions to mask. Nevertheless, this ends up just being a standard supervised learning problem, and you can use any architecture or training method you like. Because our predictive model ends up predicting the probability of success from a partially masked, or "noisy" sequence, it is sometimes referred to as a noisy classifier or noisy predictor.-->

<!--**Margin note on noising the samples.**-->

### The Basic ProteinGuide Algorithm (coming soon)

</section>
