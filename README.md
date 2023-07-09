# BitActions - Github Action status on macOS menu bar

Inspired by [Hukum](https://github.com/abskmj/hukum) BitActions is a BitBar plugin that displays Github Actions (GA) status in your Mac OS X Menu Bar. It is good for watching a regular Github workflow setup from your project, but also to allow you to filter a specific branch that you are working on in a pull request workflow.

## Example

![BitActions example showing GitHub Actions status on macOS menu](images/sample.png)

# Installation

Make sure you have `node` and `npm`, then install with the bundled install script:
```sh
$ curl https://raw.githubusercontent.com/simonbucher/bitactions/last-runs/install.sh | NODE=$(which node) bash
```

# Configuration
Create a `.bitactionsrc` file in your home with the following contents:

```json
{
    "githubToken": "<token>",
    "githubRepoName": "<repo-name>",
    "numOfWorkflowRuns": 5
}
```

## githubToken
// Optional for public repos, required for privated ones - A forty-digit alphanumeric string

BitActions uses [Github Actions API](https://docs.github.com/en/rest/reference/actions). It is possible to use these APIs without any authentication for public repositories. However, for unauthenticated requests, the rate limit allows for up to 60 requests per hour (Details at [docs.github.com](https://docs.github.com/en/rest/overview/resources-in-the-rest-api#rate-limiting)) which can exhaust quickly. Authenticated requests have higher limits, up to 5000 requests per hour.

Follow these steps at [docs.github.com](https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token) to create a personal token. The token does not need to have any specific scope for public repositories. However, the token  needs to have `repo - Full control of private repositories` scope for private repositories.


# How it works?
BitActions uses [Github Actions API](https://docs.github.com/en/rest/reference/actions) to get the related workflow to the recent git push and its status. It keeps on calling the APIs every time your BitBar refreshes.

# Contributing

Contribution with code or documentation by raising a [pull request](https://github.com/paulononaka/bitactions/pulls) are more than welcome! Head over to the [issues tab](https://github.com/paulononaka/bitactions/issues) to report any bug or suggest an improvement. 