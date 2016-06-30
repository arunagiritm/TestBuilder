import angular from "angular";
import routing from "./router";
import fileread from "./directive/fileRead.directive";
import TestBuilderController from "./controllers/testBuilderController";
import commonService from "./common/commonService";
import "./css/style.css";
import uirouter from "angular-ui-router";
import "../../node_modules/toastr/build/toastr.min.css";
import toastr from "toastr";

var moduleName = "testBuilder";

toastr.options = {
  "closeButton": true,
  "debug": false,
  "newestOnTop": false,
  "progressBar": true,
  "positionClass": "toast-top-right",
  "preventDuplicates": false,
  "onclick": null,
  "showDuration": "300",
  "hideDuration": "1000",
  "timeOut": "5000",
  "extendedTimeOut": "1000",
  "showEasing": "swing",
  "hideEasing": "linear",
  "showMethod": "fadeIn",
  "hideMethod": "fadeOut"
}


angular.module(moduleName, [])
    .config(routing)
    .directive('fileread',fileread)
    .controller('TestBuilderController', TestBuilderController)
    .service('commonService', commonService);

export default moduleName;