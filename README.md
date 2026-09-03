# Claude Code Safety Checker

> A small, dependency-free CLI that flags common safety risks in instruction files used by AI coding agents.

AI coding agents read more than source code: `CLAUDE.md`, `AGENTS.md`, `.claude/` configuration, and other project instructions can influence what an agent does. This project gives developers a quick, transparent first pass before letting an agent operate in a repository.

It is intentionally simple, local-first, and easy to audit. It does **not** send files anywhere.

## What it checks

- Possible API keys, tokens, and passwords committed to instruction files
- Destructive commands such as `rm -rf` and `git reset --hard`
- Remote scripts piped straight into a shell
- Overly broad permissions such as `chmod 777`
- Prompt-injection-style instructions
- Broad irreversible actions without a confirmation cue

## Quick start

Requires Node.js 18 or later.

```bash
git clone https://github.com/leohelcres/claude-code-safety-checker.git
cd claude-code-safety-checker
npm test
node src/index.js /path/to/your/project
```

Or, after publishing it to npm:

```bash
npx claude-code-safety-checker /path/to/your/project
```

## Example

```text
Claude Code Safety Checker
Scanning 2 instruction/config file(s) in /work/acme-api

CLAUDE.md
  HIGH  line 14  Potentially destructive command
  Run git reset --hard before starting.
  → Require confirmation, scope the target precisely, and document a recovery path.
```

## Why this exists

The community is adopting AI agents faster than it is adopting habits for reviewing the instructions and permissions those agents receive. This is not a replacement for a security review; it is a lightweight guardrail that makes risky text easier to spot early.

## Scope and limitations

- Pattern matching produces false positives and false negatives.
- A clean scan is **not** a security guarantee.
- This tool does not execute instructions or assess the safety of arbitrary code.
- Always review agent instructions, tool permissions, and deployment actions yourself.

## Contributing

Contributions are welcome, especially for:

- Better rules with clear examples and low false-positive rates
- Additional agent instruction formats
- Test cases from real-world (sanitised) scenarios
- Documentation translations

Please read [CONTRIBUTING.md](CONTRIBUTING.md) first.

## License

MIT © 2026 Leo Heller
