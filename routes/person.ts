/// <reference path="..\typings\server.d.ts" />

import express = require('express');

export module Person {

    export function index(req: express.Request, res: express.Response) {
        res.render('index', { user: req.user });
    }

    export function add(req, res) {

    }

    export function relatives(req, res) {
        console.log("Hello");
    }
}
