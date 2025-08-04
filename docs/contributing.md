# Contributing Guide

Glad see you here! Any kinds of contributions are always welcome. Before contributing, please read the [code of conduct](code_of_conduct.md).

## Bug Report Guide
You can report bugs using GitHub's issues. When reporting issues, please provide:
- What you expected vs. what actually happened
- The exact steps that led to the issue
- Your OS, browser version, if you think they are relevant to the issue.
- Screenshots, screen recordings, or error logs when possible
- Whether the issue happens consistently or intermittently

## Development Guide
### Prerequisites
Make sure you have [Node.js](https://nodejs.org/en/download/current) and [pnpm](https://pnpm.io/installation) installed or activated.
Their versions should be the same as specified in the "engines" and "packageManager" fields in [package.json](../package.json).

### Steps
Simply run following commands in a terminal then a development server will be launched.
1. Install Node.js packages
    ```sh
    pnpm i
    ```
2. Setup development environment
    ```sh
    node --run=setup
    ```
3. Run development server
    ```sh
    node --run=dev
    ```

### License
By contributing, you agree that your contributions will be licensed under its MIT License.
