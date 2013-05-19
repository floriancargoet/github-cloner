#!/usr/bin/env node

var optimist = require('optimist');
var async    = require('async');

var tasks = require('./tasks.js');

var argv = optimist
    .usage('Clone your GitHub repositories.\nUsage: $0')

    .alias('username', 'u')
    .describe('username', 'GitHub username, asked interactively if not given')
    
//    .alias('password', 'p')
//    .describe('password', 'GitHub password, asked interactively if not given')
    
    .alias('all', 'a')
    .describe('all', 'Clone all repositories, non interactive')

    .wrap(72)
    .argv;

async.waterfall([
    // starts waterfall with program options
    function (next) {
        next(null, argv);
    },
    // prompt if not provided
    tasks.checkUsername,
//    tasks.checkPasswd,

    tasks.fetchRepositories,
    tasks.promptMultiselect,
    tasks.cloneRepositories
], function (err) {
    if (err) {
        console.log('Failed');
        console.log(err);
    } else {
        console.log('Done');
    }
});
