# Personal Website

## Preview Website

```bash
npx @11ty/eleventy --serve
````

## Deployment

Source code lives in the `ishangaur` repo (`origin`). The site is served from the `ishan-gaur.github.io` repo (`github-pages` remote).

**Current workflow to deploy:**
1. Push changes to `origin main` as usual (`git push origin main`).
2. The GitHub Actions workflow (`.github/workflows/deploy-to-ghpages.yml`) builds the site with Eleventy and deploys the `_site` output to the `gh-pages` branch on `origin` (i.e., the `ishangaur` repo).
3. To actually update `ishan-gaur.github.io`, you need to **manually push** to the `github-pages` remote:
   ```bash
   git push github-pages main
   ```
   And also push the built `gh-pages` branch there:
   ```bash
   git push github-pages gh-pages
   ```
   Then make sure GitHub Pages for `ishan-gaur.github.io` is configured to serve from the `gh-pages` branch.

**Note:** Without step 3, changes only deploy to `ishan-gaur.github.io/ishangaur` (the project pages URL for the `ishangaur` repo), not to `ishan-gaur.github.io`.

## TODO
- Update the deploy workflow to push directly to `ishan-gaur.github.io` — add `external_repository: ishan-gaur/ishan-gaur.github.io` and a `personal_token` secret to the `peaceiris/actions-gh-pages` step so deploys go to the right place automatically
- Add pictures for each of the publications and make title a clickable link to md files
  - Add a layout file for these
- Check everything in Aviv list is in the info
- Try side notes with the paper, website, and code links for papers
- Add nav bar with home, papers, blog, bookshelf, and misc
  - Make hide nav bar elements until added, start with papers just anchored to existing papers section
- Mention organizing faculty committee work?
- Make an actual blog page
- Make font slightly smaller and add information about startup stuff in college
- Backlog
  - Add icons for the personal links
  - Other pages to add
    - Collison page of books, advice, and links
    - ML resources links: add https://people.csail.mit.edu/fredo/student.html
    - Developer links: https://e-dorigatti.github.io/development/2023/12/05/vscode-slurm.html; slurm script
    - Startup resources links
    - Add resources section with colorswap dataset https://huggingface.co/datasets/stanfordnlp/colorswap
  - Make a paper card template--nice that claude can populate it pretty easily
  - Add google analytics/move to cloudflare?
