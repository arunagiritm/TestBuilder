
define(['../module'], function(controllerModule) {
    'use strict';

    
    controllerModule.controller('claimsController', ['$scope',
        '$state',
        '$modal',
        'otherClaimInfoDataService',
        'CommonDataService',
        'notificationSrvc',
		'usSpinnerService',
        'mmisUIService',
        'listenerFactory',
        'appConfig',
        'appUtil',
        '$injector',
		'claimsService',
		'accordianFactory',
        'commonCacheFactory',
		'errorFactory',
		'saveDentalClaim',
		'basicLineGrid',
		'otherCoOrdinationOfBenefitsGroup',
		'dentalServiceInfoFactory',
		'otherServiceInfoAccordion',
        function($scope,
            $state,
            $modal,
            otherClaimInfoDataService,
            CommonDataService,
            notificationSrvc,
			usSpinnerService,
            mmisUIService,
            listenerFactory,
            appConfig,
            appUtil, 
            $injector,
			claimsService,
			accordianFactory,
            commonCacheFactory,errorFactory,saveDentalClaim,basicLineGrid,otherCoOrdinationOfBenefitsGroup,dentalServiceInfoFactory,otherServiceInfoAccordion) {
    	
		
		listenerFactory.clear();
		
		
		if ($state.params.viewOnly) {
			$scope.viewOnly = $state.params.viewOnly;
		}
		else {
			$scope.viewOnly = false;
		}
		
		var saveDentalClaimGroup = accordianFactory.createAccordianGroup('saveDentalClaim',saveDentalClaim);
		
		
		
			
            otherClaimInfoDataService.responseData = {};
			
			$scope.focusMe = {};
			$scope.gridTitle = {};
    		var claimFactory = $injector.get('claimFactory.' + $state.params.claimType);

            $scope.errorString = [];
            $scope.invalidList = [];
            $scope.ids = [];
			$scope.basicLine = {};
			$scope.basicLine.serviceStatus = 'Save';
            
    		 $scope.submitCheckedOut = false;
              if ($state.params.pageTitle == "View Submitted "+$state.params.claimType+" Claim") {
                 $scope.checkedOut = true;
                 $scope.submitCheckedOut = true;
                 setTimeout(function () {
                     $scope.disableElements();
                     $("[id*='datetime']").addClass('disable-datediv');
                     angular.element('#dentalCancelBtn').removeAttr('disabled');
                     angular.element('#dentalOtherCancelBtn').removeAttr('disabled');
                 }, 500);
             }
			 
	        
	        $scope.getClaimInfo = function() {
	        	return $scope.claimInfo;
	        };

            
            $scope.mapSrvtoUI = function(response) {
           	 	$scope.claimInfo = claimFactory.initClaim(response);
                listenerFactory.invoke('init');
            };
			
            $scope.pageTitle = 'New '+$state.params.claimType+ ' claim';
            $scope.headerTitle = 'Create claims';
			
    	    
            $scope.init = function() {
    	        $scope.claimInfo = claimFactory.initClaim({});
    	        $scope.otherServiceInformation = claimFactory.initOtherService({});
            }
			$scope.init();
			
			$scope.tab = 1;
            $scope.setTab = function(tabId) {
                $scope.tab = tabId;
            };

            $scope.isSet = function(tabId) {
                return $scope.tab === tabId;
            };

            $scope.removeBorder = function(id) {
                $('#' + id).addClass('makenormal');
            };

			
			$scope.showThirdTab = false;
            $scope.goToNewClaim = function() {
                $scope.setTab(3);
                $scope.showThirdTab = true;
            };

			
            $scope.returnToBasicClaim = function() {  
				if($scope.basicLine.serviceStatus == "Edit" || $scope.basicLine.serviceStatus == "Save"){
                    listenerFactory.invoke("updateOtherServiceLineInfo");
                }else{
					listenerFactory.invoke("saveServiceLineItem");
				}
				
                $scope.setTab(1);
                $scope.showThirdTab = false;
                $scope.clearOtherServiceCSS();
            };
			
            
            $scope.cancelOSiClaim = function() {
                $scope.setTab(1);
                
                $scope.otherServiceInformation = claimFactory.initOtherService({});
				$scope.showThirdTab = false;
                CommonDataService.setTimeOut('#basicLineInfo');
                $scope.clearOtherServiceCSS();
            };
			
			
            $scope.saveAndReturnToBSLI = function(serviceEditableIdx) {
                var isValid = $scope.validateSaveOtherService();
                if (isValid) {
                    $scope.setTab(1);
                    CommonDataService.setTimeOut('#basicLineInfo', function() {
                        appUtil.openGrid('AddServicelineitem1');
                    });
                    $scope.returnToBasicClaim(serviceEditableIdx);
                }
                $scope.clearOtherServiceCSS();
            };
			
			$scope.goToBasicClaim = function(){
    			$scope.setTab(1);
				$scope.showThirdTab = false;
				angular.element('html, body').animate({
                    scrollTop: 0
                }, 800);
    		};
			
			$scope.goToOtherClaim = function(){
    			$scope.setTab(2);
				$scope.showThirdTab = false;
				angular.element('html, body').animate({
                    scrollTop: 0
                }, 800);
    		};
			
			$scope.goToCOB = function(){
    			$scope.setTab(2);
				$scope.showThirdTab = false;
				setTimeout(function (e) {
					$(document).scrollTop($('#accordion3').offset().top - 88);
				}, 500);
    		};

            

            $scope.saveClaim = function() {
			accordianFactory.clearAllValidationErrors();
                var reqData = {};
                var authId = '';
				$scope.submittedClicked = true;
				if($scope.showThirdTab == true){
					if($scope.basicLine.serviceStatus == "Edit" || $scope.basicLine.serviceStatus == "Save"){
						listenerFactory.invoke("updateOtherServiceLineInfo");
					}else{
						listenerFactory.invoke("saveOtherServiceLineItem");
					}
				}
                var isValid = $scope.validateSaveClaim();

                if (isValid) {
	                
                    var reqData = $scope.claimInfo;
                    reqData.action = 'SAVE';
					reqData.claimType = $state.params.claimType;
                    
                    var resPromise = claimsService.saveClaim(reqData);
					
					usSpinnerService.spin('spinner-1');
                    resPromise.then(function(response) {
                            if (response) {
								
								usSpinnerService.stop('spinner-1');
								
                                if (response.status === appConfig.SUCCESS_MSG && response.data) {
                                    otherClaimInfoDataService.responseData = angular.copy(response.data);
                                    notificationSrvc.notifySuccess(appConfig.SA_SAVE_SUCCESS);
                                    $scope.mapSrvtoUI(response.data);
                                } else if (response.status === appConfig.FAILURE_MSG && response.error.errorMsgList) {
                                    var errorData = response.error.errorMsgList;
                                    if (errorData && errorData.length > 0) {
                                        notificationSrvc.notifyError(CommonDataService.getParsedError(errorData));
                                    }
                                } else {
                                    notificationSrvc.notifyError([appConfig.CLAIM_ERROR_MSG]);
                                }
                            }

                            return true;
                        },
                        function(response) {
                            
                        });
                }
				$scope.submittedClicked = false;
            };

            
            $scope.submitClaim = function() {
			accordianFactory.clearAllValidationErrors();
                var reqData = {};
                var authId = '';
				$scope.submittedClicked = true;
				
				var summaryModalInstance;
				
				if($scope.showThirdTab == true){
					if($scope.basicLine.serviceStatus == "Edit" || $scope.basicLine.serviceStatus == "Save"){
						listenerFactory.invoke("updateOtherServiceLineInfo");
					}else{
						listenerFactory.invoke("saveOtherServiceLineItem");
					}
				}
                var isValid = $scope.validateSubmitlClaim();
                if (isValid) {
                    $scope.submittedClicked = false;
                    
                    var reqData = $scope.claimInfo;
                    reqData.action = 'SUBMIT';
					reqData.claimType = $state.params.claimType;	
					
                    var resPromise = claimsService.submitClaim(reqData);

					
					
					summaryModalInstance = $modal.open({
                        templateUrl: 'src/claims/common/partials/validateProgress.html',
                        windowClass: 'modal fade modal-popup in',
						backdrop: 'static',
						keyboard: false
                    });	
					
                    resPromise.then(function(response) {
                            if (response) {
                              
								summaryModalInstance.close();
                                if (response.status === appConfig.SUCCESS_MSG && response.data) {

								angular.element('.panel-collapse').parent().removeClass('alert-heading');
								angular.element('.panel-collapse').parent().addClass('check-heading');
                                    otherClaimInfoDataService.responseData = response.data;
                                    CommonDataService.store('summaryScreenDetails', response.data);
										var modalInstance = $modal.open({
											templateUrl: 'src/claims/common/partials/summaryScreen.html',
											controller: 'summaryScreenController',
											resolve:{
												d_dentalattachmenttype:function(CommonDataService){
													return CommonDataService.getReferenceData('dentalattachmenttype');
												},
												d_attachmenttype:function(CommonDataService){
													return CommonDataService.getReferenceData('institutionalattachmenttype');
												},
												d_claimsdeliverymethod:function(CommonDataService){
													return CommonDataService.getReferenceData('claimsdeliverymethod');
												},
												d_attachmentlevel:function(CommonDataService){
													return CommonDataService.getReferenceData('claimsdeliverymethod');
												}                         
											  },
											windowClass: 'modal fade modal-popup in confirmBox',
											backdrop: 'static',
											keyboard: false,
											size: 'lg'
										});
                                    modalInstance.result.then(function() {}, function() {});
                                    setTimeout(function(e) {
                                        $state.go($state.current, {}, {
                                            reload: true
                                        });
                                    }, 500);
                                } else if (response.status === appConfig.FAILURE_MSG && response.error.errorMsgList) {
                                    var errorData = response.error.errorMsgList;
                                    if (errorData && errorData.length > 0) {
                                        notificationSrvc.notifyError(CommonDataService.getParsedError(errorData));
                                    }
                                } else {
                                    notificationSrvc.notifyError([appConfig.CLAIM_ERROR_MSG]);
                                }
                            }
                        },
                        function(response) {
                            
                        });
                }
            };

             
            $scope.validateSubmitlClaim = function() {
                var isValid = true;

                var errorList = [];
               
                $scope.voidReplacementInd = false;
				
				if($scope.claimInfo.basicClaimInfo.voidReplacementIndicator === true){
					errorList = $scope.claimInfo.basicClaimInfo.claimResubmissionInformation.validateClaimResubmissionInfo([]);
					
					$scope.voidReplacementInd = true;
				}
                listenerFactory.invoke("submitClaim");
				
				errorList = errorList.concat(accordianFactory.validateAccordianGroups());
				
                if (errorList.length > 0) {
                    isValid = false;                  
                    notificationSrvc.notifyError(errorList);
                }
				
                return isValid;
            };
			
			
            $scope.validateSaveClaim = function() {
                var isValid = true;

                listenerFactory.invoke("saveClaim");
				
				var errorList = accordianFactory.validateAccordianGroups("saveClaim");
				

                if (errorList.length > 0) {
                    isValid = false;
                                      
                    notificationSrvc.notifyError(errorList);
                }
                return isValid;
            };
            
            $scope.validateSaveOtherService = function() {
                var isValid = true;
                $scope.errorString = [];

                listenerFactory.invoke("saveOtherService");

                if ($scope.errorString.length > 0) {
                    isValid = false;
                    notificationSrvc.notifyError($scope.errorString);
                }
                return isValid;
            };
			
            
			 $scope.remove = function() {
                var modalInstance = $modal.open({
                    templateUrl: 'src/claims/common/partials/delete.html',
                    controller: 'deleteController',
                    size: '',
                    resolve: {
                        message: function() {
                            return appConfig.WARNING_MSG_DELETE_TITLE;
                        }
                    },
                    windowClass: 'alert-popUp warningPopup',
					backdrop: 'static',
					keyboard: false
                });
            };
			
			
            $scope.cancelSearchClaim = function(reset) {
				
				if ($state.params.viewOnly) {
					CommonDataService.store('cancelClaim', true);
					$state.go($state.previous.name);
				}else{
					var modalInstance = $modal.open({
                    templateUrl: 'src/claims/common/partials/cancel.html',
                    controller: 'cancelSearchScreenController',
                    size: '',
                    resolve: {
                        message: function() {
                            return appConfig.WARNING_MSG_LOGOUT_TITLE;
                        }
                    },
                   windowClass: 'alert-popUp warning',
				   backdrop: 'static',
				   keyboard: false
                });  
				}  
            };
			
			$scope.viewSubmittedAttachment = function() {
				var modalInstance = $modal.open({
					templateUrl: 'src/claims/common/partials/attachmentScreen.html',
					controller: 'viewAttachmentController',
					resolve:{
												d_dentalattachmenttype:function(CommonDataService){
													return CommonDataService.getReferenceData('dentalattachmenttype');
												},
												d_attachmenttype:function(CommonDataService){
													return CommonDataService.getReferenceData('institutionalattachmenttype');
												},
												d_claimsdeliverymethod:function(CommonDataService){
													return CommonDataService.getReferenceData('claimsdeliverymethod');
												},
												d_attachmentlevel:function(CommonDataService){
													return CommonDataService.getReferenceData('claimsdeliverymethod');
												}                         
											  },
					windowClass: 'modal fade modal-popup in confirmBox',
					backdrop: 'static',
					scope: $scope,
					keyboard: false,
					size: 'lg'
				});
			}
            
			
            $scope.cancelPopup = function() {
                var modalInstance = $modal.open({
                    templateUrl: 'src/claims/common/partials/cancel.html',
                    controller: 'cancelController',
                    size: '',
                    resolve: {
                        message: function() {
                            return appConfig.WARNING_MSG_LOGOUT_TITLE;
                        }
                    },
                    windowClass: 'alert-popUp warning',
					backdrop: 'static',
					keyboard: false
                });	
            } 
			
			 $scope.collapseAccordian = function(accElement, accId) {
				 if (accElement.is(":visible")) {
					 angular.element('#'+ accId + '.collapse').collapse('hide');
					 angular.element('a[data-target=' + '#'+ accId + ']').toggleClass('collapsed');
				 }
			 }
						 
			
			$scope.resetClaim = function(reset) {
			accordianFactory.clearAllValidationErrors();
                var savedData = angular.copy(otherClaimInfoDataService.responseData);
				var editData = angular.copy($state.params.responseObject);
				if(!$.isEmptyObject(savedData)){
					
					$scope.claimInfo = claimFactory.initClaim(savedData);
					listenerFactory.invoke('init');
				}else if(!$.isEmptyObject(editData)){
						
						$scope.claimInfo = claimFactory.initClaim(editData);
						listenerFactory.invoke('init');
				}else{
					$scope.mapSrvtoUI({});
					$scope.claimInfo.basicClaimInfo.submitterID = commonCacheFactory.getAuthUsername();
					$scope.claimInfo.basicClaimInfo.providerInformation.medicaidProviderId = commonCacheFactory.getProvInfo().providerId;
				}
				
				angular.element('.panel-collapse').parent().removeClass('alert-heading');
					angular.element('.panel-collapse').parent().removeClass('check-heading');
					
					var resetAccordions = [];
					
					if($state.params.claimType === 'professional'){
						resetAccordions = $scope.professionalBasicClaim.concat($scope.professionalOtherClaim).concat($scope.professionalThirdClaim);
					}else if($state.params.claimType === 'dental'){
						resetAccordions = $scope.accordianSetBasic.concat($scope.otherClaimInfoAccordion).concat($scope.otherServiceInfoAccordion);
					}else if($state.params.claimType === 'institutional'){
						resetAccordions = $scope.accordianSetBasic.concat($scope.accordianSetOther).concat($scope.accordianSetThird);
					}
					
					
            };	
			
			
			$scope.resetOtherServiceTab = function() {
				
				var serviceLineSavedData = otherClaimInfoDataService.serviceLineSavedData;
				
				
				if(!$.isEmptyObject(serviceLineSavedData)){
					$scope.otherServiceInformation = claimFactory.initOtherService(angular.copy(serviceLineSavedData));
				}else{
					$scope.otherServiceInformation = claimFactory.initOtherService({});
				}
				
				
				
					
				var resetAccordions = [];
				if($state.params.claimType === 'professional'){
					accordianFactory.clearGroupValidationErrors("ThirdProfGroup");
				}else if($state.params.claimType === 'dental'){
					accordianFactory.clearGroupValidationErrors("ThirdDentGroup");
				}else if($state.params.claimType === 'institutional'){
					accordianFactory.clearGroupValidationErrors("ThirdInstiGroup");
				}
				angular.element('html, body').animate({scrollTop: 0}, 800);	
            };	
			
	        
			
			$scope.errorString = [];
			
            
            CommonDataService.loginSubmitData = commonCacheFactory.getProvInfo();
            if (commonCacheFactory.getAuthUsername()) {
                $scope.claimInfo.basicClaimInfo.submitterID = commonCacheFactory.getAuthUsername();
            }
			
			
			 $scope.validateTCN = function() {
                var isValid = true;
				$scope.invalidVoid = false;
                $scope.errorString = [];
				$scope.claimInfo.basicClaimInfo.claimResubmissionInformation.validateClaimResubmissionInfo($scope.errorString);
					if ($scope.errorString.length > 0) {
						isValid = false;
						$scope.invalidVoid = true;
						notificationSrvc.notifyError($scope.errorString);
					}
                return isValid;
            };
			
			
			$scope.hoverOut = function(){
				var isValidTCN = $scope.validateTCN ();
				if(isValidTCN){
				 var reqData = {};
					reqData.providerID =  commonCacheFactory.getProvInfo().providerId;
					reqData.type = $state.params.claimType.charAt(0).toUpperCase() + $state.params.claimType.substring(1);
					reqData.voidReplacementIndicator  = $scope.claimInfo.basicClaimInfo.voidReplacementIndicator;
					reqData.claimResubmissionInformation = $scope.claimInfo.basicClaimInfo.claimResubmissionInformation;
					var searchPromise = claimsService.getClaimDetailsByUsingTCN(reqData);
                        searchPromise.then(function (response) {
                            if (response) {
                                if (response.status === appConfig.SUCCESS_MSG && response.data) {
                                	var tcnToVoidReplace = $scope.claimInfo.basicClaimInfo.claimResubmissionInformation.tcnToVoidReplace;
                                	var resubmissionTypeCode = $scope.claimInfo.basicClaimInfo.claimResubmissionInformation.resubmissionTypeCode;
									response.data.transactionID = null;
                                    $scope.mapSrvtoUI(response.data);
                                    $scope.claimInfo.basicClaimInfo.claimResubmissionInformation.tcnToVoidReplace = tcnToVoidReplace;
                                	$scope.claimInfo.basicClaimInfo.claimResubmissionInformation.resubmissionTypeCode = resubmissionTypeCode;
                                	$scope.claimInfo.basicClaimInfo.voidReplacementIndicator = true;
                                }
                            }
                        });
				}
			}

            
            if ($scope.checkedOut) {
                setTimeout(function() {
                    $('.cancelProfClaims').attr('readonly', false);
                    $('.cancelProfClaims').attr('disabled', false);
                    $('.otherCancelProfClaims').attr('readonly', false);
                    $('.otherCancelProfClaims').attr('disabled', false);
                }, 500);
            }

	    

			
            $scope.clearOtherServiceCSS = function() {
                $('#CoordinationBenefits1').parent().removeClass('alert-heading');
                $('#CoordinationBenefits1').parent().removeClass('check-heading');

                $('#ClaimProvider1').parent().removeClass('alert-heading');
                $('#ClaimProvider1').parent().removeClass('check-heading');

                $('#ClaimInfo1').parent().removeClass('alert-heading');
                $('#ClaimInfo1').parent().removeClass('check-heading');

                $('#SpecializedServices1').parent().removeClass('alert-heading');
                $('#SpecializedServices1').parent().removeClass('check-heading');
				
				$('#otherSrvcLineInfoView').parent().removeClass('alert-heading');
                $('#otherSrvcLineInfoView').parent().removeClass('check-heading');
				
				$('#otherSrvcLinePrvInfoView').parent().removeClass('alert-heading');
                $('#otherSrvcLinePrvInfoView').parent().removeClass('check-heading');
				
				$('#otherPayerSvcLineInfo1').parent().removeClass('alert-heading');
                $('#otherPayerSvcLineInfo1').parent().removeClass('check-heading');
            };
            
	     
            if ($state.params.flag == true) {
				
				$scope.flag = $state.params.flag ;
	            $scope.pageTitle = $state.params.pageTitle;
				
				var responseObject = $state.params.responseObject;
				otherClaimInfoDataService.responseData = angular.copy(responseObject);
	            $scope.mapSrvtoUI(responseObject);
				
				
				if($state.params.responseObject.processedFlag == true){
					$scope.claimInfo.transactionID = null;
				}
	        }
			
			
			$scope.errorAccordionClose = function(openid,closeid) {
				angular.element(closeid[0]).parent().removeClass("alert-heading");
				angular.element(closeid[0]).parent().addClass("check-heading");
				
				for(var idx = 0; idx < closeid.length; idx++){
					if(angular.element(closeid[idx]).is(":visible")){
						angular.element(closeid[idx]+'.collapse').collapse('hide');
						angular.element('a[data-target='+closeid[idx]+']').toggleClass('collapsed');
					}
				}
				
				if(angular.element(openid).is(":hidden")){
					angular.element(openid+'.collapse').collapse('show');
                    angular.element('a[data-target='+openid+']').toggleClass('collapsed');
				}
            };
			
			 $scope.validateBlank = function(){
				return true;
			  };
			
	            $scope.resetFlags = function(accordian) {
					accordian.clearAll('saveClaim');
            		accordian.clearAll();
	           };
			accordianFactory.clearAllValidationErrors();
        }
    ]);
});
