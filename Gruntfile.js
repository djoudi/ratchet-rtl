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
      dist: ['dist/']
    },

    sass: {
      options: {
        banner: '<%= banner %>',
        style: 'expanded',
        unixNewlines: true
      },
      dist: {
        files: {
          'dist/css/<%= pkg.name %>.css': 'sass/<%= pkg.name %>.scss',
        }
      }
    },

    csscomb: {
      options: {
        config: 'sass/.csscomb.json'
      },
      dist: {
        files: {
          'dist/css/<%= pkg.name %>.css': 'dist/css/<%= pkg.name %>.css'
        }
      }
    },

    cssmin: {
      options: {
        banner: '', // set to empty; see bellow
        keepSpecialComments: '*' // set to '*' because we already add the banner in sass
      },
      dist: {
        files: {
          'dist/css/<%= pkg.name %>.min.css': 'dist/css/<%= pkg.name %>.css',
        }
      }
    }

  });

  // Load the plugins
  require('load-grunt-tasks')(grunt, { scope: 'devDependencies' });
  require('time-grunt')(grunt);

  // Default task(s).
  grunt.registerTask('dist-css', ['sass', 'csscomb', 'cssmin']);
  grunt.registerTask('build', ['dist-css']);
  grunt.registerTask('default', ['dist-css']);
};
