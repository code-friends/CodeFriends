(function () {
  'use strict';

  function shareCodeMirror(cm, ctx) {
    if (!ctx.provides.text) throw new Error('Cannot attach to non-text document');

    var suppress = false;
    var text = ctx.get() || ''; // Due to a bug in share - get() returns undefined for empty docs.
    cm.setValue(text);
    check();

    // *** remote -> local changes

    ctx.onInsert = function (pos, text) {
      suppress = true;
      cm.replaceRange(text, cm.posFromIndex(pos));
      suppress = false;
      check();
    };

    ctx.onRemove = function (pos, length) {
      suppress = true;
      var from = cm.posFromIndex(pos);
      var to = cm.posFromIndex(pos + length);
      cm.replaceRange('', from, to);
      suppress = false;
      check();
    };

    // *** local -> remote changes

    cm.on('change', function (cm, change) {
      if (suppress) return;
      applyToShareJS(cm, change);
      check();
    });

    // Convert a CodeMirror change into an op understood by share.js
    function applyToShareJS(cm, change) {
      // CodeMirror changes give a text replacement.
      // I tuned this operation a little bit, for speed.
      var startPos = 0;  // Get character position from # of chars in each line.
      var i = 0;         // i goes through all lines.

      while (i < change.from.line) {
        startPos += cm.lineInfo(i).text.length + 1;   // Add 1 for '\n'
        i++;
      }

      startPos += change.from.ch;

      if (change.to.line == change.from.line && change.to.ch == change.from.ch) {
        // nothing was removed.
      } else {
        // delete.removed contains an array of removed lines as strings, so this adds
        // all the lengths. Later change.removed.length - 1 is added for the \n-chars
        // (-1 because the linebreak on the last line won't get deleted)
        var delLen = 0;
        for (var rm = 0; rm < change.removed.length; rm++) {
          delLen += change.removed[rm].length;
        }
        delLen += change.removed.length - 1;
        ctx.remove(startPos, delLen);
      }
      if (change.text) {
        ctx.insert(startPos, change.text.join('\n'));
      }
      if (change.next) {
        applyToShareJS(cm, change.next);
      }
    }

    function check() {
      setTimeout(function () {
        var cmText = cm.getValue();
        var otText = ctx.get() || '';

        if (cmText != otText) {
          console.error("Text does not match!");
          console.error("cm: " + cmText);
          console.error("ot: " + otText);
          // Replace the editor text with the ctx snapshot.
          cm.setValue(ctx.get() || '');
        }
      }, 0);
    }

    return ctx;
  }

  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    // Node.js
    module.exports = shareCodeMirror;
    module.exports.scriptsDir = __dirname;
  } else {
    if (typeof define === 'function' && define.amd) {
      // Require.js & co
      define([], function () {
        return shareCodeMirror;
      });
    } else {
      // Browser, no AMD
      window.sharejs.Doc.prototype.attachCodeMirror = function(cm, ctx) {
        if(!ctx) ctx = this.createContext();
        shareCodeMirror(cm, ctx);
      };
    }
  }
})();
