### oprah

`oprah` is a cli tool to transfer your GitHub code and issues
to [GForge Next](https://next.gforge.com/).

#### How to Install

`oprah` depends on [Node.js v6]() to run and [npm]() to install.
Once Node and NPM are installed, run `npm install -g oprah`.

#### How to Run

```
  Usage: oprah [options]

  Options:

    -h, --help                         output usage information
    -V, --version                      output the version number
    -u, --githubusername [ghUsername]  Your GitHub username
    -U, --gforgeusername [gfUsername]  Your GForge username
    -p, --pagesize [pagesize]          GitHub Issue Pagination page limit
    -v, --verbose                      Display program output, warnings, and error details
    -t, --timeout [timeout]            GitHub authentication timeout time (default 600ms)
    -i, --transferissues               Only transfers Issues from GitHub to GForge
    -c, --transfercode                 Only transfers Code from GitHub to GForge
```

Alternatively, you can simply run `oprah` with no arguments/options for default settings.  This is the preferred method for entering passwords.

#### Testing

The test suite uses [Mocha](http://mochajs.org/). Install with
`npm install mocha` and run by typing `mocha` from the root
directory.
