
<section>

## ProteinGuide in Practice {#workflow}

ProteinGuide is a method for *classifier guidance* of discrete generative models.

Surprisingly, sampling from an arbitrary probability distribution is generally computationally intractable.
What makes the wave of generative models over the last ten years, encompasing large language models, image and video diffusion models, text-to-speech models, and protein design models so interesting is they admit natural, efficient sampling algorithms while also being able to 
- basically you can sample from them and train them on data to define a distribution that captures a lot of the underlying structure in the data that you care about
- however, when you sample from these models, you might not want a sample from the general distribution approximating your data. you might 
- what does that mean, to define a distribution approximating your data? there seems something interesting here about a collecting many observations of a deterministic process into memory, converting it into an algorithm that can create new things, and create them in such a way that relative to the properties we care about, there are no relevant differences between the things we create and the things we observed--ie no difference in information from observations from one stream versus the other.

First thing I want to make clear is the ideal sampling algorithm that ProteinGuide is approximating. This should make clear what the method aims to achieve and what its natural limitations are. I hope it also helps to motivate the practical tricks we will discuss in this post, as they are designed to reduce the gap between the ideal sampling algorithm and what actually happens when we run ProteinGuide under realistic conditions.

The goal of ProteinGuide is to allow us to sample from a property-conditional distribution of our pretrained generative model. The pretrained generative model is a randomized algorithm that produces different protein sequence each time we run it. The population of sequences it produces implicitly defines a probability distribution over the set of all possible sequences. If us machine learning practitioners did our job well, this distribution should have large peaks on regions of sequence space that correspond to reasonable sequences with functions that are likely to be observed in nature. The pretrained model's distribution should also place very little weight on sequences that are unlikely to fold stably or express well. We'll 

A pre-trained generative model can produce a huge variety of sequences; however, not all of them will be relevant to the task that we want to design a protein to solve. In order to get sequences that will actually serve the purpose we want them to achieve, we have to somehow reject some of the undesirable sequences. Equivalently, we have to try to concentrate the pre-trained generative model towards the sequences that are desirable.
You can imagine the ideal scenario where we take every single sequence the model might generate and manually label each of them with the probability that they will solve our task. Then we can pick sequences from this set according to the probability that they'll work and the probability that the model thinks they are real proteins.
Proteinguide attempts to approximate this ideal computation by guiding the generative model at each step of its sampling process by steering it away from sequences that might not work for the task at hand. This hinges on two things:
1. Having a generative model that reliably produces sequences that are relevant to the task
2. Having a predictive model that is able to identify which of these potentially relevant sequences are actually going to work
Related to this, it needs to be able to make that prediction for sequences that are only partially complete thus far.

Now, ensuring these two conditions is not actually trivial and, in practice, requires a couple of tricks that we want to share with you through this post. We'll start with an overview of the actual ProteinGuide algorithm, and then we'll talk about tricks for setting up ProteinGuide that we've found to be helpful in making it work for designing real sequences in the lab.


Over the last few years, various research groups have poured huge amounts of money into pretrainingi protein generative models. 
The hope is, eventurally, that these models will give us proteins that reliably fold well, express, and mimic the natural distribution of folds and functions among the organisms we'e studied--essentually a compact representation of all the sequence/structure data we have.
These models are now getting good enough to create proteins that express well, fold stably, and even have functions that are comm

But when we're designing a protein for a real-world problem, we don't want any random protein, even if it is realistic and performs some random function well. We want a protein that solves our problem. We can imagine that if we enumerated every single sequence that our model might produce, what we want is just the subset that adequately solve our task of intrest.

ProteinGuide is a way to approximately achieve that idealized operation using some tools from machine learning and statistics. The idea is that we'll first cook up a model that can rate any sequence and give us a probability that iwill succed in solving our task of interest, such as catalyzing a reaction with a certain efficiencu under laboratory conditions. However, instead of waiting until the model has already generated a sequence in order to reject the undesirable sequences, we will actually guide the model at every step of generation to discard the moves we think are unlikely to work--or at least modify the probabliity that we make those modes according to their likelihood of success.  This operation, blending the predictive model of function with a pretrained generative model ends up stemming from one of the modst basic laws of probability theory, Bayes' rule.

In this sense, ProteinGuide, always does what it's supposed to. It always gives us the sequence from our generative model that are likely to satisfy our predictor. However, the quality of those samples in terms of actually solving our task of interest depend on the quality of the pretrained generative model and the predictive model.  In this post, we will walk you through a high livel framework for the kinds of ways in which the predictive model or generative model break down and then give you a practical workflow that's a good starting place for using ProteinGuide in your work.



what if I assume that the reader has all the basic knowledge and just go from there.



1. Ensure your generative model is producing relevant sequences for your task.
2. Train a predictive model that captures the sequence-function relationship in your wet-lab data.
3. Dry run ProteinGuide with the predictive model to get a baseline for the performance you should expect with a noisy predictor.
4. Train the noisy predictor, taking care to ensure it matches the clean predictor's performance on the held-out data.
5. Iterate on steps 2-4 until your noisy predictor beats the step 3 baseline and the library looks reasonable according to your domain knowledge and risk tolerance.
6. Train a noisy predictor on the full dataset and run ProteinGuide to design your library.

</section>
