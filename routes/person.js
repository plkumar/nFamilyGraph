(function (Person) {
    function index(req, res) {
        res.render('index', { user: req.user });
    }
    Person.index = index;
    ;
})(exports.Person || (exports.Person = {}));
var Person = exports.Person;
//# sourceMappingURL=person.js.map
