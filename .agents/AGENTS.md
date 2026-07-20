# Agent Instructions — Diane's Dotfiles

These instructions apply to any coding agent working on this repository. The settings in this directory describe shared preferences; each agent must use its own supported configuration to apply them.

## Git Identity

- GitHub username: **diaaney**.
- Use Diane's Git identity for commits and other Git operations. Never use an agent or service account as the author.
- Before pushing, confirm that the remote and configured user correspond to diaaney.

## Conventional Commits with Emoji

All commits must follow the format:

```
<emoji> <type>: <short description>
```

Commit messages must always be written in **English** and in **all lowercase**.

### Type and emoji table

| Type       | Emoji | When to use                                   |
|------------|-------|-----------------------------------------------|
| `feat`     | 🎉    | New feature                                   |
| `fix`      | 🐛    | Bug fix                                       |
| `docs`     | 📚    | Documentation changes                         |
| `style`    | 💄    | Formatting, whitespace, semicolons (no logic) |
| `refactor` | ♻️    | Refactor without new feature or bug fix       |
| `test`     | 🧪    | Add or fix tests                              |
| `chore`    | 🔧    | Maintenance tasks, configs, deps              |
| `perf`     | ⚡    | Performance improvements                      |
| `ci`       | 🤖    | CI/CD changes                                 |
| `revert`   | ⏪    | Revert a previous commit                      |

### Examples

```
🎉 feat: generator stream
🐛 fix: token expiration not handled
📚 docs: update readme with setup instructions
♻️ refactor: extract response handler
🧪 test: add unit tests for user service
```

## General Git Rules

- Never add an agent, model, or service as a co-author unless Diane explicitly asks.
- Never push without explicit confirmation from Diane. Wait for her to say "pushea" or equivalent before running `git push`.
- Every user prompt that requests changes must result in at least one commit before the task is considered complete.
- Make separate commits for distinct changes or logical units of work within the same prompt; there is no limit on the number of commits per prompt.
- Create these commits without waiting for confirmation.
- Never use `--no-verify` to skip hooks.
- Never force push to `main` or `master`.
- Create new commits instead of amending already published commits.
- Prefer staging specific files over `git add -A`.

## Shared Preferences

- Use high reasoning effort when the agent supports an effort setting.
- Use the latest update channel when the agent supports update channels.
- Use the optional capabilities listed in `settings.json` only when they are available in the current agent's environment.
