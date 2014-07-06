import personmodel = require('../models/PersonModel');

export module PersonController {
    export interface Scope {
        person: personmodel.Person;
    }

    export class Controller {
        constructor($scope: Scope) {
            //$scope.greetingText = "Hello from TypeScript + AngularJS";
        }
    }

}