var grunt = require("grunt");


function chain(original, callback) {
  return function() {
    var args = Array.prototype.slice.call(arguments, 0);
    args.unshift(function() {
      var args = Array.prototype.slice.call(arguments, 0);
      return original.apply(this, args);
    }.bind(this));
    return callback.apply(this, args);
  };
};

grunt.task.normalizeMultiTaskFiles = chain(grunt.task.normalizeMultiTaskFiles, function(normalizeMultiTaskFiles, data, target) {
  var args = Array.prototype.slice.call(arguments, 1);
  var files = normalizeMultiTaskFiles.apply(this, args);
  files.forEach(function(file) {
    if (file.order) {
      file.src = file.order(file.src);
    }
  });
  return files;
});

grunt.file.expand = chain(grunt.file.expand, function(expand, options) {
  var args = Array.prototype.slice.call(arguments, 1);
  var files = expand.apply(this, args);
  if (options.order) {
    files = options.order(files);
  }
  return files;
});