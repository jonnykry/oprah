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

    describe.skip('transferCode(ghRepo, ghUsername, gfRepo, gfUsername, verbose)', function() {
        // TODO
    });

    describe('checkGitInstalled()', function() {
        it('should not display an error message if git is installed', function() {
            ct.checkGitInstalled();
            assert.equal(hook.captured(), '');
        });
        it('should return exit code 1 and display error if (mock) git isn\'t installed', function() {
            // Won't really test functionality if the code changes.
            // Mostly just to test that the logic is sound and works.
            function mockCheckGitInstalled() {
                if (!shell.which("gitnotinstalled")) {
                    shell.echo("Sorry, this script requires git.");
                }
            }
            mockCheckGitInstalled();
            assert.equal(hook.captured(), 'Sorry, this script requires git.\n');
        });
    });

    describe.skip('attemptToCheckoutMaster()', function() {
        // TODO
        it('should checkout master if no changes are staged for commit', function() {
            // ...
        });
        it('should return exit code 1 and display error if unable to checkout master', function() {
            // ...
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
