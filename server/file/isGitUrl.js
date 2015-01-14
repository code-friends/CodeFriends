'use strict';

var isGitUrl = function (str) {
  var re = /(?:git|ssh|https?|git@[\w\.]+):(?:\/\/)?[\w\.@:\/-~\-]+(\.git\/?)/g;
  return re.test(str);
};

module.exports = isGitUrl;