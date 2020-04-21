# Contributing to FCL and the Flow JS SDK

The following is a set of guidelines for contributing to FCL and the Flow JS SDK
These are mostly guidelines, not rules.
Use your best judgment, and feel free to propose changes to this document in a pull request.

## Table Of Contents

[Getting Started](#project-overview)

[How Can I Contribute?](#how-can-i-contribute)

- [Reporting Bugs](#reporting-bugs)
- [Suggesting Enhancements](#suggesting-enhancements)
- [Your First Code Contribution](#your-first-code-contribution)
- [Pull Requests](#pull-requests)

[Styleguides](#styleguides)

- [Git Commit Messages](#git-commit-messages)
- [JavaScript Styleguide](#javascript-styleguide)

[Additional Notes](#additional-notes)

## How Can I Contribute?

### Reporting Bugs

#### Before Submitting A Bug Report

- **Search existing issues** to see if the problem has already been reported.
  If it has **and the issue is still open**, add a comment to the existing issue instead of opening a new one.

#### How Do I Submit A (Good) Bug Report?

Explain the problem and include additional details to help maintainers reproduce the problem:

- **Use a clear and descriptive title** for the issue to identify the problem.
- **Describe the exact steps which reproduce the problem** in as many details as possible.
  When listing steps, **don't just say what you did, but explain how you did it**.
- **Provide specific examples to demonstrate the steps**.
  Include links to files or GitHub projects, or copy/pasteable snippets, which you use in those examples.
  If you're providing snippets in the issue,
  use [Markdown code blocks](https://help.github.com/articles/markdown-basics/#multiple-lines).
- **Describe the behavior you observed after following the steps** and point out what exactly is the problem with that behavior.
- **Explain which behavior you expected to see instead and why.**
- **Include error messages and stack traces** which show the output / crash and clearly demonstrate the problem.

Provide more context by answering these questions:

- **Can you reliably reproduce the issue?** If not, provide details about how often the problem happens
  and under which conditions it normally happens.

Include details about your configuration and environment:

- **What is the version of the Cadence you're using**?
- **What's the name and version of the Operating System you're using**?

### Suggesting Enhancements

#### Before Submitting An Enhancement Suggestion

- **Perform a cursory search** to see if the enhancement has already been suggested.
  If it has, add a comment to the existing issue instead of opening a new one.

#### How Do I Submit A (Good) Enhancement Suggestion?

Enhancement suggestions are tracked as [GitHub issues](https://guides.github.com/features/issues/).
Create an issue and provide the following information:

- **Use a clear and descriptive title** for the issue to identify the suggestion.
- **Provide a step-by-step description of the suggested enhancement** in as many details as possible.
- **Provide specific examples to demonstrate the steps**.
  Include copy/pasteable snippets which you use in those examples,
  as [Markdown code blocks](https://help.github.com/articles/markdown-basics/#multiple-lines).
- **Describe the current behavior** and **explain which behavior you expected to see instead** and why.
- **Explain why this enhancement would be useful** to Cadence users.

### Your First Code Contribution

Unsure where to begin contributing to Cadence?
You can start by looking through these `good-first-issue` and `help-wanted` issues:

- [Good first issues][https://github.com/onflow/cadence/labels/good%20first%20issue]:
  issues which should only require a few lines of code, and a test or two.
- [Help wanted issues][https://github.com/onflow/cadence/labels/help%20wanted]:
  issues which should be a bit more involved than `good-first-issue` issues.

Both issue lists are sorted by total number of comments.
While not perfect, number of comments is a reasonable proxy for impact a given change will have.

### Pull Requests

The process described here has several goals:

- Maintain code quality
- Fix problems that are important to users
- Engage the community in working toward the best possible Developer/User Experience
- Enable a sustainable system for the Cadence's maintainers to review contributions

Please follow the [styleguides](#styleguides) to have your contribution considered by the maintainers.
Reviewer(s) may ask you to complete additional design work, tests,
or other changes before your pull request can be ultimately accepted.

## Styleguides

### Git Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line
- Start commits with a 3 character topic
  - Topics:
    - PKG -- Modified a package (Requires a Changelog Entry)
    - DOC -- Modified a some form of documentation
    - OPS -- Modified repository tooling/scripts
    - VSN -- Changed a version number
- Scope commits to individual packages and include package name in commit message

Format: TOPIC -- [package-name] what is change

Examples:

- OPS -- [root] tests only run once now for ci master branch
- PKG -- [decode] fix issue with using regex for type matching
- DOC -- [root] update readme with emulator instructions
- VSN -- [interaction] 0.0.3 -> 0.0.4
- VSN -- [fcl] 1.5.3 -> 2.0.0 breaking change
- VSN -- [sdk] @onflow/send 0.0.5 -> 0.0.6

### JavaScript Styleguide

Use Prettier with the setting in the root `.prettierrc` file

## Additional Notes

Thank you for your interest in contributing to the FCL and Flow JS SDK
