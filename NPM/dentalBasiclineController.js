/**
 *@ngdoc controller
 *@name he.claims.dental.controllers.dentalBasiclineController
 *@description
 * <P>
 * This controller handles the business logics and scope variable of the basic line item information
 * accordion view.
 * </p>
 * @project Xerox Health Enterprise
 * @Date
 * @version 1.0
 * @author 
 */
define(['../module'], function(controllerModule) {
    'use strict';
    controllerModule.controller('dentalBasiclineController', ['$scope',
		'$state',
        'notificationSrvc',
        'appConfig',
        'CommonDataService',
        'otherClaimInfoDataService',
        'd_toothsurface',
        'd_prosthesis',
        'd_dentaldiagnosispointer',
        'd_dentalplaceofservice',
        'dentalBasicClaimFactory',
        'dentalServiceInfoFactory',
		'serviceLineFactory',
		'serviceLineProviderFactory',
		'payerFactory',
        'basicLineFactory',
        'listenerFactory',
        '$filter',
        'appUtil',
		'accordianFactory',
		'descriptionFactory',
		'basicLineGrid',
		'otherServiceInfoAccordion',
		'logger',
        function($scope,
			$state,
            notificationSrvc,
            appConfig,
            CommonDataService,
            otherClaimInfoDataService,
            d_toothsurface,
            d_prosthesis,
            d_dentaldiagnosispointer,
            d_dentalplaceofservice,
            dentalBasicClaimFactory,
            dentalServiceInfoFactory,
			serviceLineFactory,
			serviceLineProviderFactory,
			payerFactory,
            basicLineFactory,
            listenerFactory,
            $filter,
            appUtil,
			accordianFactory,
			descriptionFactory,
			basicLineGrid,
			otherServiceInfoAccordion,
			logger) {

			//var basicLineGridGroup = accordianFactory.createAccordians(basicLineGrid);
			//$scope.basicLineGrid = accordianFactory.getAccordian("basicLineGrid");
            CommonDataService.store('dentalBasiclineController', $scope);
			$scope.gridTitle.serviceLine = 'Add service line item ';
			var log = logger.getLogger('dentalBasiclineController.js');
			/**
			 * This is used to store the select box list in seperate factory
			 */
			descriptionFactory.setDescription('dToothsurface', d_toothsurface);
            

            var screenName1 = appConfig.BASIC_CLAIM_INFO + appConfig.BASIC_LINE_ITEM_INFO + appConfig.FIELD_SET;   
            var screenName2 = appConfig.BASIC_CLAIM_INFO + appConfig.ADD_SRVC_LINE_INFO + appConfig.FIELD_SET;
			
			//Set the Grid Panel show status to false initially. So that it will hide grid title in view submitted mode.
			$scope.showAddServiceLineItem = !$scope.viewOnly;
			$scope.showToothStatus = !$scope.viewOnly;
			
			//this is for storing array index. 
			$scope.getIndex;
			
            /**
             * @ngdoc method
             * @name he.claims.dental.controllers.dentalBasiclineController#init
             * @methodOf he.claims.dental.controllers.dentalBasiclineController
             * @description init function is added for creating new instance with new data entered while 
             * clicking page level SUBMIT.This is invoked in dentalClaimController parent level controller mapSrvtoUI 
             * function.  
             */
            $scope.init = function() {
            	$scope.basicLineItemInformation  = $scope.getClaimInfo().getBasicLineItemInfo();
        		$scope.addServiceLineItem = basicLineFactory.initServiceLineItem({});
        		/**
        		 * This is for the service line grid
        		 */
                $scope.serviceLineItems = $scope.basicLineItemInformation.serviceLineItems;
	        };            
            $scope.init();
            listenerFactory.register('init', $scope.init);
            
			/**
			 * Since the descriptionFactory is loaded initially the below line is executed to get the selectbox description
			 */
            if ($state.params.flag == true) {
				basicLineFactory.initBasicLineItemInformation($scope.getClaimInfo().getBasicLineItemInfo());
			}
            $scope.toothInfo = {};
            $scope.basicToothStatus = 'Save';
            $scope.gridTitle.toothStatus = 'Add tooth information';

            /**
             * basic Line reference
             */  
            $scope.d_toothsurface = d_toothsurface;
            $scope.d_prosthesis = d_prosthesis;
            $scope.d_dentaldiagnosispointer = d_dentaldiagnosispointer;
            $scope.d_dentalplaceofservice = d_dentalplaceofservice;
            
			         

            $scope.BasicLineItemInfoDataModel = [{
                titles: 'Line number',
                map: 'sequenceNumber',
                sort: 'number'
            }, {
                titles: 'Procedure code',
                map: 'procedureCode',
                sort: 'string'
            },
	     {
                titles: '1',
                map: 'modifier1',
                sort: 'string'
            }, {
                titles: '2',
                map: 'modifier2',
                sort: 'string'
            }, {
                titles: '3',
                map: 'modifier3',
                sort: 'string'
            }, {
                titles: '4',
                map: 'modifier4',
                sort: 'string'
            }, {
                titles: 'Line item charge amount',
                map: 'lineItemChargeAmount',
                sort: 'float',
                align:'right'
            }, {
                titles: '1',
                map: 'oralCavityDesignation1',
                sort: 'string'
            }, {
                titles: '2',
                map: 'oralCavityDesignation2',
                sort: 'string'
            }, {
                titles: '3',
                map: 'oralCavityDesignation3',
                sort: 'string'
            }, {
                titles: '4',
                map: 'oralCavityDesignation4',
                sort: 'string'
            }, {
                titles: '5',
                map: 'oralCavityDesignation5',
                sort: 'string'
            }, {
                titles: 'Units',
                map: 'units',
                sort: 'string'
            }, {
                titles: 'Service date',
                map: 'serviceDate',
                sort: 'Date'
            }, {
                titles: 'Orthodontic banding date',
                map: 'orthodonticBandingDate',
                sort: 'string'
            }, {
                titles: 'Tooth / Surface',
                map: 'surfaceDate',
                sort: 'Date'
            }];
			/**
			 * this will hide the modify column in grid for view submitted claim
			 */ 
			if($scope.pageTitle != 'View submitted dental claim'){
				 $scope.BasicLineItemInfoDataModel.push(
				 {
				titles: 'Edit',
				edit: '<a class="editRow" tabindex="0" href="">Edit</a>&nbsp;'
				} , {
				titles: 'Delete',
				'delete': '<a class="deleteRow" tabindex="0" href=""><i class="glyphicon glyphicon-trash"><span style="display: none;">image</span></i></a>&nbsp;'
				});
			}
			
            $scope.basicgrouphead = [{
                startColumnName: 'modifier1',
                numberOfColumns: 4,
                titleText: 'Modifiers',
                titleSort: false
            }, {
                startColumnName: 'oralCavityDesignation1',
                numberOfColumns: 5,
                titleText: 'Oral cavity designation',
                titleSort: false
            }];

            $scope.toothInfoDataModel = [{
                titles: 'Tooth number',
                map: 'toothNumber',
                sort: 'number'
            }, {
                titles: '1',
                map: 'toothSurface1Desc',
                sort: 'string'
            }, {
                titles: '2',
                map: 'toothSurface2Desc',
                sort: 'string'
            }, {
                titles: '3',
                map: 'toothSurface3Desc',
                sort: 'string'
            }, {
                titles: '4',
                map: 'toothSurface4Desc',
                sort: 'string'
            }, {
                titles: '5',
                map: 'toothSurface5Desc',
                sort: 'string'
            }];
			
			/**
			 * this will hide the modify column in grid for view submitted claim
			 */ 
			if($scope.pageTitle != 'View submitted dental claim'){
				 $scope.toothInfoDataModel.push(
				 {
				titles: 'Edit',
				edit: '<a class="editRow" tabindex="0" href="">Edit</a>&nbsp;'
				} , {
				titles: 'Delete',
				'delete': '<a class="deleteRow" tabindex="0" href=""><i class="glyphicon glyphicon-trash"><span style="display: none;">image</span></i></a>&nbsp;'
				});
			}
         
            $scope.grouphead = [{
                startColumnName: 'toothSurface1Desc',
                numberOfColumns: 5,
                titleText: 'Tooth surface',
                titleSort: false
            }];


            /**
             * @ngdoc method
             * @name he.claims.dental.controllers.dentalBasiclineController#initAddServiceLine
             * @methodOf he.claims.dental.controllers.dentalBasiclineController
             * @description initAddServiceLine method is used to initialise the service line item grid in order to add 
             * a new line item. 
            */
            $scope.initAddServiceLine = function(actionType){
                //This one is for click of add button below service line grid. 
                $scope.addServiceLineItem = basicLineFactory.initServiceLineItem({});
				
                //Remove the red line border
                $scope.serviceLineItemValid = false;
				//Set the Grid Panel show status to false initially
				$scope.showAddServiceLineItem = !$scope.viewOnly;
				if(actionType !== 'reset'){
					$scope.basicLine.serviceStatus = 'Save';
					$scope.gridTitle.serviceLine = 'Add service line item';
					$('#AddServicelineitem1.collapse').collapse('hide');
					$('a[data-target="#AddServicelineitem1"]').toggleClass('collapsed');
				}
            };
			
			// This is for other service (3rd tab objects) initializations.
			$scope.initOtherServiceInfo = function(){
             	$scope.otherServiceInformation.servicelineInformation = serviceLineFactory.initServicelineInformation({});
    			$scope.otherServiceInformation.servicelineProviderInformation = serviceLineProviderFactory.initServicelineProvider({});
    			$scope.otherServiceInformation.otherpayerServicelineInformation =  payerFactory.initOtherpayerServicelineInformation({});
			};
			
			/**
			 * To show the total charge amount on top of the Basic Line Item grid.
			 */
            $scope.claimInfo.basicClaimInfo.totalClaimChargeAmount = $scope.getClaimInfo().basicClaimInfo.totalClaimChargeAmount == null ? '0.00' : $filter('number')($scope.getClaimInfo().basicClaimInfo.totalClaimChargeAmount, 2);
			
            /**
             * @ngdoc method
             * @name he.claims.dental.controllers.dentalBasiclineController#calculateTotal
             * @methodOf he.claims.dental.controllers.dentalBasiclineController
             * @description the total claim charge amount is calculated.
             * @return {Number} the total line item charge amount value is returned. 
            */
            $scope.calculateTotal = function(data){
            	var total = 0.00;
            	if(data && data.length>0){
            		angular.forEach(data, function(rec) {            			
            			var itemAmount = rec.diagnosisPointers.lineItemChargeAmount;
            			total = parseFloat(total) + parseFloat(itemAmount);            			
                    });            		
            	}
				$scope.accordian.clearAll();				
            	return total;
            };
            
            /**
             * @ngdoc method
             * @name he.claims.dental.controllers.dentalBasiclineController#lineSequence
             * @methodOf he.claims.dental.controllers.dentalBasiclineController
             * @description the sequence number gets generated every time a new line item is added. 
            */
            $scope.lineSequence = function() {

                var i = 0;
                /**
                 * @param {Object} for each object that is added in the grid a sequence number is generated.
                 */
                angular.forEach($scope.serviceLineItems, function(jsonObj) {
                	
                    log.debug('JSON OBJ',jsonObj);
                    jsonObj.sequenceNumber = ++i;
                    log.debug('seq',jsonObj.sequenceNumber);
                });
                
            }; 

            /**
             * @ngdoc method
             * @name he.claims.dental.controllers.dentalBasiclineController#saveServiceLine
             * @methodOf he.claims.dental.controllers.dentalBasiclineController
             * @description the line item gets added on click of Save button into the grid.
             * @return {Boolean} on click of save button present at grid level,first the validations happens. If fields
             * validate properly then it returns true and save item in the grid else throws error messages. 
            */
            $scope.saveServiceLine = function(statusClick) {
			$scope.skipHighLight = true;
                var isValid = $scope.validateServiceLineItem(statusClick);
                if (isValid) {
					 /**
                     * 50 line items only allowed per claim
                     */
                    if ($scope.serviceLineItems.length < 50) {
							$scope.addServiceLineItem.surfaceDate = CommonDataService.getToothSurfaceDetails($scope.addServiceLineItem.toothInformation[0]);

							var data = basicLineFactory.initServiceLineItem($scope.addServiceLineItem);
							$scope.serviceLineItems.push(data);
						} else {
							notificationSrvc.notifyError([appConfig.CLAIM_MAX_FIFTY_LNE_ITM]);
						}
						$scope.lineSequence();
						$scope.initAddServiceLine();
						$scope.initOtherServiceInfo();
						
						//this will store the array index for update line item.
						$scope.getIndex = $scope.serviceLineItems.indexOf(data);
					
						//Do not move this line up. After adding the data, total needs to be calculated
						var totalClaimAmount = $scope.calculateTotal($scope.serviceLineItems);  
						$scope.claimInfo.basicClaimInfo.totalClaimChargeAmount = $filter('number')(totalClaimAmount,2);
                }
                return isValid;
            };
            listenerFactory.register('saveServiceLineItem',$scope.saveServiceLine);     
          
			
            /**
             * @ngdoc method
             * @name he.claims.dental.controllers.dentalBasiclineController#saveAndOtherService
             * @methodOf he.claims.dental.controllers.dentalBasiclineController
             * @description on clicking save and add other srv info button the page navigates to the third tab.
             * @return {Boolean} if the field validate properly then it navigates to the third tab else it asks to fill
             * the required fields to navigate to third tab.
            */
            $scope.saveAndOtherService = function() {
            	$scope.skipHighLight = true;
				
            	if($scope.basicLine.serviceStatus == 'Save'){
                    var isValid = $scope.saveServiceLine(); 					
                } else if($scope.basicLine.serviceStatus == 'Edit'){
                    $scope.editserviceLineInfo($scope.addServiceLineItem);
                    var isValid = $scope.updateServiceLineInfo();
                } 
				
            	if(isValid){  
					
					angular.forEach(otherServiceInfoAccordion, function(value, key) {
						var accElement = angular.element('#'+value.id);
						accElement.parent().removeClass('alert-heading');
                        accElement.parent().removeClass('check-heading');
							
					  if(key !== 0){
						if (accElement.is(':visible')) {
                            angular.element('#'+value.id + '.collapse').collapse('hide');
                            angular.element('a[data-target=' + '#'+value.id + ']').toggleClass('collapsed');
                        }
						angular.forEach(value.children, function(valueChild, key) {
						accElement = angular.element('#'+valueChild.id);
						accElement.parent().removeClass('alert-heading');
                        accElement.parent().removeClass('check-heading');
							if (accElement.is(':visible')) {
								angular.element('#'+valueChild.id + '.collapse').collapse('hide');
								angular.element('a[data-target=' + '#'+valueChild.id + ']').toggleClass('collapsed');							
							}
						});
					  }else{
						if (accElement.is(':hidden')) {
                            angular.element('#'+value.id + '.collapse').collapse('show');
                            angular.element('a[data-target=' + '#'+value.id + ']').toggleClass('collapsed');
                        }
					  }
					});
          		
				angular.element('html, body').animate({scrollTop: 0}, 800);
							
					if(!flag){
						$scope.basicLine.serviceStatus = 'Edit';
						flag = true;
					}
                    if($scope.basicLine.serviceStatus == 'Save')
                    {
                    angular.element( document.querySelector( '#line_item_number' ) ).html('Line number ' + ($scope.serviceLineItems.length));
                    }else if($scope.basicLine.serviceStatus == 'Edit')
                    {
                    angular.element( document.querySelector( '#line_item_number' ) ).html('Line number ' + (editLineNumber));
                    }
					$scope.focusMe.servicelineInfo = true;
					$scope.showThirdTab = false;
					$scope.goToNewClaim();
            	} 
				$scope.basicLine.serviceStatus = 'Save';
            };
			
            /**
             * @ngdoc method
             * @name he.claims.dental.controllers.dentalBasiclineController#editserviceLineInfo
             * @methodOf he.claims.dental.controllers.dentalBasiclineController
             * @description the values populated in the grid can be edited by clicking on the edit button
             * present in the grid.
             * param {Object} on click of Edit link present in the grid the index of the object to be edited is fetched
             * and object is modfied.
            */
            $scope.editserviceLineInfo = function(serviceObj){
				$scope.rowClicked = true;
            	$scope.basicLine.serviceStatus = 'Edit';
                $scope.gridTitle.serviceLine = 'Edit service line item';
				
				//this will set grid title as View service line item if user navigate from view submitted screen
				if($scope.viewOnly ==true){
					$scope.showAddServiceLineItem = true;
					$scope.gridTitle.serviceLine = 'View line item details';
				}
				$scope.initOtherServiceInfo();
				
				//this will store the saved object data for the grid level reset to retain saved data
				$scope.savedGridObject = serviceObj;
             	$scope.addServiceLineItem = basicLineFactory.initServiceLineItem(angular.copy(serviceObj));
				
				//this is for third tab accordian level reset storing 3rd tab saved data.
				otherClaimInfoDataService.serviceLineSavedData = dentalServiceInfoFactory.initOtherServiceInformation(angular.copy(serviceObj.otherServiceInformation));
				
             	var otherServiceInformation = dentalServiceInfoFactory.initOtherServiceInformation($scope.addServiceLineItem.otherServiceInformation);

             	$scope.otherServiceInformation.servicelineInformation = otherServiceInformation.servicelineInformation;
    			$scope.otherServiceInformation.servicelineProviderInformation = otherServiceInformation.servicelineProviderInformation;
    			$scope.otherServiceInformation.otherpayerServicelineInformation = otherServiceInformation.otherpayerServicelineInformation;
    			
    			log.debug('edit:'+ JSON.stringify($scope.addServiceLineItem));
				if(angular.element('#AddServicelineitem1').is(':hidden')){
					appUtil.openGrid('AddServicelineitem1');
				}
            };
            
			//to store line number for showing in third tab
            var editLineNumber;
            var flag = true;
            /**
             * @ngdoc method
             * @name he.claims.dental.controllers.dentalBasiclineController#updateServiceLineInfo
             * @methodOf he.claims.dental.controllers.dentalBasiclineController
             * @description once the values have been edited, the updated values need to be repopulated in the
             * grid. This is done using this method.
             * @param {Object} the object which has been modified gets updated in the grid.
            */
            $scope.updateServiceLineInfo = function(statusClick){
			$scope.skipHighLight = true;
            	 var isValid = $scope.validateServiceLineItem(statusClick);
                 if (isValid) {
					$scope.getIndex = $scope.addServiceLineItem.sequenceNumber - 1;
					
                	$scope.addServiceLineItem.surfaceDate = CommonDataService.getToothSurfaceDetails($scope.addServiceLineItem.toothInformation[0]);
					var editedData = basicLineFactory.initServiceLineItem(angular.copy($scope.addServiceLineItem)); 
                	$scope.serviceLineItems[$scope.getIndex] = editedData;
					
					 //Do not move this line up. After adding the data, total needs to be calculated
                    var totalClaimChargeAmount = $scope.calculateTotal($scope.serviceLineItems);
                    $scope.claimInfo.basicClaimInfo.totalClaimChargeAmount = $filter('number')(totalClaimChargeAmount, 2);
                	$scope.lineSequence();
					editLineNumber = $scope.addServiceLineItem.sequenceNumber;
					flag = false;
					$scope.initAddServiceLine();
                 }  
				return isValid;				 
            };
			
			listenerFactory.register('updateServiceLineInfo',$scope.updateServiceLineInfo);
            
			
			//for3rd tab 
			$scope.updateOtherServiceLineInfo = function(){
				var getIndex =$scope.getIndex; 
				$scope.serviceLineItems[getIndex].otherServiceInformation = dentalServiceInfoFactory.initOtherServiceInformation(angular.copy($scope.otherServiceInformation));
            };
			listenerFactory.register('updateOtherServiceLineInfo',$scope.updateOtherServiceLineInfo);
			
            /**
             * @ngdoc method
             * @name he.claims.dental.controllers.dentalBasiclineController#deleteserviceLineInfo
             * @methodOf he.claims.dental.controllers.dentalBasiclineController
             * @description for deleting any line item from the grid.
             * @param {Onject} the object which is to be deleted from the grid is fetched with the help of it's index and
             * deleted.
            */
            $scope.deleteserviceLineInfo = function(serviceObj){
            	$scope.getIndex = $scope.serviceLineItems.indexOf(serviceObj);
				var totlaAmount = 
				$scope.claimInfo.basicClaimInfo.totalClaimChargeAmount = $filter('number')((($scope.claimInfo.basicClaimInfo.totalClaimChargeAmount.replace(/[^0-9\.]/g, ''))-(serviceObj.lineItemChargeAmount.replace(/[^0-9\.]/g, ''))),2);
            	$scope.serviceLineItems.splice($scope.getIndex, 1); 
				$scope.lineSequence();
				$scope.initAddServiceLine();
				$scope.initOtherServiceInfo();
            };

            /**
             * @ngdoc method
             * @name he.claims.dental.controllers.dentalBasiclineController#validateServiceLineItem
             * @methodOf he.claims.dental.controllers.dentalBasiclineController
             * @description this will validate the Service Line Item Grid SAVE.
             * @return {Boolean} when the fields validate properly it returns true else false
            */     
            $scope.validateServiceLineItem = function(statusClick) {
            	//accordianFactory.clearAll();
	           	 var errorString = [];
	             var isValid = true;
	             $scope.serviceLineItemValid = false;
					//this will skip the validion for template screen
					if($scope.skipValidation){
						$scope.accordian.register( $scope.addServiceLineItem.validateLineItemDates);
						$scope.accordian.registerChild('basicLineGrid.validateDates', $scope.addServiceLineItem.validateAdditionalLineItemDates);
						
						$scope.accordian.validate(null,$scope.skipHighLight);						
						errorString = $scope.accordian.getAllErrors();
						 if (errorString.length > 0 && statusClick !== 'overAllSave') {
							  isValid = false;
							  notificationSrvc.notifyError(errorString);
						 }
						 return isValid;
					}
	        	 
				 $scope.accordian.register($scope.validateBlank);
	             $scope.accordian.registerChild('basicLineGrid',$scope.addServiceLineItem.validateLineItem);
				 //$scope.accordian.register( $scope.addServiceLineItem.validateLineItemDates);
	             //$scope.accordian.register( $scope.addServiceLineItem.validateAdditionalLineItemDates);
				 
				 $scope.accordian.validate(null,$scope.skipHighLight);
	             errorString = $scope.accordian.getAllErrors();
	            
	             if (errorString.length > 0) {
	            	  isValid = false;
	            	  $scope.serviceLineItemValid = true; 
	                  notificationSrvc.notifyError(errorString);
	             }
	             return isValid;
            };

         
            /**
             * @ngdoc method
             * @name he.claims.dental.controllers.dentalBasiclineController#initToothinfo
             * @methodOf he.claims.dental.controllers.dentalBasiclineController
             * @description initialise the tooth information grid.
             * @param {String} when the actionType is not reset then the status is save and the grid collapses.
            */
            $scope.initToothinfo = function(actionType) {
                $scope.toothInfo = basicLineFactory.initToothStatus({});   
                $scope.BasicLineToothValid = false;
				
				$scope.showToothStatus = !$scope.viewOnly;
				
				if(actionType !== 'reset'){
					 $scope.basicToothStatus = 'Save';
					 $scope.gridTitle.toothStatus = 'Add tooth information';
					$('#AddTooth.collapse').collapse('hide');
					$('a[data-target="#AddTooth"]').toggleClass('collapsed');
				}
            };

            $scope.saveNewToothInfo = function() {
                var isValid = $scope.validateToothInformation();
                if (isValid) {
                    if ($scope.addServiceLineItem.toothInformation.length < 32) {
						var data = basicLineFactory.initToothStatus($scope.toothInfo);	
                        $scope.addServiceLineItem.toothInformation.push(data);
                    }
                    else {
                        notificationSrvc.notifyError([appConfig.CLAIM_DEN_MAX_TOOTH_INFO]);
                    }
                    $scope.initToothinfo();
                }
            };
            
            /**
             * @ngdoc method
             * @name he.claims.dental.controllers.dentalBasiclineController#editToothinfo
             * @methodOf he.claims.dental.controllers.dentalBasiclineController
             * @description edit the values already present in the tooth information grid.
             * @param {Object} the toothInfo onject is fetched from it's index to be modifed. 
            */
            $scope.editToothinfo = function(toothInfo){            	
            	$scope.basicToothStatus = 'Edit';
				$scope.gridTitle.toothStatus = 'Edit tooth information';
				
				//this will set grid title as View tooth information if user navigate from view submitted screen
				if($scope.viewOnly ==true){
					$scope.showToothStatus = true;
					$scope.gridTitle.toothStatus = 'View tooth information';
				}
				
				//this will store the saved object data for the grid level reset to retain saved data
				$scope.savedToothObject = toothInfo;
				
            	$scope.basicToothindex = $scope.addServiceLineItem.toothInformation.indexOf(toothInfo);
            	$scope.toothInfo = angular.copy(toothInfo);  
				
            	if(angular.element('#AddTooth').is(':hidden')){
					appUtil.openGrid('AddTooth');
				}
            };
            
            /**
             * @ngdoc method
             * @name he.claims.dental.controllers.dentalBasiclineController#updateToothinfo
             * @methodOf he.claims.dental.controllers.dentalBasiclineController
             * @description update the values in the grid after editing them.
             * @param {Object} basicToothindex object is the modified object which gets updated on the click of
             * save.
            */
            $scope.updateToothinfo = function(basicToothindex){
            	
            	var isValid = $scope.validateToothInformation();
                if (isValid) {
    				var toothObj = $scope.addServiceLineItem.toothInformation[basicToothindex];  
    				toothObj = $scope.toothInfo;
    				$scope.addServiceLineItem.toothInformation[basicToothindex] = toothObj;
    				$scope.initToothinfo();
    			}
            };
            
            /**
             * @ngdoc method
             * @name he.claims.dental.controllers.dentalBasiclineController#deleteToothinfo
             * @methodOf he.claims.dental.controllers.dentalBasiclineController
             * @description delete the line item on clicking the delete icon present in the grid.
             * @param {Object} toothObj is fetched from it's index in order to be deleted from the grid.
            */
            $scope.deleteToothinfo = function(toothObj){
            	$scope.basicToothindex = $scope.addServiceLineItem.toothInformation.indexOf(toothObj);
            	$scope.addServiceLineItem.toothInformation.splice($scope.basicToothindex, 1);
				$scope.initToothinfo();
            };

            /**
             * @ngdoc method
             * @name he.claims.dental.controllers.dentalBasiclineController#validateToothInformation
             * @methodOf he.claims.dental.controllers.dentalBasiclineController
             * @description Validation for Tooth New tooth information. However this will skip the validation for 
             * template screen
             * @return {Boolean} returns true if the fields validate properly else false.
            */
            $scope.validateToothInformation = function() {
				 //this will skip the validation for template screen
            	if($scope.skipValidation){
            		return true;
            	}
				
                var errorString = [];
                var isValid = true;
                $scope.BasicLineToothValid = false;

                if (!$scope.toothInfo.toothNumber) {
                    errorString.push(appConfig.CLAIM_DEN_TOOTH_REQ);
                }

                if (errorString.length > 0) {
                    isValid = false;
                    $scope.BasicLineToothValid = true;
                    notificationSrvc.notifyError(errorString);
                }

                return isValid;
            };   
            
            /**
             * @ngdoc method
             * @name he.claims.dental.controllers.dentalBasiclineController#validateLine
             * @methodOf he.claims.dental.controllers.dentalBasiclineController
             * @description This method will validate the on clicking Submit it will check whether grid 
             * having atleast one object or not.
             * @return {Array} the list of error messages that comes when validations happens and the field
             * values does not satisfy them
            */
            $scope.validateLine = function(validationLineName) {
            	 var errorList = [];
            	 
            	 $scope.accordian.submittedClicked = $scope.submittedClicked; 
				
				if(!validationLineName){
					$scope.accordian.register($scope.validateBlank);  
					if($scope.serviceLineItems && $scope.serviceLineItems.length==0){  
						$scope.accordian.registerChild('basicLineGrid',$scope.addServiceLineItem.validateLineItem);
					}else{
						$scope.accordian.registerChild('basicLineGrid',$scope.validateBlank);						
					}
					
					$scope.accordian.validate('',$scope.skipHighLight);
					
					errorList = $scope.accordian.getAllErrors();	
					if(errorList.length > 0)
					errorList.push(appConfig.DEN_LINE_ITEM);  	 
				}else{
				if(validationLineName === 'submitClaim'){
					validationLineName = null;
				}
				
				//Save on page Level save clicked
				if(angular.element('#AddServicelineitem1').is(':visible')){					
					if($scope.basicLine.serviceStatus == 'Save'){
						$scope.saveServiceLine('overAllSave'); 					
					} else if($scope.basicLine.serviceStatus == 'Edit'){
						$scope.updateServiceLineInfo('overAllSave');
					} 
				}
				$scope.accordian.register($scope.validateBlank,validationLineName);
					if($scope.serviceLineItems && $scope.serviceLineItems.length==0){  
						$scope.accordian.registerChild('basicLineGrid',$scope.addServiceLineItem.validateLineItem,validationLineName);
					}else{
						$scope.accordian.registerChild('basicLineGrid',$scope.validateBlank);						
					}
					$scope.accordian.submittedClicked = $scope.submittedClicked; 	
				}
				  
				  return errorList;
            };
			
			
			$scope.validateSubmit= function() {
				var errorList = [];
				$scope.skipHighLight = false;
				$scope.validateLine('submitClaim');
            };
            
            listenerFactory.register('submitClaim', $scope.validateSubmit);
			
			/**
             * @ngdoc method
             * @name he.claims.dental.controllers.dentalBasiclineController#validateSave
             * @methodOf he.claims.dental.controllers.dentalBasiclineController
             * @description This method will validate the on clicking Ssve it will check whether grid 
             * having atleast one object or not.
             * @return {Array} the list of error messages that comes when validations happens and the field
             * values does not satisfy them
            */
            $scope.validateSave= function() {
				var errorList = [];
				$scope.skipHighLight = false;
				$scope.validateLine('saveClaim');
				
            };
            listenerFactory.register('saveClaim', $scope.validateSave);

            /**
             * @ngdoc method
             * @name he.claims.dental.controllers.dentalBasiclineController#continueBasicLineItemInformation
             * @methodOf he.claims.dental.controllers.dentalBasiclineController
             * @description To validate BasicLineItemInformation accordion data when Conitune 
             * button is clicked.
             * @return {Array} list of error messages when the fields do not validate properly.
            */
            $scope.continueBasicLineItemInformation = function () {  
				//accordianFactory.clearAll();
				$scope.submittedClicked = false;
				$scope.skipHighLight = false;
                var errorList = $scope.validateLine();

                var idx1 = errorList.indexOf(appConfig.CLAIM_INS_DATE_GREATER + screenName1);
                if (idx1 !== -1) {
                    errorList.splice(idx1, 1);
                }

                var idx2 = errorList.indexOf(appConfig.CLAIM_INS_DATE_GREATER + screenName2);
                if (idx2 !== -1) {
                    errorList.splice(idx2, 1);
                }

                if (errorList.length > 0) {
                    notificationSrvc.notifyError(errorList);
                }
				
				if(angular.element('#AddServicelineitem1').is(':visible')){					
					if($scope.basicLine.serviceStatus == 'Save'){
						$scope.saveServiceLine('overAllSave'); 					
					} else if($scope.basicLine.serviceStatus == 'Edit'){
						$scope.updateServiceLineInfo('overAllSave');
					} 
				}else{
					$scope.accordian.validate();
				}
            };

            /**
             * @ngdoc method
             * @name he.claims.dental.controllers.dentalBasiclineController#intialiseBasicLineInformation
             * @methodOf he.claims.dental.controllers.dentalBasiclineController
             * @description To reset BasicLineItemInformation accordion data when Cancel button is clicked.
            */
            $scope.intialiseBasicLineInformation = function () {
				 //if already saved, reset the newly edited data and keep saved data
                var responseData = otherClaimInfoDataService.responseData;

                //pass it to factory and assign values
                if(!$.isEmptyObject(responseData)){
                    var basicLineItemInformation = responseData.basicClaimInfo.basicLineItemInformation;
                    $scope.claimInfo.basicClaimInfo.basicLineItemInformation = basicLineFactory.initBasicLineItemInformation(angular.copy(basicLineItemInformation));
					
                }else{
                    $scope.claimInfo.basicClaimInfo.basicLineItemInformation = basicLineFactory.initBasicLineItemInformation({});
                }
                var totalClaimChargeAmount = $scope.calculateTotal($scope.claimInfo.basicClaimInfo.basicLineItemInformation.serviceLineItems);
                $scope.claimInfo.basicClaimInfo.totalClaimChargeAmount = $filter('number')(totalClaimChargeAmount, 2);
                $scope.init();
                $scope.resetFlags($scope.accordian);
               
            };

            

           
			
			//for Dental template screen ipon clicking of page level save - to add record in Basic Line item
            $scope.saveGrid = function () {
                if(angular.element('#AddServicelineitem1').is(':visible')){					
					if($scope.basicLine.serviceStatus == 'Save'){
						$scope.saveServiceLine('overAllSave'); 					
					} else if($scope.basicLine.serviceStatus == 'Edit'){
						$scope.updateServiceLineInfo('overAllSave');
					} 
				}else{
					$scope.accordian.submittedClicked = true;
					$scope.accordian.skipHighLight = false;
					$scope.accordian.register($scope.validateBlank,'templateValidation');					
				}
            };
			listenerFactory.register('validateTemplate', $scope.saveGrid);
			
			/**
             * @ngdoc method
             * @name he.claims.dental.controllers.dentalBasiclineController#resetBasicLineGrid
             * @methodOf he.claims.dental.controllers.dentalBasiclineController
             * @description It will clear the data for new record and clear the newly added data and retain the saved data for saved object.
            */
			$scope.resetBasicLineGrid = function(){
				if($scope.basicLine.serviceStatus == 'Save'){
					$scope.addServiceLineItem = basicLineFactory.initServiceLineItem({});
				}else if($scope.basicLine.serviceStatus == 'Edit')
				{
					$scope.addServiceLineItem = basicLineFactory.initServiceLineItem(angular.copy($scope.savedGridObject));
				}
			}
			
			/**
             * @ngdoc method
             * @name he.claims.dental.controllers.dentalBasiclineController#resetToothGrid
             * @methodOf he.claims.dental.controllers.dentalBasiclineController
             * @description It will clear the data for new record and clear the newly added data and retain the saved data for saved object.
            */
			$scope.resetToothGrid = function(){
				if( $scope.basicToothStatus == 'Save'){
					$scope.toothInfo = basicLineFactory.initToothStatus({});   
				}else if($scope.basicToothStatus == 'Edit')
				{
					$scope.toothInfo = basicLineFactory.initToothStatus(angular.copy($scope.savedToothObject));   
				}
			}
        }
    ]);
});
