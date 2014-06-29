var passport = require('passport');

function account(req, res) {
    res.render('account', { user: req.user });
}
exports.account = account;

function getlogin(req, res) {
    res.render('login', { user: req.user, message: req.session.messages });
}
exports.getlogin = getlogin;

function admin(req, res) {
    res.send('access granted admin!');
}
exports.admin = admin;

// POST /login
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
//
//   curl -v -d "username=bob&password=secret" http://127.0.0.1:3000/login
//
/***** This version has a problem with flash messages
app.post('/login',
passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),
function(req, res) {
res.redirect('/');
});
*/
// POST /login
//   This is an alternative implementation that uses a custom callback to
//   acheive the same functionality.
function postlogin(req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            req.session.messages = [info.message];
            return res.redirect('/login');
        }
        req.logIn(user, function (err) {
            if (err) {
                return next(err);
            }
            return res.redirect('/');
        });
    })(req, res, next);
}
exports.postlogin = postlogin;

function logout(req, res) {
    req.logout();
    res.redirect('/');
}
exports.logout = logout;
//# sourceMappingURL=user.js.map
