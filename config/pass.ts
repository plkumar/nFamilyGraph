/// <reference path="..\typings\server.d.ts" />

import passport = require('passport');
import passportlocal = require('passport-local');
import passportfacebook = require('passport-facebook');
import usermodel = require('../models/usermodel');

var LocalStrategy = passportlocal.Strategy;
var FacebookStrategy = passportfacebook.Strategy
var User = usermodel.userModel;

// Simple route middleware to ensure user is authenticated.  Otherwise send to login page.
export function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
};

// Check for admin middleware, this is unrelated to passport.js
// You can delete this if you use different method to check for admins or don't need admins
export function ensureAdmin(req?, res?, next?) {
	return function(req, res, next) {
		console.log(req.user);
		if(req.user && req.user.admin === true)
			next();
		else
			res.send(403);
	};
};

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.
//
//   Both serializer and deserializer edited for Remember Me functionality
passport.serializeUser(function(user, done:Function) {
	var createAccessToken = function () {
		var token = user.generateRandomToken();
		User.findOne( { accessToken: token }, function (err, existingUser) {
			if (err) { return done( err ); }
			if (!existingUser) {
				user.set('accessToken', token);
				user.save(function (err) {
					if (err) return done(err);
					return done(null, user.get('accessToken'));
				})
			} else {
				createAccessToken(); // Run the function again - the token has to be unique!
			}
		});
	};

	if ( user._id ) {
		createAccessToken();
	}
});

passport.deserializeUser(function(token, done: Function) {
    console.log('Deserializing user for toke:' + token);
	User.findOne( {accessToken: token } , function (err, user) {
        console.log('Found User ' + user.username);
		done(err, user);
	});
});

// Use the LocalStrategy within Passport.
//   Strategies in passport require a `verify` function, which accept
//   credentials (in this case, a username and password), and invoke a callback
//   with a user object.  In the real world, this would query a database;
//   however, in this example we are using a baked-in set of users.
passport.use(new LocalStrategy(function(username:String, password:String, done:Function) {
	User.findOne({ username: username }, function(err, user) {
		if (err) {
            return done(err);
        }

        if (!user) {
            return done(null, false, { message: 'Unknown user ' + username });
        }
		user.comparePassword(password, function(err, isMatch) {

				if (err)
                return done(err);

			if(isMatch) {
				return done(null, user);
			} else {
				return done(null, false, { message: 'Invalid password' });
			}
		});
	});
}));

passport.use(new FacebookStrategy({
    clientID: '1570828959809257',
    clientSecret: '11f1303d795219f2da396fbbee89176c',
    callbackURL: "http://localhost:" + process.env.PORT + "/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done: Function) {
      //console.log(profile);
         
      User.findOne({ facebookid: profile.id }, function(err, user) {
	    if (err) {
            return done(err);
        }

        if (!user) {
            //return done(null, false, { message: 'Unknown user ' + username });
            var user = new User({ username: profile.username
                , firstname : profile.name.givenName
                , lastname : profile.name.familyName
                , middlename : profile.name.middleName
			    , email: profile.username + '@facebook.com'
			    , password: User.randomPassword(20)
                , facebookid : profile.id
			    , admin: false });

            // save call is async, put grunt into async mode to work
            //var done = this.async();

            user.save(function(err) {
                if(err) {
                    console.log('Error: ' + err);
                    done(err);
                } else {
                    console.log('saved user: ' + user.username);
                    done(null, user);
                }
            });
        }else{
            done(null, user);
        }
	});
  }
));

