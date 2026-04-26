
<section>

## ProteinGuide in Practice {#workflow}

This post assumes some basic familiarity with generative models, training regression/classification models, and Bayes' rule. I will be posting several pieces, ranging from primers to reviews in an attempt to synthesize what I've learned from using these methods over the last two years and my work the last few months to read through the key works in the field. I'll be drawing not only from work in machine learning (Diffusion, GANs, VAEs, Deep Belief Networks, etc.) but also the development of Monte Carlo methods during WWII, Shannon's information theory, Markov's investigations of poetry, and Laplace's interest in applying the theory of games of chance to astronomy. If you're interested, feel free to subscribe to my substack. I will be cross posting everything there as well.

What follows is a living document recording the Listgarten lab's current best practices for using ProteinGuide. The post is divided into three sections. The first section describes a conceptual framework for how ProteinGuide works in the ideal case, which will help us categorize the main challenges faced when applying the technique in the real world. The second section examines each of these possible failure modes in detail and describes strategies you might consider when faced with these issues in your own work. The final section organizes these ideas into the default workflow we start with for using ProteinGuide with collaborators.

GRAPHIC DESCRIPTION: A large array of boxes connected by lines in a grid. Each one represents a sequence and the other sequences that are one mutation away from it. Each box is split in two diagonally. Most have a light gray x in both boxes. Some have an orange checkmark symbolizing that these are realistic proteins. Some have a blue checkmark symbolizing that these are proteins that solve the task of interest. A medium sized region, containing all of the blue checkmarks and some neighboring orange checkmarks is outlined in red. This is the region of sequences that we think is reasonable to sample from, and which our experimental data is collected from.

- ideal computation; how proteinguide approximates it
  - you can see that the generative model and the predictive model share the burden of finding successful sequences. if the generative model is poor, the predictive model needs to be able to predict stability and expression to correctly predict function. if the predictive model is weak just identifying a few motifs or mutational patterns that work on sequences close to the wildtype, but the generative model is already likely to produce reasonable sequences, you may still get reasonable results.
  - important things are to explain:
    - that the predictive model is what defines the conditional distribution
    - so anything you want in your protein that isn't captured by the generative model needs to be captured by the predictive model
      - because the predictive model is normally trained on limited experimental data, it's normally easier to improve your generative model or constrain the design task to something that your generative model can handle reasonably well.
    - that because we are guiding intermediate generation steps, the generative model must forecast how the generative model will complete a partial sequence--the closer the predictive model's training data is to the generative model, the better
      - this is most easy to solve at the very beginning with designing the initial library
      - barring that, if you like that initial library, you can make your generative model approximate it, at the danger of losing some of its in-built knowledge of the natural distribution of sequences
      - finally you can try to distill the clean model's predictions on the generative model's distribution
      - because it would be difficult to train a predictive model on limited data that capture all your design desiderate, you have to make sure that the base generative model is setup to produce sequences that are as relevant to your task as possible
    - that the predictive model needs to be calibrated to the generative model's distribution (at least roughly) in order to make good decisions for partially masked sequences
    - that ideally your generative model and predictive model are amplifying each other's strengths. if your generative model is not concentrated enough of the relevant sequences, the predictive model might end up having to 

ProteinGuide is a method for *classifier guidance* of discrete generative models.

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
