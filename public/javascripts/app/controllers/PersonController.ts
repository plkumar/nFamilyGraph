/// <reference path=".\..\..\..\..\typings\server.d.ts" />

import personmodel = require('../models/PersonModel');

export module PersonController {
    export interface Scope extends ng.IScope {
        person: personmodel.Model.Person;
    }

    export class Controller {
        constructor($scope: Scope) {
            //$scope.greetingText = "Hello from TypeScript + AngularJS";
        }
    }

}