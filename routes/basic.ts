/// <reference path="..\typings\server.d.ts" />

import express = require('express');

export function index(req:express.Request, res: express.Response) {
  res.render('index', { user: req.user });
}

