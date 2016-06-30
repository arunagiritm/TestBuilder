/**
 *@ngdoc controller
 *@name he.claims.dental.controllers.dentalBasicClaimController
 *@description
 * <P>
 * This controller handles the business logics and scope variable of the claim information accordion.
 * </p>
 * @project Xerox Health Enterprise
 * @Date
 * @version 1.0
 * @author
 */
define(['../module'], function(controllerModule) {
    'use strict';
    controllerModule.controller('dentalBasicClaimController', ['$scope',
        'notificationSrvc',
        'appConfig',
        'CommonDataService',
        'otherClaimInfoDataService',
        'd_relatedcause',
        'd_state',
        'd_dentalplaceofservice',
        'd_benefitsassignmentcertification',
        'd_dentalassignment',
        'd_releaseofinformationcode',
        'd_delayreasoncode',
        'd_dentalsplpgmtypecode',
        'd_serviceauthorizationexception',
        'd_dentalattachmenttype',
        'd_claimsdeliverymethod',
        'dentalBasicClaimFactory',
        'claimInfoFactory',
        'listenerFactory',
        'appUtil',
		'accordianFactory',
        function($scope,
            notificationSrvc,
            appConfig,
            CommonDataService,
            otherClaimInfoDataService,
            d_relatedcause,
            d_state,
            d_dentalplaceofservice,
            d_benefitsassignmentcertification,
            d_dentalassignment,
            d_releaseofinformationcode,
            d_delayreasoncode,
            d_dentalsplpgmtypecode,
            d_serviceauthorizationexception,
            d_dentalattachmenttype,
            d_claimsdeliverymethod,
            dentalBasicClaimFactory,
            claimInfoFactory,
            listenerFactory,
            appUtil,
			accordianFactory) {

            CommonDataService.store('dentalBasicClaimController', $scope);  
            
            /**
			
             * @ngdoc method
             * @name he.claims.dental.controllers.dentalBasicClaimController#init
             * @methodOf he.claims.dental.controllers.dentalBasicClaimController
             * @description init function is added for creating new instance with new data entered while 
             * clicking page level SUBMIT.This is invoked in dentalClaimController parent level controller mapSrvtoUI 
             * function.  
             */
			 var vm=this;
            vm.init = function() {
                $scope.claimInformation = $scope.getClaimInfo().getClaimsInfo();
                /**
				 * this will load one empty object for Attachments array.
                 */ 
                $scope.attachmentVO = claimInfoFactory.initAttachments({});
	        };            
            $scope.init();
            
            listenerFactory.register('init', $scope.init);
          
            $scope.attachmentStatus = 'Save';                        

            $scope.claimAttachmentsModal = [{
                titles: 'Type attachment',
                map: 'attachmentType',
                sort: 'string'
            }, {
                titles: 'Delivery method',
                map: 'deliveryMethod',
                sort: 'string'
            }, {
                titles: 'Attachment control',
                map: 'attachmentControl',
                sort: 'string'
            }];
			
			/**
			 * this will hide the modify column in grid for view submitted claim
			 */ 
			if($scope.pageTitle != 'View submitted dental claim'){
				 $scope.claimAttachmentsModal.push({
					titles: 'Modify ',
					edit: '<a class="editRow" tabindex="0" href="">Edit</a>&nbsp;',
					'delete': '<a class="deleteRow" tabindex="0" href=""><i class="glyphicon glyphicon-trash"><span style="display: none;">image</span></i></a>&nbsp;',
					width: 10
				});
			}
            
            $scope.d_relatedcause = d_relatedcause;
            $scope.d_state = d_state;
            $scope.d_dentalplaceofservice = d_dentalplaceofservice;
            $scope.d_benefitsassignmentcertification = d_benefitsassignmentcertification;
            $scope.d_dentalassignment = d_dentalassignment;
            $scope.d_releaseofinformationcode = d_releaseofinformationcode;
            $scope.d_delayreasoncode = d_delayreasoncode;
            $scope.d_dentalsplpgmtypecode = d_dentalsplpgmtypecode;
            $scope.d_serviceauthorizationexception = d_serviceauthorizationexception;
            $scope.d_dentalattachmenttype = d_dentalattachmenttype;
            $scope.d_claimsdeliverymethod = d_claimsdeliverymethod;

            
            /**
             * @ngdoc method
             * @name he.claims.dental.controllers.dentalBasicClaimController#initAttachment
             * @methodOf he.claims.dental.controllers.dentalBasicClaimController
             * @description initialising the field values for Claim Attachment grid so that it does not 
             * the previous values once the values get populated in the grid.  
             * @param {String} if the actionType is not reset then the status of attachment becomes Save
             */
            vm.initAttachment = function(actionType) {
            	$scope.attachmentVO = claimInfoFactory.initAttachments({});

            	/**
				 * To remove red border on cancel or initialise
                 */
                $scope.attachementValid = false;
				
				if(actionType !== 'reset'){
					$scope.attachmentStatus = 'Save';
					$('#AddServicelineitem.collapse').collapse('hide');
					$('a[data-target="#AddServicelineitem"]').toggleClass('collapsed');
				}
            };

            /**
             * @ngdoc method
             * @name he.claims.dental.controllers.dentalBasicClaimController#saveAttachments
             * @methodOf he.claims.dental.controllers.dentalBasicClaimController
             * @description this method saves the values entered in the fields in the grid.  
             */
            vm.saveAttachments = function() {
                var isValid = $scope.validateAttachment();
                if (isValid) {
                   
                    
                    var data = claimInfoFactory.initAttachments($scope.attachmentVO);	
                    $scope.claimInformation.attachment.push(data);
                    $scope.initAttachment();
                }
            };
            
            /**
             * @ngdoc method
             * @name he.claims.dental.controllers.dentalBasicClaimController#editAttachment
             * @methodOf he.claims.dental.controllers.dentalBasicClaimController
             * @description the values in the grid can be edited or modified by clicking on the edit link 
             * present in the grid. 
             * @param {Object} on click of edit the index of the object to be edited is fetched and modified according
             * to requirement.
             */
            vm.editAttachment = function(attachmentObj){
            	$scope.attachmentStatus = 'Edit';
            	
            	$scope.attachEditableIdx = $scope.claimInformation.attachment.indexOf(attachmentObj);
            	$scope.attachmentVO = angular.copy(attachmentObj);  

				if(angular.element('#AddServicelineitem').is(':hidden')){
					appUtil.openGrid('AddServicelineitem');
				}
            };
            
            /**
             * @ngdoc method
             * @name he.claims.dental.controllers.dentalBasicClaimController#updateAttachment
             * @methodOf he.claims.dental.controllers.dentalBasicClaimController
             * @description the modified values of the fields are updated in the grid.  
             * @param {Object} the index of the object which is modifed is then updated in the grid.
             */
            vm.updateAttachment = function(attachEditableIdx){
            	 var isValid = $scope.validateAttachment();
                 if (isValid) {
                	 var attachmentObj = $scope.claimInformation.attachment[attachEditableIdx];
                	 attachmentObj = $scope.attachmentVO;
                	 attachmentObj.typeAttachmentDesc = CommonDataService.getDropdownDescription(d_dentalattachmenttype, attachmentObj.typeAttachment);
                	 attachmentObj.deliveryMethodDesc = CommonDataService.getDropdownDescription(d_claimsdeliverymethod, attachmentObj.deliveryMethod);
                     
                     $scope.claimInformation.attachment[attachEditableIdx] = attachmentObj;                     
                     $scope.initAttachment();
                 }                 
            };
            
            /**
             * @ngdoc method
             * @name he.claims.dental.controllers.dentalBasicClaimController#deleteAttachment
             * @methodOf he.claims.dental.controllers.dentalBasicClaimController
             * @description deleting a record from the grid on the click of Delete button. 
             * @param {Object} the index of the object to be deleted is fetched and the record is deleted.
             */
            vm.deleteAttachment = function(attachmentObj){
            	$scope.attachEditableIdx = $scope.claimInformation.attachment.indexOf(attachmentObj);
    			$scope.claimInformation.attachment.splice($scope.attachEditableIdx, 1);  
            };

            /**
             * @ngdoc method
             * @name he.claims.dental.controllers.dentalBasicClaimController#validateAttachment
             * @methodOf he.claims.dental.controllers.dentalBasicClaimController
             * @description This method will validate the attachment grid. However this validation is skipped for
             * template screen.
             * @return {boolean} if the fields validate properly then returns true else false.
             */
             vm.validateAttachment = function() { 
					/**
					 * this will skip the validion for template screen 
					 */
					if($scope.skipValidation){
						return true;
					}
            	  var errorString = [];
                  var isValid = true;
                  $scope.attachementValid =false;
                  
	        	  var screenName2 = appConfig.BASIC_CLAIM_INFO + appConfig.CLAIM_ATT + appConfig.FIELD_SET;
		          $scope.attachmentVO.validateAttachmentInfo(screenName2, errorString);
		          
		          if (errorString.length > 0) {
	            	  isValid = false;
	            	  $scope.attachementValid = true;
	                  notificationSrvc.notifyError(errorString);
	              }
	              return isValid;

            };
            
            /**
             * @ngdoc method
             * @name he.claims.dental.controllers.dentalBasicClaimController#validate
             * @methodOf he.claims.dental.controllers.dentalBasicClaimController
             * @description validates the fields on the click of submit.If it returns false, 
             * error messages will be displayed otherwise the accordion will be submitted successfully. 
             * @return {Array} the list of error messages which comes when validations happens.  
             */
	          vm.validate = function() {
	        	  //var screenName1 = appConfig.BASIC_CLAIM_INFO + appConfig.CLAIM_INFO + appConfig.FIELD_SET;		          
		          $scope.accordian.register( $scope.claimInformation.validateClaimInfo);
				  $scope.accordian.registerChild('templateValidateAccData', $scope.claimInformation.validateAccDate);
				  $scope.accordian.submittedClicked = $scope.submittedClicked;				  
				  $scope.accordian.validate();
				  var errorList = $scope.accordian.getAllErrors();
				  	
				  return errorList;
	          };
	          
	          listenerFactory.register('submitClaim', $scope.validate);
			  
			/**
             * @ngdoc method
             * @name he.claims.dental.controllers.dentalBasicClaimController#validateSave
             * @methodOf he.claims.dental.controllers.dentalBasicClaimController
             * @description validates the fields on the click of save.If it returns false, 
             * error messages will be displayed otherwise the accordion will be submitted successfully. 
             * @return {Array} the list of error messages which comes when validations happens.
             */
              vm.validateSave= function() {
				$scope.accordian.register($scope.claimInformation.validateServiceDate,'saveClaim');
				
				$scope.accordian.submittedClicked = $scope.submittedClicked; 	 
            };
            listenerFactory.register('saveClaim', $scope.validateSave);

            /**
             * @ngdoc method
             * @name he.claims.dental.controllers.dentalBasicClaimController#continueBasicClaimInfo
             * @methodOf he.claims.dental.controllers.dentalBasicClaimController
             * @description To validate BasicClaimInformation accordion data when Continue button is clicked
             * @return {Array} the list of error messages which comes when validations happen.
             */
            vm.continueBasicClaimInformation = function () {
				//accordianFactory.clearAll();
				$scope.submittedClicked = false;				
                var errorList = $scope.validate();
                if (errorList.length > 0) {
                    notificationSrvc.notifyError(errorList);
                }
            };

            /**
             * @ngdoc method
             * @name he.claims.dental.controllers.dentalBasicClaimController#intialiseBasicClaimInformation
             * @methodOf he.claims.dental.controllers.dentalBasicClaimController
             * @description To initialise the field values on the click of Reset on accordion level.
             */
            vm.intialiseBasicClaimInformation = function () {
				//if already saved, reset the newly edited data and keep saved data
                var responseData = otherClaimInfoDataService.responseData;

                //pass it to factory and assign values
                if(!$.isEmptyObject(responseData)){
                    var claimInformation = responseData.basicClaimInfo.claimInformation;
                    $scope.claimInfo.basicClaimInfo.claimInformation = claimInfoFactory.initClaimInformation(claimInformation);
                }else{
                   $scope.claimInfo.basicClaimInfo.claimInformation = claimInfoFactory.initClaimInformation({});
                }
                $scope.init();
                $scope.resetFlags($scope.accordian);
            };


            
			
            /**
             * @ngdoc method
             * @name he.claims.dental.controllers.dentalBasicClaimController#validateTemplate
             * @methodOf he.claims.dental.controllers.dentalBasicClaimController
             * @description To validate the date fields inside a template. A template has validations for just date fields.
             * @retun {Array} returns list of error messages for date validations which happens in template screen.
             */
			vm.validateTemplate = function() {
                  //var screenName1 = appConfig.BASIC_CLAIM_INFO + appConfig.CLAIM_INFO + appConfig.FIELD_SET;
				  $scope.accordian.submittedClicked = true;
				  $scope.accordian.register($scope.validateBlank,'templateValidation');
		          $scope.accordian.registerChild('templateValidateServiceData',$scope.claimInformation.validateServiceDate,'templateValidation');
				  $scope.accordian.registerChild('templateValidateAccData',$scope.claimInformation.validateAccidaentDate,'templateValidation');
				  $scope.accordian.registerChild('templateValidateAppData',$scope.claimInformation.validateAppDate,'templateValidation');
            };
            listenerFactory.register('validateTemplate', $scope.validateTemplate);

        }
    ]);
});