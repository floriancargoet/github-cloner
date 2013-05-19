var read    = require('read');
var request = require('request');
var ncurses = require('ncurses');
var widgets = require('ncurses/lib/widgets');
var async   = require('async');
var exec    = require('child_process').exec;


// Ctrl+C -> clean up
process.on('SIGINT', function() {
    ncurses.cleanup();
    process.exit();
});

// On error -> clean up & print stack
process.on('uncaughtException',function(err) {
    ncurses.cleanup();
    console.log(err.stack);
    process.exit();
});


//ask username if not provided
function checkUsername(options, next){
    if(!options.username){
        read({
            prompt : 'Username: '
        }, function (err, username) {
            if (err) {
                next(err);
                return;
            }
            options.username = username;
            next(null, options);
        });
    } else {
        next(null, options);
    }
}

//ask password if not provided
function checkPasswd(options, next){
    if(!options.password){
        read({
            prompt : 'Password: ',
            silent : true
        }, function (err, password) {
            if (err) {
                next(err);
                return;
            }
            options.password = password;
            next(null, options);
        });
    } else {
        next(null, options);
    }
}

function fetchRepositories(options, next){
    request.get({
        url : 'https://api.github.com/users/' + options.username + '/repos',
        headers : {
            'User-Agent' : 'floriancargoet/github-cloner'
        }
    }, function (err, response, body) {
        if (err) {
            next(err);
            return;
        }
        var repositories = JSON.parse(body);
        repositories = repositories.map(function (repo) {
             return {
                name : repo.name,
                url  : repo.ssh_url
             };
        });
        next(null, options, repositories);
    });

}

function promptMultiselect(options, repositories, next){
    if(options.all){
        next(null, options, repositories);
        return;
    }

    var win = new ncurses.Window();
    var items = {};
    repositories.forEach(function (repo) {
        items[repo.name] = repo;
    });

    widgets.ListBox(items, {
        title  : 'Which repositories do you want to clone?',
        height : 10,
        multi  : true,
        style  : {
          colors : {
            bg : 'blue',
            sel : {
              fg : 'red'
            }
          }
        }
      }, function (selection) {
        win.close();
        ncurses.cleanup();

        next(null, options, selection || []);
    });
}

function cloneRepositories(options, repositories, next){
    async.eachSeries(repositories, function (repo, next) {
        console.log('Cloning ' + repo.name);
        exec('git clone ' + repo.url, function (err, stdout, stderr) {
            if (err) {
                next(new Error(stderr));
                return;
            }
            next();
        });
    }, next);
}

exports = module.exports = {
    checkUsername     : checkUsername,
    checkPasswd       : checkPasswd,
    fetchRepositories : fetchRepositories,
    promptMultiselect : promptMultiselect,
    cloneRepositories : cloneRepositories
};
