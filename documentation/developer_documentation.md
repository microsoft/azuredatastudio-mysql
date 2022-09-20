# Contributing to MySQL extension for Azure Data Studio
There are many ways to contribute to this project: logging bugs, submitting pull requests, reporting issues, and creating suggestions.

## Build and Run From Source

If you want to understand how extension works or want to debug an issue, you'll want to get the source, build it, and run the tool locally.

### Getting the sources

```
git clone https://github.com/Microsoft/azuredatastudio-mysql
```

### Installing Prerequisites

- [Git](https://git-scm.com)
- [Node.JS](https://nodejs.org/en/about/releases/) `= v16.17.0`
- [NPM](https://www.npmjs.com/get-npm) `= v8.15.0`
- [Yarn](https://yarnpkg.com/en/), install by opening a Powershell window after installing Node and running `npm i -g yarn`
- [Gulp](https://gulpjs.org/getting-started.html), install using `npm install --global gulp-cli`

Finally, install all dependencies using `Yarn`:

```
yarn
```

### Build MySQL extension
After you have these tools installed, run the following commands to clone github repository, install dependencies, and compile source code:

```bash
git clone https://github.com/Microsoft/azuredatastudio-mysql.git
cd azuredatastudio-mysql
yarn
yarn run compile
```

### Debug extension

[Debugging extension with VS Code](https://github.com/Microsoft/azuredatastudio/wiki/Debugging-an-Extension-with-VS-Code)

### Packaging

Install vsce by running `npm install -g vsce` to be able to be to create a vsix package

* Create online package i.e. without installing pgtoolsservice `yarn run package`
* Create offline package i.e. with pgtoolsservice installed `yarn run package-offline`

### Clean up build, npm modules and reset your local git repository to a clean state

```bash
git clean -fxd
```

## Development Workflow

### Debugging
You can use VS Code to debug the MySQL extension on Azure Data Studio:

#### Using VSCode
[Debugging extension with VS Code](https://github.com/Microsoft/azuredatastudio/wiki/Debugging-an-Extension-with-VS-Code)

## Work Branches
Even if you have push rights on the Microsoft/azuredatastudio-mysql repository, you should create a personal fork and create feature branches there when you need them. This keeps the main repository clean and your personal workflow cruft out of sight.

## Pull Requests
Before we can accept a pull request from you, you'll need to sign a [[Contributor License Agreement (CLA)|Contributor-License-Agreement]]. It is an automated process and you only need to do it once.

To enable us to quickly review and accept your pull requests, always create one pull request per issue and [link the issue in the pull request](https://github.com/blog/957-introducing-issue-mentions). Never merge multiple requests in one unless they have the same root cause. Be sure to follow our coding guidelines and keep code changes as small as possible. Avoid pure formatting changes to code that has not been modified otherwise. Pull requests should contain tests whenever possible.

### Where to Contribute
Check out the [full issues list](https://github.com/Microsoft/azuredatastudio-mysql/issues) for a list of all potential areas for contributions.

To improve the chances to get a pull request merged you should select an issue that is labelled with the [`help-wanted`](https://github.com/Microsoft/azuredatastudio-mysql/issues?q=is%3Aopen+is%3Aissue+label%3A%22help+wanted%22) or [`bug`](https://github.com/Microsoft/azuredatastudio-mysql/issues?q=is%3Aopen+is%3Aissue+label%3A%22bug%22) labels. If the issue you want to work on is not labelled with `help-wanted` or `bug`, you can start a conversation with the issue owner asking whether an external contribution will be considered.

## Suggestions
We're also interested in your feedback for the future of MySQL extension for Azure Data Studio. You can submit a suggestion or feature request through the issue tracker. To make this process more effective, we're asking that these include more information to help define them more clearly.

## Discussion Etiquette

In order to keep the conversation clear and transparent, please limit discussion to English and keep things on topic with the issue. Be considerate to others and try to be courteous and professional at all times.

## Microsoft Open Source Code of Conduct
This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/). For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.