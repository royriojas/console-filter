describe( 'console-filter', function () {
  var proxyquire = require( 'proxyquire' );
  var transformTools = require( 'browserify-transform-tools' );
  var transform = proxyquire( '../', {
    './console': {
      log: function () {}
    }
  } );
  var path = require( 'path' );

  it( 'should do its magic only on modules that contain calls to console.*', function ( done ) {

    var dummyJsFile = path.resolve( __dirname, '../testFixtures/testWithConfig/dummy1.js' );

    var content = 'var fn = function () {};\nmodule.exports = fn;';

    transformTools.runTransform( transform.configure(), dummyJsFile, {
      content: content
    }, function ( err, transformed ) {

      if ( !err ) {
        expect( transformed ).to.be.equal( 'var fn = function () {};\nmodule.exports = fn;' );
        done();
      }
      throw err;
    }
    );
  } );

  it( 'should remove calls to console.* if they do not match the given filter of calls to keep', function ( done ) {

    var dummyJsFile = path.resolve( __dirname, '../testFixtures/testWithConfig/dummy2.js' );

    var content = '"use strict";\nvar fn = function () { \n  console.log("hello world");\n  console.log(\'my-prefix\', \'some other call here\');\n};\nmodule.exports = fn;';

    transformTools.runTransform( transform.configure( {
      filter: 'my-prefix'
    } ), dummyJsFile, {
      content: content
    }, function ( err, transformed ) {

      if ( !err ) {
        expect( transformed ).to.be.equal( '"use strict";\nvar fn = function () { \n  void(0);\n  console.log(\'my-prefix\', \'some other call here\');\n};\nmodule.exports = fn;' );
        done();
      }
      throw err;
    }
    );
  } );
} );
