'use strict';
var readFileSync = require('fs').readFileSync;
var compareFunc = require('compare-func');
var resolve = require('path').resolve;
var path = require('path');
var pkgJson = {};
var gufg = require('github-url-from-git');
try {
  pkgJson = require(path.resolve(
    process.cwd(),
    './package.json'
  ));
} catch (err) {
  console.error('no root package.json found');
}

var parserOpts = {
  headerPattern: /^(?:\:(\w*)\: )?(?:(\w*)(?:\(([\w\$\.\-\* ]*)\))?\: )?(.*)$/,
  headerCorrespondence: ['emoji', 'type', 'scope', 'subject'],
  noteKeywords: ['NOTE'],
  revertPattern: /^revert:\s([\s\S]*?)\s*This reverts commit (\w*)\./,
  revertCorrespondence: ['header', 'hash']
};

function issueUrl() {
  var url = null;
  if (pkgJson.repository && pkgJson.repository.url && ~pkgJson.repository.url.indexOf('github.com')) {
    var gitUrl = gufg(pkgJson.repository.url);

    if (gitUrl) {
      return gitUrl + '/issues/';
    } else {
      return url;
    }
  }
}



var parserOpts = {
  headerPattern: /^(?:\:(\w*)\: )?(?:(\w*)(?:\(([\w\$\.\-\* ]*)\))?\: )?(.*)$/,
  headerCorrespondence: ['emoji', 'type', 'scope', 'subject'],
  noteKeywords: ['NOTE']
};

var writerOpts = {
  transform: function (commit) {
    if (commit.type === 'new') {
      commit.type = ':star: New Features';
    } else if (commit.type === 'feature') {
      commit.type = ':star: New Features';
    } else if (commit.type === 'bug') {
      commit.type = ':bug: Bug Fixes';
    } else if (commit.type === 'update') {
      commit.type = ':up: Updates';
    } else if (commit.type === 'improvement') {
      commit.type = ':zap: Improvements';
    } else if (commit.type === 'performance') {
      commit.type = ':chart_with_upwards_trend: Performance Fixes';
    } else if (commit.type === 'security') {
      commit.type = ':lock: Security Fixes';
    } else if (commit.type === 'deprecated') {
      commit.type = ':warning: Deprecated';
    } else if (commit.type === 'breaking') {
      commit.type = ':boom: Breaking changes';
    } else if (commit.type === 'revert') {
      commit.type = ':back: Reverts';
    } else {
      return;
    }

    if (commit.scope === '*') {
      commit.scope = '';
    }

    if (typeof commit.hash === 'string') {
      commit.hash = commit.hash.substring(0, 7);
    }

    if (typeof commit.subject === 'string') {
      var url = issueUrl();
      if (url) {
        // GitHub issue URLs.
        commit.subject = commit.subject.replace(/( ?)#([0-9]+)(\b|^)/g, '$1[#$2](' + url + '$2)$3');
      }
      // GitHub user URLs.
      commit.subject = commit.subject.replace(/( ?)@([a-zA-Z0-9_]+)(\b|^)/g, '$1[@$2](https://github.com/$2)$3');
      commit.subject = commit.subject;
    }

    return commit;
  },
  groupBy: 'type',
  commitGroupsSort: 'title',
  commitsSort: ['scope', 'subject'],
  noteGroupsSort: 'title',
  notesSort: compareFunc
};

writerOpts.mainTemplate = readFileSync(resolve(__dirname, 'templates/template.hbs'), 'utf-8');
writerOpts.headerPartial = readFileSync(resolve(__dirname, 'templates/header.hbs'), 'utf-8');
writerOpts.commitPartial = readFileSync(resolve(__dirname, 'templates/commit.hbs'), 'utf-8');
writerOpts.footerPartial = readFileSync(resolve(__dirname, 'templates/footer.hbs'), 'utf-8');

module.exports = {
  parserOpts: parserOpts,
  writerOpts: writerOpts
};
