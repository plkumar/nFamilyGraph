/// <reference path="..\TypeScriptDefnitions\node\node.d.ts" />
/// <reference path="..\TypeScriptDefnitions\express\express.d.ts" />
/// <reference path="..\TypeScriptDefnitions\passport\passport.d.ts" />
/// <reference path="..\TypeScriptDefnitions\passport-facebook\passport-facebook.d.ts" />
/// <reference path="..\TypeScriptDefnitions\mongodb\mongodb.d.ts" />
/// <reference path="..\TypeScriptDefnitions\mongoose\mongoose.d.ts" />
(function (Person) {
    function index(req, res) {
        res.render('index', { user: req.user });
    }
    Person.index = index;

    function add(req, res) {
    }
    Person.add = add;

    function relatives(req, res) {
        console.log("Hello");
    }
    Person.relatives = relatives;
})(exports.Person || (exports.Person = {}));
var Person = exports.Person;
//# sourceMappingURL=person.js.map
