Can I do exponential with guidance--yes just take log
Can I do DPO with guidance--yeah just train classifier on ranks
Look at log likelihood curve of the data and use that to pick a partially masked level
Compare with the guided curve--orders matter--and the difference is the mutual information captured by the classifier
FT the generative model before applying guidance
Train classifier on clean classifier labels for unconditional samples
Add a "dataset" logit or explicit mutational penalty for the classifier
Check if the classifier declares sequences to be successes too early--indicates that it has global, but not local discrimination power
Mock up "generalization" by classifier/oracle train/test splits 
Check/increase variance of pretrained model
Use monte carlo rollouts