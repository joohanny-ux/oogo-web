# AGENTS.md

## Project
This repository is for the OOGO website project.

## Language
- Explain work summaries to the user in Korean.
- Use English for code comments, commit messages, and technical file names unless requested otherwise.

## Workflow
- Do not push directly to main after the initial setup.
- Always create a feature branch for new work.
- Use pull requests before merging into main.
- Keep changes small and focused.
- Do not modify unrelated files.

## Branch Naming
- feature/[task-name]
- fix/[task-name]
- docs/[task-name]
- refactor/[task-name]

## Safety
- Never commit .env, .env.local, API keys, Supabase keys, Vercel tokens, or private credentials.
- Use .env.example only for shared environment variable names.
- Do not expose private business documents or internal files unless explicitly requested.

## UI Direction
- Keep the design clean, premium, minimal, and card-based.
- Avoid clutter and unnecessary complexity.
- Prioritize MVP-first implementation.

## Before Finishing a Task
- Run build, lint, or type checks if available.
- Summarize changed files.
- Summarize test/build results.
- Mention any remaining risks or unfinished items.
