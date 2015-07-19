var transformTools = require( 'browserify-transform-tools' );

var options = {
  excludeExtensions: [
    '.json',
    '.less',
    '.dot',
    '.tpl'
  ],
  includeExtensions: [
    '.js',
    '.jsx',
    '.es6'
  ]
};

var transformExclude = require( 'browserify-transform-tools-exclude' );
var parseRegExp = require( 'browserify-transform-tools-exclude/lib/parse-regex' );

var fnTransform = transformExclude( function ( node, transformOptions, done ) {
  var config = transformOptions.config || {};
  var filter = config.filter || config.keep;

  if ( !filter ) {
    done();
    return;
  }

  if ( node.type === 'CallExpression' ) {
    if ( node.callee && node.callee.source().indexOf( 'console.' ) === 0 ) {

      var regex = parseRegExp( filter );
      var source = node.source();

      var matchOnFile = transformOptions.file.match( regex );
      var matchOnSource = source.match( regex );
      if ( matchOnSource || matchOnFile ) {
        done();
        return;
      }

      node.update( 'void(0)' );
    }
  }
  done();
} );

module.exports = transformTools.makeFalafelTransform( 'console-filter', options, fnTransform );
