## Background

Preparing files, checking compilers, and opening a VS Code workspace was repetitive during coding practice. I built ct as a Go CLI and continue to develop and use it myself.

Problem input, configuration/templates, file creation, and editor integration have separate responsibilities. Machine settings are also stored separately from solutions.

## Key design decisions

- Running the same problem again must preserve the existing solution.
- doctor diagnoses the environment; setup shows a plan before installation.
- Users can register languages/platforms without editing built-in definitions.

I handled the CLI, templates, registry, VS Code integration, tests, installers, and releases. Since I use the tool repeatedly, preserving files and making changes understandable before execution were priorities.

## Results and limitations

I published Windows/Linux binaries and am continuing to improve the tool through personal use. File preservation and environment diagnostics have tests; clean installation on every OS and external user outcomes have not been fully validated.
