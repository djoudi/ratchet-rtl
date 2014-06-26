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

  var generateRatchiconsData = require('./ratchet/grunt/ratchicons-data-generator.js');

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // Metadata.
    meta: {
      distPath:       'dist/',
    },

    banner: '/*!\n' +
            ' * =====================================================\n' +
            ' * Ratchet v<%= pkg.version %> (<%= pkg.homepage %>)\n' +
            ' * Copyright <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
            ' * Licensed under <%= pkg.license %> (https://github.com/morteza/ratchet/blob/master/LICENSE.md)\n' +
            ' *\n' +
            ' * v<%= pkg.version %> designed by @morteza.\n' +
            ' * =====================================================\n' +
            ' */\n',

    clean: {
      dist: ['<%= meta.distPath %>', '<%= meta.docsPath %>']
    },

    concat: {
      ratchet: {
        options: {
          banner: '<%= banner %>'
        },
        src: [
          'js/modals.js',
          'js/popovers.js',
          'js/push.js',
          'js/segmented-controllers.js',
          'js/sliders.js',
          'js/toggles.js'
        ],
        dest: '<%= meta.distPath %>js/<%= pkg.name %>.js'
      }
    },

    sass: {
      options: {
        banner: '<%= banner %>',
        style: 'expanded',
        unixNewlines: true
      },
      dist: {
        files: {
          '<%= meta.distPath %>css/<%= pkg.name %>.css': 'sass/ratchet-rtl.scss',
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
          '<%= meta.distPath %>/css/<%= pkg.name %>.css': '<%= meta.distPath %>/css/<%= pkg.name %>.css',
          '<%= meta.distPath %>/css/<%= pkg.name %>-theme-android.css': '<%= meta.distPath %>/css/<%= pkg.name %>-theme-android.css',
          '<%= meta.distPath %>/css/<%= pkg.name %>-theme-ios.css': '<%= meta.distPath %>/css/<%= pkg.name %>-theme-ios.css'
        }
      }
    },

    copy: {
      fonts: {
        expand: true,
        src: 'fonts/*',
        dest: '<%= meta.distPath %>/'
      },
      docs: {
        expand: true,
        cwd: '<%= meta.distPath %>',
        src: [
          '**/*'
        ],
        dest: '<%= meta.docsPath %>'
      }
    },

    cssmin: {
      options: {
        banner: '', // set to empty; see bellow
        keepSpecialComments: '*' // set to '*' because we already add the banner in sass
      },
      ratchet: {
        src: '<%= meta.distPath %>css/<%= pkg.name %>.css',
        dest: '<%= meta.distPath %>css/<%= pkg.name %>.min.css'
      },
      theme: {
        files: {
          '<%= meta.distPath %>css/<%= pkg.name %>-theme-ios-rtl.min.css': '<%= meta.distPath %>css/<%= pkg.name %>-theme-ios-rt;.css',
          '<%= meta.distPath %>css/<%= pkg.name %>-theme-android-rtl.min.css': '<%= meta.distPath %>css/<%= pkg.name %>-theme-android-rtl.css'
        }
      }
    },

    uglify: {
      options: {
        banner: '<%= banner %>',
        compress: true,
        mangle: true,
        preserveComments: false
      },
      ratchet: {
        src: '<%= concat.ratchet.dest %>',
        dest: '<%= meta.distPath %>js/<%= pkg.name %>.min.js'
      },
      docs: {
        src: [
          '<%= meta.docsAssetsPath %>js/docs.js',
          '<%= meta.docsAssetsPath %>js/fingerblast.js'
        ],
        dest: '<%= meta.docsAssetsPath %>js/docs.min.js'
      }
    },

    sed: {
      versionNumber: {
        pattern: (function () {
          var old = grunt.option('oldver');
          return old ? RegExp.quote(old) : old;
        })(),
        replacement: grunt.option('newver'),
        recursive: true
      }
    }
  });

  // Load the plugins
  require('load-grunt-tasks')(grunt, { scope: 'devDependencies' });
  require('time-grunt')(grunt);

  // Default task(s).
  grunt.registerTask('dist-css', ['sass', 'csscomb', 'cssmin']);
  grunt.registerTask('dist-js', ['concat', 'uglify']);
  grunt.registerTask('dist', ['clean', 'dist-css', 'dist-js', 'copy', 'build-ratchicons-data']);
  grunt.registerTask('build', ['dist']);
  grunt.registerTask('default', ['dist']);

  grunt.registerTask('build-ratchicons-data', generateRatchiconsData);

  // Version numbering task.
  // grunt change-version-number --oldver=A.B.C --newver=X.Y.Z
  // This can be overzealous, so its changes should always be manually reviewed!
  grunt.registerTask('change-version-number', 'sed');
};
