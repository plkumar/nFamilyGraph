function index(req, res) {
    res.render('index', { user: req.user });
}
exports.index = index;
//# sourceMappingURL=basic.js.map
