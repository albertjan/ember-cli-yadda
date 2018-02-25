/* jshint node: true */
'use strict';

var path = require('path');
var FeatureParser = require('./lib/feature-parser');

module.exports = {
  name: 'ember-cli-yadda',
  getTestFramework: function() {
    var packages = Object.keys(this.project.addonPackages);
    if (packages.indexOf('ember-cli-mocha') > -1) {
      return 'mocha';
    } else {
      return 'qunit';
    }
  },
  setupPreprocessorRegistry: function(type, registry) {
    var testFramework = this.getTestFramework();
    var self = this;
    var env = 'test';
    var yaddaConfig = this.config(env).yadda || {};
    var appYaddaConfig = this.project.config(env).APP.yadda || {};
    for(var key in appYaddaConfig) {
      if(!appYaddaConfig.hasOwnProperty(key)) continue;
      yaddaConfig[key] = appYaddaConfig[key];
    }

    registry.add('js', {
      name: 'ember-cli-yadda',
      ext: ['feature', 'spec', 'specification'],
      toTree: function(tree, inputPath, outputPath) {
        return new FeatureParser(tree, testFramework, self.options, yaddaConfig);
      }
    });
  },
  blueprintsPath: function() {
    return path.join(__dirname, 'blueprints', this.getTestFramework());
  },
  included: function(app) {
    this._super.included(app);
    var options = app.options['ember-cli-yadda'] || {};
    if (typeof options.persist === 'undefined') {
      options.persist = true;
    }
    this.options = options;
  }
};
