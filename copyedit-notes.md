# Copy-editing Notes (2026-04-27)

Scope reviewed so far:
- `index.md`
- `writing/writing.md`
- `writing/using-proteinguide/using-proteinguide.md`
- `writing/using-proteinguide/ddm-and-pg-intuition.md`
- `writing/using-proteinguide/proteinguide-in-practice.md`
- `writing/archival-ml/archival-ml.md`
- `writing/using-proteinguide/proteinguide-in-practice-draft.md`
- `writing/using-proteinguide/_theory.md`
- `writing/using-proteinguide/_reality-check.md`

I also built the site and checked rendered links/resources for these pages.

## Progress update after your comments

### Top next priority (deferred, per your note)
- Fix Substack subscribe URL (`https://substack.com/@ishangaurr/subscribe`, currently 404).

### Applied edits
- ✅ Implemented all "Go ahead" typo/grammar/link fixes in:
  - `index.md`
  - `writing/using-proteinguide/using-proteinguide.md`
  - `writing/using-proteinguide/ddm-and-pg-intuition.md`
  - `writing/using-proteinguide/proteinguide-in-practice.md`
- ✅ Added placeholder margin/sidenote definitions for:
  - **oracle** (defined now)
  - **DEG** and **TAG** (TODO placeholders pointing to the ProteinGuide paper, for you to fill in)
- ✅ Linked **aleatoric** and **epistemic** uncertainty terms to Wikipedia.
- ✅ Standardized `pLDDT` casing in `proteinguide-in-practice.md`.
- ✅ Verified that the updated `../ddm-and-pg-intuition/` link resolves in the built website.

### Pending decisions from you
- `writing/using-proteinguide/proteinguide-in-practice.md`
  - `[overview]()` target is still empty.
  - `[here]()` target in the sidenote is still empty.

---

## 1) `index.md`

### Typos / grammar
- “I studies computer systems” → **“I studied computer systems.”** **Go ahead**
- News item tense is inconsistent:
  - “Bear Xiong and I **give** a talk…” → likely **“gave”** (to match dated past events). **Go ahead**

### Consistency / semantics
- Contact email appears as `ishang@berkley.edu` here, but elsewhere the site uses `ishang@berkeley.edu`. **The latter is correct.**

### Link/resource checks
- Email link is malformed:
  - Current: `<a href='ishang@berkley.edu'>Email</a>`
  - Should be mailto form, e.g. `href='mailto:ishang@berkeley.edu'`. **Go ahead**
- On rendered homepage research cards, this external link returns 404: **ignore--it's private for now**
  - `https://github.com/junhaobearxiong/protein_discrete_guidance`

---

## 2) `writing/writing.md`

### Typos / grammar
- No obvious grammar/typo issues found.

### Link/resource checks
- Topic links resolve:
  - `./archival-ml/`
  - `./using-proteinguide/`

---

## 3) `writing/using-proteinguide/using-proteinguide.md`

### Typos / grammar
- “go beyond **specifiying** a static structure” → **specifying**. **Go ahead**
- “most **desrreable..**” → **desirable.** **Go ahead**
- “**its** useful to be able to test…” → **it’s** useful. **Go ahead**
- “wetlab budget” → consider **wet-lab budget** (used elsewhere on the site). **Go ahead**

### Markup / structural issues
- Stray closing tag in sentence:
  - `The <a ...>Intuitive Introduction...</a></li> and ...`
  - Remove the extra `</li>`. **Go ahead**

### Readability / terminology
- “DPLM” appears without expansion/definition (may be opaque to some readers). **ignore**

### Link/resource checks
- Internal links on this page resolve.
- “A rough version is available, but this post is under active development.” (ProteinGen workflow sidenote) may be stale language; linked page exists and appears live. **ignore**

---

## 4) `writing/using-proteinguide/ddm-and-pg-intuition.md`

### Typos / grammar
- “trained to all real proteins with equal probability” → likely “trained to **assign** all real proteins equal probability.” **Go ahead**
- “this **idea** model” → **ideal** model. **Go ahead**
- “having to **training** a genuine conditional…” → **train**. **Go ahead**
- “generative model’s **probabilty**” → **probability**. **Go ahead**
- “solving **a some** counting problem” → remove one article.  **resolved**
- “**everytime** you sample…” → **every time**. **Go ahead**
- “Then **setup** the predictive model training…” → **set up** (verb form). **Go ahead**

### Consistency / semantics
- Section heading says “### Training the Predictive Model (**coming soon**)” but the section already contains substantial content. This reads as outdated. **Yes, delete the "coming soon" text.**

### Readability
- Acronyms/terms like **WLOG** and **ELBO** may need one-line definitions for broader readability. **ignore, the sidenotes/marginnotes can be technical without exposition**

### Link/resource checks
- Internal media and page links resolve in rendered output.

---

## 5) `writing/using-proteinguide/proteinguide-in-practice.md`

### Typos / grammar **Go ahead on all of these**
- “**checkout** my…” → **check out**.
- “function of interest is a **discerete** variable” → **discrete**.
- “parameterize **an tractable** distribution” → **a tractable**.
- “can **acheive** your function” → **achieve**.
- “most **desireable**” → **desirable**.
- “must **analyse**” (if using US spelling elsewhere) → **analyze**.
- “approximately **forcast**” → **forecast**.
- “On the other hand, **If** you already…” → lowercase **if**.
- “will be no longer be biased…” → remove extra “be” (e.g., “will no longer be biased…”).
- “sequences … no longer **covers**” → **cover**.
- “of have **to** little variance” → **too** little variance.
- Multiple uses of “setup” as a verb should be “set up.”

### Broken/empty links **Walk me through what you want to put in for each of these**
- Empty link target: `[overview]()`
- Empty link target in sidenote: `[here]()`
- Broken relative link in current URL context:
  - `[Intuitive Introduction to ProteinGuide](./ddm-and-pg-intuition.md)`
  - Should be something like `../ddm-and-pg-intuition/` **go ahead but make sure to test that it resolved in the built website**

### Readability / terminology consistency
- Several terms appear without definitions on first use: **OOD**, **LoRA**, **MSE**, **oracle**, **DEG**, **TAG**, **aleatoric/epistemic**. **don't worry about OOD, MSE, and LoRA. Let's define what the oracle is, and define DEG and TAG in the margins--set those up for me with a link to the ProteinGuide paper for readers to learn more. I'll fill them in, but you need to remind me before you're done. For aleatoric and epistemic, link to wikipedia pages.**
- `pLDDT` appears with inconsistent casing (`plddt` vs `pLDDT`). **Standardize to `pLDDT` throughout.**

### External link checks
- Substack subscribe URL currently returns 404:
  - `https://substack.com/@ishangaurr/subscribe`A **Let's ignore for now, but this is a top next priority, move it to the top of the list.**

---

## 6) `writing/archival-ml/archival-ml.md`

### Typos / grammar
- No major hard typos found.
- Optional clarity tweak: “They represent, not just an important idea, but herald…” is grammatical but slightly clunky; could be simplified for flow. **ignore**

### Readability
- “fecundity” may be harder for some readers; consider a simpler synonym if desired. **ignore**

### Link/resource checks
- Internal link `/index.html` exists.
- “Coming Soon!” note for the RBM post appears consistent with repo state (no matching archival post found yet).
- Amazon URL returns HTTP 500 in automated check (could be anti-bot behavior, but worth manually verifying in browser). **ignore**

---

## 7) `writing/using-proteinguide/proteinguide-in-practice-draft.md`

### Typos / grammar
- No major grammar issues found in this draft.

### Readability / consistency
- Terminology and structure are generally cleaner than the current non-draft version.

### Link/resource checks
- Broken relative link in sidenote:
  - Current: `[intuitive overview of ProteinGuide](./ddm-and-pg-intuition/)`
  - This resolves under the draft page path and breaks.
  - Suggested: `../ddm-and-pg-intuition/`

---

## 8) `writing/using-proteinguide/_theory.md`

### Typos / grammar
- Mirrors older text from `ddm-and-pg-intuition.md` and still has several corrected typos, e.g.:
  - “trained to all real proteins …”
  - “idea model”
  - “multiple the pretrained generative models proabbilities …”

### Link/resource checks
- Broken media link in rendered output:
  - `esm-sampling-crop.mp4` resolves to `.../_theory/esm-sampling-crop.mp4`
  - Suggested: `../esm-sampling-crop.mp4`

---

## 9) `writing/using-proteinguide/_reality-check.md`

### Content status
- Page currently only has a section title:
  - `## Where the Rubber Meets the Road {#reality}`
- No copy-edit issues beyond this; likely a placeholder/stub.

---

## Link-check summary (non-200 results)

From the reviewed pages/rendered content:
- 404: `https://github.com/junhaobearxiong/protein_discrete_guidance`
- 404: `https://substack.com/@ishangaurr/subscribe`
- 500: `https://www.amazon.com/Structure-Scientific-Revolutions-50th-Anniversary/dp/0226458121?sr=1-1` (possibly bot-block behavior)
- 403 (likely access/paywall restrictions, not necessarily nonexistent): **ignore, these work for me**
  - `https://dl.acm.org/doi/abs/10.1145/3503222.3507726`
  - `https://www.annualreviews.org/content/journals/10.1146/annurev-biodatasci-102423-113534`
