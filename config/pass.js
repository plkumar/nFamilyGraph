var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , db = require('./dbschema');

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    
	var createAccessToken = function () {
        var token = generateRandomToken();

        db.userModel.find({ where: { accessToken: token } }).success(function (existingUser) {
            if (existingUser) {
                console.log('One Match found ');
                if (existingUser) {
                    createAccessToken();
                }
            } else {
				user.accessToken = token;
				user.save(function (err) {
					if(err) {
						console.log('Error: ' + err);
						done(false);
					} else {
						console.log('saved user: ' + user.username);
						done();
					}
				});
            }
        }).error(function (err) {
            console.log("Error" + err);
        });
    };
    
//	db.userModel.findById(id, function (err, user) {
//    done(err, user);
//  });
    
    if (user.id) {
        createAccessToken();
    }
});

passport.use(new LocalStrategy(function(username, password, done) {
  db.userModel.findOne({ username: username }, function(err, user) {
    if (err) { return done(err); }
    if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }
    user.comparePassword(password, function(err, isMatch) {
      if (err) return done(err);
      if(isMatch) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Invalid password' });
      }
    });
  });
}));

// Simple route middleware to ensure user is authenticated.  Otherwise send to login page.
exports.ensureAuthenticated = function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
};

exports.generateRandomToken = function () {
    var chars = "_!abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890",
        token = new Date().getTime() + '_';
    for ( var x = 0; x < 16; x++ ) {
        var i = Math.floor( Math.random() * 62 );
        token += chars.charAt( i );
    }
    return token;
};

// Check for admin middleware, this is unrelated to passport.js
// You can delete this if you use different method to check for admins or don't need admins
exports.ensureAdmin = function ensureAdmin(req, res, next) {
    return function(req, res, next) {
	console.log(req.user);
        if(req.user && req.user.admin === true)
            next();
        else
            res.send(403);
    };
};
