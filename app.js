var express = require('express')
  , app = express()
  , db = require('./models/user')
  , pass = require('./config/pass')
  , passport = require('passport')
  , basic_routes = require('./routes/basic')
  , user_routes = require('./routes/user')
  , person_routes = require('./routes/person').Person;
  //, connect=require('connect');

var port = process.env.PORT || 3000;

// configure Express
app.configure(function() {

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

    app.engine('.html', require('ejs').__express);

    // Optional since express defaults to CWD/views

    app.set('views', __dirname + '/views');

    // Without this you would need to
    // supply the extension to res.render()
    // ex: res.render('users.html').
    app.set('view engine', 'html');

	app.use(express.logger('dev'));
	app.use(express.cookieParser());

    // Following two lines are used instead of the express.bodyParser()
    app.use(express.urlencoded());
    app.use(express.json());

	//app.use(connect.methodOverride());
	app.use(express.session({ secret: 'keyboard cat' }));

	// Remember Me middleware
	app.use( function (req, res, next) {
		if ( req.method == 'POST' && req.url == '/login' ) {
			if ( req.body.rememberme ) {
				req.session.cookie.maxAge = 2592000000; // 30*24*60*60*1000 Rememeber 'me' for 30 days
			} else {
				req.session.cookie.expires = false;
			}
		}
		next();
	});

	// Initialize Passport!  Also use passport.session() middleware, to support
	// persistent login sessions (recommended).
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(app.router);
	app.use(express.static(__dirname + '/../../public'));
});


// Basic pages
app.get('/', basic_routes.index);

// User pages
app.get('/account', pass.ensureAuthenticated, user_routes.account);
app.get('/login', user_routes.getlogin);
app.post('/login', user_routes.postlogin);
app.get('/admin', pass.ensureAuthenticated, pass.ensureAdmin(), user_routes.admin);
app.get('/logout', user_routes.logout);
app.get('/person', person_routes.index);
// Redirect the user to Facebook for authentication.  When complete,
// Facebook will redirect the user back to the application at
//     /auth/facebook/callback
app.get('/auth/facebook', passport.authenticate('facebook'));

// Facebook will redirect the user to this URL after approval.  Finish the
// authentication process by attempting to obtain an access token.  If
// access was granted, the user will be logged in.  Otherwise,
// authentication has failed.

app.get('/auth/facebook/callback', 
  passport.authenticate('facebook', { successRedirect: '/',
                                      failureRedirect: '/login',
                                      scope: ['user_about_me', 'email'] }));

app.listen(port, function() {
  console.log('Express server listening on port ' + port);
});

