var Globby = require('globby');

// all files matched by the rules
Globby.select(rules).files;

// all other files
Globby.reject(rules).files;

// ooh chaining!
Globby.select(rules).reject(other_rules).files;