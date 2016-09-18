#! /usr/bin/env node

var assert = require('assert');
var shell = require('shelljs');
var ct = require('../source/code-transfer');

// Test methods in the code-transfer.js file
describe('code-transfer', function() {

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
        it('should exit and display error if git isn\'t installed', function() {
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
});
