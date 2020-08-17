/**
 * Tasks for running course on a local SCORM test server
 */
module.exports = function(grunt) {
  grunt.registerTask('server-scorm', 'Runs a SCORM test server using port 9099', ['_log-server', 'concurrent:spoor']);
};
