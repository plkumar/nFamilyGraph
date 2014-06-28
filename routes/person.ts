export module Person {

    export function index(req, res) {
        res.render('index', { user: req.user });
    };
}
