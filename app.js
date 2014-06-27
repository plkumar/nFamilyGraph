var express = require('express')
  , app = express()
  , db = require('./models/user')
  , pass = require('./config/pass')
  , passport = require('passport')
  , basic_routes = require('./routes/basic')
  , user_routes = require('./routes/user')
  , connect=require('connect');

var port = process.env.PORT || 3000;

// configure Express
//noinspection JSValidateTypes
app.configure(function() {
    app.set('views', __dirname + '/views');
	app.engine('.html', require('ejs').__express);
    app.set('view engine', 'html');
	app.use(express.logger('dev'));
	app.use(express.cookieParser());
	app.use(connect.bodyParser());
	app.use(connect.methodOverride());
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

app.listen(port, function() {
  console.log('Express server listening on port ' + port);
});

