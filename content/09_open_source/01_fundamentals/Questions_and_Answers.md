# Open Source Fundamentals

# 📚 Navigation

- [Beginner](#-beginner)
- [Intermediate](#-intermediate)
- [Advanced](#-advanced)

---

## 🟢 Beginner

### 1. Contributing to Open Source

**Question:** First contribution walkthrough.

**Answer:**

**Step-by-step process:**

1. **Find an issue:** Look for `good first issue`, `help wanted`, or `beginner-friendly` labels.
2. **Fork the repo:** Creates your copy on GitHub.
3. **Clone locally:** `git clone https://github.com/YOUR_USERNAME/repo.git`
4. **Create a branch:** `git checkout -b fix/typo-in-readme`
5. **Make your change, commit, push.**
6. **Open a Pull Request** from your branch to the upstream `main`.
7. **Respond to code review** — be patient and professional.

**Where to find issues:**

- [good-first-issues.github.io](https://good-first-issues.github.io)
- GitHub's `good first issue` label filter
- Projects you already use and want to improve

---

### 2. Open Source Licenses

**Question:** License comparison.

**Answer:**

| License    | Can use commercially | Must share source   | Patent grant | Copyleft  |
| ---------- | -------------------- | ------------------- | ------------ | --------- |
| MIT        | ✅                   | ❌                  | ❌           | ❌        |
| Apache 2.0 | ✅                   | ❌                  | ✅           | ❌        |
| GPL v3     | ✅                   | ✅ (if distributed) | ✅           | ✅        |
| AGPL v3    | ✅                   | ✅ (even SaaS)      | ✅           | ✅ Strong |

**For commercial SaaS:**

- ✅ MIT, Apache 2.0, BSD — no restrictions.
- ⚠️ GPL — only if you don't distribute the software (SaaS loophole).
- ❌ AGPL — requires sharing source code even for SaaS usage.

---

## 🟡 Intermediate

### 1. Writing Good PRs

**Question:** What makes a great PR.

**Answer:**

**PR title:** Use Conventional Commits format:

- `fix: resolve race condition in auth middleware`
- `feat: add pagination to user listing API`
- `docs: update deployment guide`

**PR description template:**

```markdown
## What

Brief description of the change.

## Why

Link to issue, explain motivation.

## How

Technical approach, key decisions.

## Testing

- [ ] Unit tests pass
- [ ] Manual testing done
- [ ] No breaking changes

## Screenshots (if UI)
```

**Handling code review:**

- Respond to every comment, even if just "Good point, fixed."
- Ask questions if you disagree — don't silently ignore feedback.
- Push fixup commits, then squash before merge.

---

### 2. Maintaining a Project

**Question:** Infrastructure for growing projects.

**Answer:**

**Essential infrastructure:**

- **CI/CD:** GitHub Actions for tests, linting, builds on every PR.
- **Issue templates:** Bug report, feature request, question.
- **CONTRIBUTING.md:** Setup instructions, coding standards, PR process.
- **Semantic versioning:** `MAJOR.MINOR.PATCH` (breaking.feature.fix).
- **CHANGELOG.md:** Auto-generated from Conventional Commits.

```yaml
# .github/workflows/ci.yml
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm test
      - run: npm run lint
```

---

## 🔴 Advanced

### 1. Community Building

**Question:** Governance models.

**Answer:**

| Model      | Example                       | Pros                            | Cons                |
| ---------- | ----------------------------- | ------------------------------- | ------------------- |
| BDFL       | Python (Guido), Linux (Linus) | Fast decisions, clear direction | Bus factor, burnout |
| Committee  | Rust, Node.js                 | Democratic, sustainable         | Slower decisions    |
| Foundation | Apache, Linux Foundation      | Legal protection, funding       | Bureaucracy         |

**Community tools:**

- **Code of Conduct** — sets behavior expectations (Contributor Covenant).
- **RFCs** — propose and discuss significant changes publicly.
- **Public roadmap** — transparency about project direction.
- **Discord/Slack** — real-time community interaction.

---

### 2. Sustainability

**Question:** Funding models.

**Answer:**

| Model           | Example             | Revenue                 | Trade-off                  |
| --------------- | ------------------- | ----------------------- | -------------------------- |
| Sponsorship     | GitHub Sponsors     | Tips/recurring          | Unpredictable              |
| Open core       | GitLab, Supabase    | Enterprise features     | Feature tension            |
| Dual license    | MongoDB (SSPL)      | Commercial license fees | Community friction         |
| Managed service | Redis, Elastic      | Cloud hosting           | Cloud provider competition |
| Consulting      | Many small projects | Services                | Time vs code               |

**Most sustainable:** Open core + managed service. Provide the core for free, charge for enterprise features and hosting.
