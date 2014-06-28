/// <reference path="..\packages\node.TypeScript.DefinitelyTyped.0.6.4\Content\Scripts\typings\node\node.d.ts" />
/// <reference path="..\packages\express.TypeScript.DefinitelyTyped.0.8.0\Content\Scripts\typings\express\express.d.ts" />
/// <reference path="..\packages\passport.TypeScript.DefinitelyTyped.0.0.2\Content\Scripts\typings\passport\passport.d.ts" />
/// <reference path="..\packages\passport-facebook.TypeScript.DefinitelyTyped.0.0.1\Content\Scripts\typings\passport-facebook\passport-facebook.d.ts" />
/// <reference path="..\packages\mongodb.TypeScript.DefinitelyTyped.0.0.9\Content\Scripts\typings\mongodb\mongodb.d.ts" />
/// <reference path="..\packages\mongoose.TypeScript.DefinitelyTyped.0.0.1\Content\Scripts\typings\mongoose\mongoose.d.ts" />

export module Person {

    export function index(req: Express.Request, res: Express.Response) {
        res.render('index', { user: req.user });
    }

    export function add(req, res) {

    }

    export function relatives(req, res) {
        console.log("Hello");
    }
}
