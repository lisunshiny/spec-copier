'use babel';

import { CompositeDisposable } from 'atom';
const { clipboard } = require('electron');


export default {
  subscriptions: null,

  activate(state) {
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'liann-spec-command:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  toggle() {
    console.log('LiannSpecCommand was toggled!');
    var message = "";

    var editor = atom.workspace.getActivePaneItem();
    if (typeof editor !== "undefined" && typeof editor !== "null") {
      var file = editor.buffer.file;

      if (typeof file !== "undefined" && typeof file !== "null") {
        var filePath = file.path;

        if (filePath.endsWith('_spec.rb')) {

          var rootPaths = ['/platform/dashboard/', '/platform/api/', '/platform/shared_code/'];
          var didReplace = false;
          for (var i = 0; i < rootPaths.length; i++) {
            rootPaths[i]

            if (filePath.indexOf(rootPaths[i]) !== -1) {
              var filePath = filePath.split(rootPaths[i])[1];
            }

            didReplace = true;
          }

          if (didReplace) {
            message = "RAILS_ENV=test bundle exec rspec " + filePath;

            // If we're highlighting something add it to -e
            var example = editor.getSelectedText()

            if (typeof example !== "undefined" && typeof example !== "null" && example !== "") {
              message += " -e \"" + example + "\""
            }

            // YAY! Writes the spec command to your clipboard
            clipboard.writeText(message)
          } else {
            console.log("Not in the platform repo so idc");
          }


        } else {
          console.log("Not a spec file, bruh");
        }
      }
    }
  }
};
