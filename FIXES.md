# Remaining Fixes & Improvement Roadmap

> This document tracks open technical tasks to polish **link-parser** before the 1.0 open-source release on npm.
>
> Feel free to open PRs that tackle any unchecked item. Keep pull requests focused and reference the relevant task numbers below.

---

## 1. Test Coverage

| Module                | Current % Lines | Target |
|-----------------------|-----------------|--------|
| `etherscan`           | **54 %**        | ≥ 90 % |
| `grailed`             | **33 %**        | ≥ 90 % |
| `microsoftteams`      | **50 %**        | ≥ 90 % |
| `amazon`              | 72 %            | ≥ 90 % |
| `ebay`                | 76 %            | ≥ 90 % |
| `stockx`              | 73 %            | ≥ 90 % |
| `wish`                | 75 %            | ≥ 90 % |
| `squarecheckout`      | 73 %            | ≥ 90 % |
| `coinbasecommerce`    | 73 %            | ≥ 90 % |
| _(etc.)_              |                 |        |

**Action Items**
1. Write additional positive/negative tests (detection, parsing, builders).
2. Add branch tests for invalid input edge cases.
3. Refactor overly-forgiving regex patterns where necessary.

---

## 2. Consistency & DX

- [ ] **ID Naming:** Standardise `result.ids` keys (`code`, `groupCode`, `checkoutId`, …) → decide on conventions (`id`, `tokenId`, `code`, etc.) and update modules + tests.
- [ ] **Error Handling:** Export typed `ParserError` with clear error codes; update docs/examples.
- [ ] **Tree-shakable Exports:** Re-export individual platform modules for selective importing.
- [ ] **Typed Builders:** Ensure every `buildProfileUrl`/`buildContentUrl` has comprehensive unit tests.

---

## 3. Tooling

- [ ] **CI:** GitHub Actions workflow matrix (`node@{18,20}`) running `npm run lint`, `npm test`, coverage upload.
- [ ] **Coverage Reporting:** Integrate Codecov or Coveralls badge.
- [ ] **Release Automation:** Adopt semantic-release for automatic npm + GitHub releases.
- [ ] **Typedoc:** Generate HTML docs and publish to GitHub Pages.
- [ ] **ESLint/Prettier:** Add configs aligned with project style and enforce via pre-commit hook (`husky`).

---

## 4. Documentation

- [ ] Flesh out **Platform Implementation Guide** with advanced examples.
- [ ] Add **API Reference** section to README (auto-generated from `types.ts`).
- [ ] Create a **CONTRIBUTING.md** covering coding guidelines, commit message style, and issue templates.

---

## 5. Miscellaneous

- [ ] Evaluate publishing type declarations separately (`types` entry in `package.json`).
- [ ] Confirm all color hex values match official brand guides.
- [ ] Run a spell-check pass on all markdown files.
- [ ] Set up Renovate/Dependabot for dependency updates.

---

### Completed Items

- ✅ Added tests increasing coverage for `stripelink`, `squarecheckout`, `coinbasecommerce`, `signalgroup`, `wish`, `looksrare`.
- ✅ All existing tests passing (1 274/1 274).

---

> **Next milestone:** Reach `90 %` global line coverage and tag **v0.9.0-beta**. 