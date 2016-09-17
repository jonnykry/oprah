#! /usr/bin/env node

var assert = require('assert');


describe('Array', function() {
    describe('#indexOf()', function() {
        it('should return -1 when the value is not present', function() {
            // Example test
            assert.equal(-1, [1,2,3].indexOf(4));
        });
    });
});


describe('code-transfer', function() {
    describe.skip('transferCode(ghRepo, ghUsername, gfRepo, gfUsername, verbose)', function() {
        // TODO
    });

    describe.skip('checkGitInstalled()', function() {
        // TODO
        it('should not display an error message if git is installed', function() {
            // ...
        });
        it('should return exit code 1 and display error if git isn\'t installed', function() {
            // ...
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
