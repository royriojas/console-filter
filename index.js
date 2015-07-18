var transformTools = require( 'browserify-transform-tools' );
var path = require( 'path' );

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

/**
 * parses a valid regular expression represented as a string into a real Regular Expression
 * @method parseRegExp
 * @param regexAsString {String} that represents a valid regular expression
 * @returns {RegExp}
 */

var parseRegExp = function ( regexAsString ) {

  var matches = regexAsString.match( /(\/?)(.+)\1([a-z]*)/i );
  var flags = matches[ 3 ];

  if ( flags && !/^(?!.*?(.).*?\1)[gmixXsuUAJ]+$/.test( flags ) ) {
    return new RegExp( regexAsString );
  }

  var expression = matches[ 2 ];
  return new RegExp( expression, flags );
};

module.exports = transformTools.makeFalafelTransform( 'console-filter', options, function ( node, transformOptions, done ) {
  var config = transformOptions.config || {};
  var filter = config.filter;

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
        require( './console' ).log( '>>> keeping call on file:' + path.basename( transformOptions.file ), 'source: ' + source );
        done();
        return;
      }

      node.update( 'void(0)' );
    }
  }
  done();
} );
