

define(['../module'], function(directives) {
    'use strict';
    directives.directive('accordian', [ '$compile','CommonDataService',
        function( $compile,CommonDataService) {
            return {
                restrict: 'E',
                scope: true,
                replace: true,
                templateUrl: 'src/common/directives/partials/heading.html',
                controller: function($scope, $attrs) {
                    var accordian = $scope.$eval($attrs.data);
                    $scope.accordian = accordian;
                    $scope.isCollapsed = accordian.isCollapsed();
                    
                           $scope.addAlertHeading = function(accElement) {
                             accElement.parent().removeClass("check-heading");
                             accElement.parent().addClass("alert-heading");
                         }

                         $scope.addCheckHeading = function(accElement) {
                             accElement.parent().removeClass("alert-heading");
                             accElement.parent().addClass("check-heading");
                         }
                         
                         $scope.expandAccordian = function(accElement, accId) {
                             if (accElement.is(":hidden")) {
                                 angular.element('#'+ accId + '.collapse').collapse('show');
                                 angular.element('a[data-target=' + '#'+ accId + ']').toggleClass('collapsed');
                             }
                         }
                         
                         $scope.collapseAccordian = function(accElement, accId) {
                             if (accElement.is(":visible")) {
                                 angular.element('#'+ accId + '.collapse').collapse('hide');
                                 angular.element('a[data-target=' + '#'+ accId + ']').toggleClass('collapsed');
                             }
                         }
                         
						  $scope.removeCheckHeading = function(accElement) {
                             accElement.parent().removeClass("alert-heading");
                             accElement.parent().removeClass("check-heading");
                         }
						 
                         $scope.updateChildAccordians = function() {
                                         for (var name in $scope.accordian.children) {
                                                var id = $scope.accordian.children[name].id;
                                                if(id !== null || id !== ''){
                                                       var childAccElement = angular.element('#'+id);
													   var childAccObject = $scope.accordian.children[name];
                                                       if(childAccObject.getStatus(childAccObject.validationName) === 'E') {
                                                              $scope.addAlertHeading(childAccElement);
                                                              $scope.expandAccordian(childAccElement, id);
                                                       }
                                                       else if(childAccObject.getStatus(childAccObject.validationName) === 'S'){
                                                              $scope.addCheckHeading(childAccElement);
                                                              $scope.collapseAccordian(childAccElement, id);
                                                       }else {
															$scope.removeCheckHeading(childAccElement);
                                                             
													   }
                                                }
                                         }      
                         }
                },
                link: function($scope) {
                    $scope.$watch('accordian.isDirty', function() {
                                  
                                  if ($scope.accordian.isDirty && $scope.accordian.skipHighLight !== true){
                                         var accElement = angular.element('#'+$scope.accordian.id);
                        if ($scope.accordian.getStatus($scope.accordian.validationName) === 'E') {
                           $scope.addAlertHeading(accElement);
                           $scope.expandAccordian(accElement, $scope.accordian.id);

                           $scope.updateChildAccordians();

                           if($scope.accordian.submittedClicked !== true){
                                                       CommonDataService.setTimeOut("#"+$scope.accordian.id);
                                                }else{
                                                       angular.element('html, body').animate({
                                                              scrollTop: 0
                                                       }, 800);
                                                }
                        } 
                        else if ($scope.accordian.getStatus($scope.accordian.validationName) === 'S') {
                           $scope.addCheckHeading(accElement);
                           $scope.collapseAccordian(accElement, $scope.accordian.id)
                           $scope.updateChildAccordians();
                                                
                                                if($scope.accordian.submittedClicked !== true){
                                                       var nextAccordian = $scope.accordian.getNextAccordian();
                                                       if (nextAccordian !== null) {
                                                              var nextAccElement = angular.element('#'+nextAccordian.id); 
                                                              $scope.expandAccordian(nextAccElement, nextAccordian.id);
                                                              nextAccordian.focusElement = true;
                                                              CommonDataService.setTimeOut("#"+nextAccordian.id);
                                                       }
                                                }
                        }else{
							$scope.removeCheckHeading(accElement);
						  
						   $scope.updateChildAccordians();
						}
						}
                        $scope.accordian.markAsClean();
                                  
                   });
                           }
            };
        }
    ]);
});

