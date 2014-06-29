/// <reference path="..\TypeScriptDefnitions\node\node.d.ts" />
/// <reference path="..\TypeScriptDefnitions\express\express.d.ts" />
/// <reference path="..\TypeScriptDefnitions\passport\passport.d.ts" />
/// <reference path="..\TypeScriptDefnitions\passport-facebook\passport-facebook.d.ts" />
/// <reference path="..\TypeScriptDefnitions\mongodb\mongodb.d.ts" />
/// <reference path="..\TypeScriptDefnitions\mongoose\mongoose.d.ts" />
import express = require('express');

export function index(req:express.Request, res: express.Response) {
  res.render('index', { user: req.user });
}

