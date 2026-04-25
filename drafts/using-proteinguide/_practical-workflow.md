
<section>

## ProteinGuide in Practice {#workflow}

1. Ensure your generative model is producing relevant sequences for your task.
2. Train a predictive model that captures the sequence-function relationship in your wet-lab data.
3. Dry run ProteinGuide with the predictive model to get a baseline for the performance you should expect with a noisy predictor.
4. Train the noisy predictor, taking care to ensure it matches the clean predictor's performance on the held-out data.
5. Iterate on steps 2-4 until your noisy predictor beats the step 3 baseline and the library looks reasonable according to your domain knowledge and risk tolerance.
6. Train a noisy predictor on the full dataset and run ProteinGuide to design your library.

</section>
