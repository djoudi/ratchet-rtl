/*!
 * Ratchet-RTL's Gruntfile
 * http://github.com/morteza/ratchet-rtl
 * Copyright 2014 Morteza Ansarinia
 * Licensed under Creative Commons BY-NC-SA 4.0 (http://creativecommons.org/licenses/by-nc-sa/4.0/)
 */

/* jshint node: true */
module.exports = function(grunt) {
  'use strict';

  // Force use of Unix newlines
  grunt.util.linefeed = '\n';

  RegExp.quote = function (string) {
    return string.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');
  };


  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // Metadata.
    meta: {
      distPath:       'dist/'
    },

    banner: '/*!\n' +
            ' * =====================================================\n' +
            ' * Ratchet-RTL v<%= pkg.version %> (<%= pkg.homepage %>)\n' +
            ' * Copyright <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
            ' * Licensed under <%= pkg.license %> (https://github.com/morteza/ratchet/blob/master/LICENSE.md)\n' +
            ' *\n' +
            ' * v<%= pkg.version %> designed by @morteza.\n' +
            ' * =====================================================\n' +
            ' */\n',

    clean: {
      dist: ['<%= meta.distPath %>']
    },

    sass: {
      options: {
        banner: '<%= banner %>',
        style: 'expanded',
        unixNewlines: true
      },
      dist: {
        files: {
          '<%= meta.distPath %>css/<%= pkg.name %>-theme-ios.css': 'sass/theme-ios-rtl.scss',
          '<%= meta.distPath %>css/<%= pkg.name %>-theme-android.css': 'sass/theme-android-rtl.scss'
        }
      }
    },

    csscomb: {
      options: {
        config: 'sass/.csscomb.json'
      },
      dist: {
        files: {
          '<%= meta.distPath %>/css/<%= pkg.name %>-theme-android.css': '<%= meta.distPath %>/css/<%= pkg.name %>-theme-android.css',
          '<%= meta.distPath %>/css/<%= pkg.name %>-theme-ios.css': '<%= meta.distPath %>/css/<%= pkg.name %>-theme-ios.css'
        }
      }
    },

    cssmin: {
      options: {
        banner: '', // set to empty; see bellow
        keepSpecialComments: '*' // set to '*' because we already add the banner in sass
      },
      theme: {
        files: {
          '<%= meta.distPath %>css/<%= pkg.name %>-theme-ios.min.css': '<%= meta.distPath %>css/<%= pkg.name %>-theme-ios.css',
          '<%= meta.distPath %>css/<%= pkg.name %>-theme-android.min.css': '<%= meta.distPath %>css/<%= pkg.name %>-theme-android.css'
        }
      }
    }

  });

  // Load the plugins
  require('load-grunt-tasks')(grunt, { scope: 'devDependencies' });
  require('time-grunt')(grunt);

  // Default task(s).
  grunt.registerTask('dist-css', ['sass', 'csscomb', 'cssmin']);
  grunt.registerTask('dist', ['clean', 'dist-css', 'dist-js']);
  grunt.registerTask('build', ['dist']);
  grunt.registerTask('default', ['dist']);
};
