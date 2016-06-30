import angular from "angular";
import uirouter from "angular-ui-router";


import testbuilder from "./client/module";

var moduleName='app';
angular.module(moduleName, [uirouter,testbuilder]);

export default moduleName;