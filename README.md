Github Cloner
=============

An interactive command line tool to list and clone your Github repositories.

Dependencies
------------
 - node
 - ncurses

Installation
------------

###NPM

    (sudo) npm install -g github-cloner

###Sources
    git clone https://github.com/floriancargoet/github-cloner.git
    npm install

Usage
-----

    # Interactive mode
    github-cloner

    # You can provide your username on the CLI
    github-cloner -u username

    # Clone all the repositories without questions
    github-cloner -u username --all

    # A little help
    github-cloner --help

    Clone your GitHub repositories.
    Usage: github-cloner [OPTION...]

    Options:
      --username, -u  GitHub username, asked interactively if not given
      --all, -a       Clone all repositories, non interactive
      --help, -h      Show this help
      --version       Show version number


Known issues
------------
 - Display bug under the ListBox on OS X

To do
-----
 - GET /user/repos (authenticated, to fetch private repositories too)
 - Check if clone already exists in directory
 - Better ncurses widget (checkboxes)
