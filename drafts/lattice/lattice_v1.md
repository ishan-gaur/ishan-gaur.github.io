The core question of this article is: when we train a model to generate a sequence from a list of masked tokens, what should it generate?

Let's start with a thought experiment. Suppose we are trying to create a generative model of length-2 binary strings.

Considerations:
- Do we make sure all ways of getting to the same result are equally probably?
  - Path concentration is like a mode covering vs seeking model in terms of KL
  - Maybe connect this 
- Do we model the fact that we are training on an empirical sample from the real distribution?
- Do we model the fact that the real distribution is not stationary and is also evolving over time?

Generative model paradigms:
- direct simulation using user-specified initial condition
  - Related is transport from one condition to the next
- simulation with distributions for places of uncertainty to get a range of possible outcomes
- actually simulate the process of generating something by mapping a set of input conditions to something that can be sampled according to a known distribution: reduction of a distribution to transport+a simpler (known) distribution. What does it even mean to take away so much of the structure that the target distribution is no longer connected to the original problem--like masking, uniform, or gaussian?
- Optimization of a target score over a feasible region defined by constraints
- Markov chain that travels between all the known states according to some stationary distribution.
- What other old paradigms are there?
- What if we think of generative models and modeling evolution?
- The real system being modeled can perhaps be thought of as a set of boundary
conditions on what is possible, a state and time dependent propagation process,
and a state and time dependent, probabilitistic selection criteria.

Discrete Unmasking Models are a class of related methods that essentially seek to convert a fully masked sequence of known length[^1] into a sequence that is reasonable for that domain.

Need to do more research on the learning algorithms that are used and the types of models.

What is the general mathematical structure describing these geometries?
- I think you can embed them in a hyperbolic space.
- Obv I think of this as a lattice or crystal
- There must be language for this in combinatorics
- It can also be thought of as moving in the simplex of distributions and jumping to "facets"?? I think of the simplex--which is marginalizing or something?
- What is the connection to continuous models?
  - Can you think of this as a simplex where you have products over infinite states
  - This gives you total continuity and somehow makes things easier--why?
- What is the connection to graph generation?

[^1]: EditFlows should be included?
[^2]: Can reference that Theis paper on what makes for a good image. Don't want to find an image from the real world--(simulating the whole globe and the act of taking images and of being added to the dataset)--this would just copy the dataset entirely. We actually are looking for something that is much more subtle and worse defined.
