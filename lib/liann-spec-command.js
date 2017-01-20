'use babel';

import LiannSpecCommandView from './liann-spec-command-view';
import { CompositeDisposable } from 'atom';
const { clipboard } = require('electron');


export default {

  liannSpecCommandView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.liannSpecCommandView = new LiannSpecCommandView(state.liannSpecCommandViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.liannSpecCommandView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'liann-spec-command:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.liannSpecCommandView.destroy();
  },

  serialize() {
    return {
      liannSpecCommandViewState: this.liannSpecCommandView.serialize()
    };
  },

  toggle() {
    console.log('LiannSpecCommand was toggled!');
    var message = "";

    if (this.modalPanel.isVisible()) {
      this.modalPanel.hide()
    }

    var editor = atom.workspace.getActivePaneItem();
    if (typeof editor !== "undefined" && typeof editor !== "null") {
      var file = editor.buffer.file;

      if (typeof file !== "undefined" && typeof file !== "null") {
        var filePath = file.path;

        if (filePath.endsWith('_spec.rb')) {

          var rootPaths = ['/platform/dashboard/', '/platform/api/', '/platform/shared/'];
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


    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  }

};
