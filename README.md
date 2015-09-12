CodeFriends
===========
[![Build Status](https://travis-ci.org/code-friends/CodeFriends.svg)](https://travis-ci.org/code-friends/CodeFriends) [![Dependency Status](https://david-dm.org/code-friends/CodeFriends.svg)](https://david-dm.org/code-friends/CodeFriends) [![devDependency Status](https://david-dm.org/code-friends/CodeFriends/dev-status.svg)](https://david-dm.org/code-friends/CodeFriends#info=devDependencies)

CodeFriends is a collaborative programming environment in your browser. Work with others in real time over text or video chat, clone in repos from Github, and see the changes instantly when a collaborator edits the project.

## Team

  - __Project Lead and Back End Engineer__: [Jorge Silva](https://github.com/thejsj/)
  - __Back End and Database Engineer__: [Chase Ellsworth](https://github.com/chaseme3/)
  - __Front End Lead and Scrum Master__: [Catherine Bui](https://github.com/gladwearefriends)
  - __Full Stack Developer__: [Doug Phung](https://github.com/floofydoug/)


## Table of Contents

  1. [Usage](#usage)
  1. [Development](#development)
      1. [Setup](#setup)
      1. [Running](#running)
      1. [Testing](#testing)
  1. [Contributing](#contributing)
  1. [License](#license)

## Usage
1. Login with Github or create an account.
1. Clone a repo, use a template, or create a project from scratch.
1. Invite collaborators with their Github username and start collaborating!

![Real time editing with others](http://codefriends.io/assets/img/landingScreenshots/videoScreenShot.png?raw=true "Real time editing")

## Development

### Setup

Install mysql and RethinkDB

```
brew install mysql rethinkdb
```

Install mocha and gulp

```
npm install -g mocha gulp nodemon
```

Install all packages and bower components

```
npm install
bower install
```

Compile frontend assets

```
gulp
```

### Running

Once you startup MySQL and RethinkDB, you're now ready to start the app. Please
make sure both databases are running before starting the app.

Running for development (using nodemon):
```
npm run dev
```

Running on production (using forever):
```
npm start
```

### Testing

```
npm test
```

## Contributing

See CONTRIBUTING.md for contribution guidelines.

## License
MIT License 2014
