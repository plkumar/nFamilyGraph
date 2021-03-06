/// <reference path=".\typings\server.d.ts" />
var path = require('path');
var pass = require('./config/pass');
var passport = require('passport');
var basic_routes = require('./routes/basic');
var user_routes = require('./routes/user');
var personmodule = require('./routes/person');
var express = require('express');

var myapp = express();
var person_routes = personmodule.Person;

//, connect=require('connect');
var port = process.env.PORT || 3000;

// configure Express
myapp.configure(function () {
    // Register ejs as .html. If we did
    // not call this, we would need to
    // name our views foo.ejs instead
    // of foo.html. The __express method
    // is simply a function that engines
    // use to hook into the Express view
    // system by default, so if we want
    // to change "foo.ejs" to "foo.html"
    // we simply pass _any_ function, in this
    // case `ejs.__express`.
    myapp.engine('.html', require('ejs').__express);

    // Optional since express defaults to CWD/views
    myapp.set('views', __dirname + '/views');

    // Without this you would need to
    // supply the extension to res.render()
    // ex: res.render('users.html').
    myapp.set('view engine', 'html');

    myapp.use(express.logger('dev'));
    myapp.use(express.cookieParser());

    // Following two lines are used instead of the express.bodyParser()
    myapp.use(express.urlencoded());
    myapp.use(express.json());

    //myapp.use(connect.methodOverride());
    myapp.use(express.session({ secret: 'keyboard cat' }));

    // Remember Me middleware
    myapp.use(function (req, res, next) {
        if (req.method == 'POST' && req.url == '/login') {
            if (req.body.rememberme) {
                req.session.cookie.maxAge = 2592000000; // 30*24*60*60*1000 Rememeber 'me' for 30 days
            } else {
                req.session.cookie.expires = false;
            }
        }
        next();
    });

    // Initialize Passport!  Also use passport.session() middleware, to support
    // persistent login sessions (recommended).
    myapp.use(passport.initialize());
    myapp.use(passport.session());
    myapp.use(myapp.router);
    console.log(path.join(__dirname, './public'));
    myapp.use(express.static(path.join(__dirname, './public')));
});

// Basic pages
myapp.get('/', basic_routes.index);

// User pages
myapp.get('/account', pass.ensureAuthenticated, user_routes.account);
myapp.get('/login', user_routes.getlogin);
myapp.post('/login', user_routes.postlogin);
myapp.get('/admin', pass.ensureAuthenticated, pass.ensureAdmin(), user_routes.admin);
myapp.get('/logout', user_routes.logout);
myapp.get('/person', person_routes.index);

// Redirect the user to Facebook for authentication.  When complete,
// Facebook will redirect the user back to the application at
//     /auth/facebook/callback
myapp.get('/auth/facebook', passport.authenticate('facebook'));

// Facebook will redirect the user to this URL after approval.  Finish the
// authentication process by attempting to obtain an access token.  If
// access was granted, the user will be logged in.  Otherwise,
// authentication has failed.
myapp.get('/auth/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/login',
    scope: ['user_about_me', 'email'] }));

myapp.listen(port, function () {
    console.log('Express server listening on port ' + port);
    //console.log(JSON.stringify(process.config));
});
//# sourceMappingURL=app.js.map
