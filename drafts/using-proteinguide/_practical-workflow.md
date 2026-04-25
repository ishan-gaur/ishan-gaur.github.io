
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

1. Ensure your generative model is producing relevant sequences for your task.
2. Train a predictive model that captures the sequence-function relationship in your wet-lab data.
3. Dry run ProteinGuide with the predictive model to get a baseline for the performance you should expect with a noisy predictor.
4. Train the noisy predictor, taking care to ensure it matches the clean predictor's performance on the held-out data.
5. Iterate on steps 2-4 until your noisy predictor beats the step 3 baseline and the library looks reasonable according to your domain knowledge and risk tolerance.
6. Train a noisy predictor on the full dataset and run ProteinGuide to design your library.

</section>
