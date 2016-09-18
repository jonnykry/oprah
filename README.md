### oprah

`oprah` is a cli tool to transfer your GitHub code and issues
to [GForge Next](https://next.gforge.com/).

#### How to Install

How to install from the repo:  `oprah` depends on [Node.js v6]() to run and [npm]() to install.
Once Node and NPM are installed, run the following commands.
```
npm install
npm install -g
npm link
```

#### How to Run

```
Usage: oprah [options]

Options:

  -h, --help                         output usage information
  -V, --version                      output the version number
  -u, --githubusername [ghUsername]  Your GitHub username
  -U, --gforgeusername [gfUsername]  Your GForge username
  -r, --githubrepo [ghRepo]          The GitHub repository name
  -R, --gforgerepo [gfRepo]          The GForge repository name
  -v, --verbose                      Display program output, warnings, and error details
  -i, --transferissues               Only transfers Issues from GitHub to GForge
  -c, --transfercode                 Only transfers Code from GitHub to GForge
```

Alternatively, you can simply run `oprah` with no arguments/options for default settings.  This is the preferred method for entering passwords.

#### Testing

The test suite uses [Mocha](http://mochajs.org/). Install with
`npm install mocha` and run by typing `mocha` from the root
directory.

#### Frameworks and APIs

- [Commander.js](https://github.com/tj/commander.js/) - Used to
  parse command line args.
- [ShellJS](https://github.com/shelljs/shelljs) - Used to call
  git commands.
- [GForge Next API](https://next.gforge.com/apidoc) - Used to
  make POST/GET requests to GForge Next.
- [GitHub API](https://developer.github.com/v3/) - Used to make
  GET requests to GitHub.
- [Mocha](http://mochajs.org/) - Used for test suite.
