'use strict';

/* jshint -W106 */
module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      files: ['**/*.js', '.jshintrc', '!node_modules/**/*'],
      options: {
        jshintrc: '.jshintrc'
      }
    },
    cucumberjs: {
      files: 'features',
      options: {
        format: 'pretty'
      }
    },
    watch: {
      files: ['<%= jshint.files %>', '**/*.feature'],
      tasks: ['default']
    },
  })

  grunt.loadNpmTasks('grunt-contrib-jshint')
  grunt.loadNpmTasks('grunt-cucumber')
  grunt.loadNpmTasks('grunt-contrib-watch')

  grunt.registerTask('default', ['jshint', 'cucumberjs'])
}
/* jshint +W106 */
