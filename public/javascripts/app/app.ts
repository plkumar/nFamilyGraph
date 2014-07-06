/// <reference path=".\..\..\..\typings\client.d.ts" />

module familygraph {

    var fgapp = angular.module('fgapp', [])
        .controller('personController', PersonController);
}