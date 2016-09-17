#! /usr/bin/env node

var assert = require('assert');
var shell = require('shelljs');
var ct = require('../source/code-transfer');


describe('Array', function() {
    describe('#indexOf()', function() {
        it('should return -1 when the value is not present', function() {
            // Example test
            assert.equal(-1, [1,2,3].indexOf(4));
        });
    });
});


describe('code-transfer', function() {
    var hook;

    beforeEach(function() {
        hook = captureStream(process.stdout);
    });

    afterEach(function() {
        hook.unhook();
    });

    describe.skip('transferCode(gfRepo, verbose)',
        function() {
            // TODO
    });

    describe('checkGitInstalled()', function() {
        var checkGitInstalledFail = function() {
            ct.checkGitInstalled(true);
        };
        var checkGitInstalledPass = function() {
            ct.checkGitInstalled(false);
        };
        it('should not display an error message if git is installed',
            function() {
                assert.doesNotThrow(checkGitInstalledPass, Error);
        });
        it('should exit and display error if git ' +
            + 'isn\'t installed', function() {
            assert.throws(checkGitInstalledFail, Error);
        });
    });

    describe('attemptToCheckoutMaster()', function() {
        var attemptToCheckoutMaster = function() {
            ct.attemptToCheckoutMaster(true);
        };
        it('should exit and display error if unable to checkout master',
            function() {
                shell.touch("generated-test-temp-file.js");
                assert.throws(attemptToCheckoutMaster, Error);
                shell.rm("generated-test-temp-file.js");
        });
    });

    describe.skip('setupGforgeRemote()', function() {
        // TODO
    });
});


describe.skip('issues-transfer', function() {
    // TODO
});


// This utility is used for capturing stdout for testing
function captureStream(stream){
    var oldWrite = stream.write;
    var buf = '';
    stream.write = function(chunk, encoding, callback) {
        buf += chunk.toString(); // chunk is a String or Buffer
        oldWrite.apply(stream, arguments);
    };

    return {
        unhook: function unhook() {
            // stream.write = oldWrite;
        },
        captured: function() {
            return buf;
        }
    };
}
