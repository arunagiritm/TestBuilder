
define(['../module'], function(serviceModule) {
    'use strict';
    serviceModule.factory('claimsInquiryService', ['claimsRestClientFactory',
        '$q',
        'appConfig',
        'logger',


        function(claimsRestClientFactory,
            $q,
            appConfig,
            logger) {


            var searchClaimInquiry = claimsRestClientFactory.getServAuthRestangular();
            var refereceService = claimsRestClientFactory.getEnterpriseCommonRestangular();

            var log = logger.getLogger('claimsInquiryService.js');
            return {

                searchClaimInquiry: function(reqData) {
                    var deferred = $q.defer();

                    
                    searchClaimInquiry.one('claimsadjudication/claims').withHttpConfig({
                        timeout: appConfig.REST_REQ_TIMEOUT
                    }).get({
                            filters: {                            	
            					    'auditUserID': null,
            					    'auditTimeStamp': null,
            					    'addedAuditUserID': null,
            					    'addedAuditTimeStamp': null,
            					    'versionNo': 0,
            					    'dbRecord': false,            					    
            					    'searchfor': 'ALL',
            					    'providerID': (reqData.providerID ? reqData.providerID : null),
            					    'claimsinquiryfilter': {
            					    	 'claimsBillingProvider': {
                                             'billingProviderID': (reqData.claimsBillingProvider.billingProviderID ? reqData.claimsBillingProvider.billingProviderID : null),
                                             'billingPersonalInf': {
                                                 'firstName': (reqData.claimsBillingProvider.billingPersonalInf.firstName ? reqData.claimsBillingProvider.billingPersonalInf.firstName : null),
                                                 'mi': (reqData.claimsBillingProvider.billingPersonalInf.mi ? reqData.claimsBillingProvider.billingPersonalInf.mi : null),
                                                 'lastName': (reqData.claimsBillingProvider.billingPersonalInf.lastName ? reqData.claimsBillingProvider.billingPersonalInf.lastName : null),
                                                 'suffix': (reqData.claimsBillingProvider.billingPersonalInf.suffix ? reqData.claimsBillingProvider.billingPersonalInf.suffix : null),
                                                 'prefix': (reqData.claimsBillingProvider.billingPersonalInf.prefix ? reqData.claimsBillingProvider.billingPersonalInf.prefix : null)
                                             }
                                         },
                                         'claimsInformation': {
                                             'claimStatus': (reqData.claimsInformation.claimStatus ? reqData.claimsInformation.claimStatus : null),
                                             'typeOfBill': (reqData.claimsInformation.typeOfBill ? reqData.claimsInformation.typeOfBill : null),
                                             'tcn': (reqData.claimsInformation.tcn ? reqData.claimsInformation.tcn : null),
                                             'patientAccountNum': (reqData.claimsInformation.patientAccountNum ? reqData.claimsInformation.patientAccountNum : null),
                                             'prescriptionNum': (reqData.claimsInformation.prescriptionNum ? reqData.claimsInformation.prescriptionNum : null),
                                             'totalClaimChargeAmt': (reqData.claimsInformation.totalClaimChargeAmt ? reqData.claimsInformation.totalClaimChargeAmt : null),
                                             'claimServicePeriodBegindate': (reqData.claimsInformation.claimServicePeriodBegindate ? reqData.claimsInformation.claimServicePeriodBegindate : null),
                                             'claimServicePeriodEnddate': (reqData.claimsInformation.claimServicePeriodEnddate ? reqData.claimsInformation.claimServicePeriodEnddate : null)
                                         },

                                         'memberInformation': {
                                             'dob': (reqData.memberInformation.dob ? reqData.memberInformation.dob : null),
                                             'memberID': (reqData.memberInformation.memberID ? reqData.memberInformation.memberID : null),
                                             'claimsPersonalInf': {
                                                 'firstName': (reqData.memberInformation.claimsPersonalInf.firstName ? reqData.memberInformation.claimsPersonalInf.firstName : null),
                                                 'mi': (reqData.memberInformation.claimsPersonalInf.mi ? reqData.memberInformation.claimsPersonalInf.mi : null),
                                                 'lastName': (reqData.memberInformation.claimsPersonalInf.lastName ? reqData.memberInformation.claimsPersonalInf.lastName : null),
                                                 'suffix': (reqData.memberInformation.claimsPersonalInf.suffix ? reqData.memberInformation.claimsPersonalInf.suffix : null),
                                                 'prefix': (reqData.memberInformation.claimsPersonalInf.prefix ? reqData.memberInformation.claimsPersonalInf.prefix : null)
                                             },
                                             'gender': (reqData.memberInformation.gender ? reqData.memberInformation.gender : null)
                                         },
                                         'serviceLineInformation': {
                                             'procedureQualifierCode': (reqData.serviceLineInformation.procedureQualifierCode ? reqData.serviceLineInformation.procedureQualifierCode : null),
                                             'procedureCode': (reqData.serviceLineInformation.procedureCode ? reqData.serviceLineInformation.procedureCode : null),
                                             'claimsInquiryModifiers': {
                                                 'modifierOne': (reqData.serviceLineInformation.claimsInquiryModifiers.modifierOne ? reqData.serviceLineInformation.claimsInquiryModifiers.modifierOne : null),
                                                 'modifierTwo': (reqData.serviceLineInformation.claimsInquiryModifiers.modifierTwo ? reqData.serviceLineInformation.claimsInquiryModifiers.modifierTwo : null),
                                                 'modifierThree': (reqData.serviceLineInformation.claimsInquiryModifiers.modifierThree ? reqData.serviceLineInformation.claimsInquiryModifiers.modifierThree : null),
                                                 'modifierFour': (reqData.serviceLineInformation.claimsInquiryModifiers.modifierFour ? reqData.serviceLineInformation.claimsInquiryModifiers.modifierFour : null),
                                                 'lineItemChargeAmt': (reqData.serviceLineInformation.claimsInquiryModifiers.lineItemChargeAmt ? reqData.serviceLineInformation.claimsInquiryModifiers.lineItemChargeAmt : null),
                                                 'revenueCode': (reqData.serviceLineInformation.claimsInquiryModifiers.revenueCode ? reqData.serviceLineInformation.claimsInquiryModifiers.revenueCode : null),
                                                 'serviceUnits': (reqData.serviceLineInformation.claimsInquiryModifiers.serviceUnits ? reqData.serviceLineInformation.claimsInquiryModifiers.serviceUnits : null),
                                                 'lineItemCtrlNum': (reqData.serviceLineInformation.claimsInquiryModifiers.lineItemCtrlNum ? reqData.serviceLineInformation.claimsInquiryModifiers.lineItemCtrlNum : null),
                                                 'servicelineFromDate': (reqData.serviceLineInformation.claimsInquiryModifiers.servicelineFromDate ? reqData.serviceLineInformation.claimsInquiryModifiers.servicelineFromDate : null),
                                                 'servicelineToDate': (reqData.serviceLineInformation.claimsInquiryModifiers.servicelineToDate ? reqData.serviceLineInformation.claimsInquiryModifiers.servicelineToDate : null)
                                             }
                                         }					    	
            					    },
            					    'processedclaimsearchrequest':null,
            					    'savedClaimSearchRequest':null,
            					    'searchSubmittedClaimsFilter': null          					
                            }
                        }
                    ).then(
                        function(resp) {
                            deferred.resolve(resp);
                        },
                        function(resp) {
                            deferred.reject({
                                status: resp.status
                            });
                        });
                    return deferred.promise;
                },

                

                getClaimDetails: function(reqData) {
                    var deferred = $q.defer();					
                    searchClaimInquiry.one('claimsadjudication/claim/'+reqData.claimInquiryStatusReqRespResult.tcnNumber).withHttpConfig({
                        timeout: appConfig.REST_REQ_TIMEOUT
                    }).get({
                    	filters:{
                    		'claimInquiryStatusReqRespResult':(reqData.claimInquiryStatusReqRespResult!="")?reqData.claimInquiryStatusReqRespResult:null,
                    		'serviceLineInformation' : (reqData.serviceLineInformation!="")?reqData.serviceLineInformation:null
                    	}
                }).then(
                        function(resp) {
                            deferred.resolve(resp);
                        },
                        function(resp) {
                            deferred.reject({
                                status: resp.status
                            });
                        });

                    return deferred.promise;
                }

            };
        }

    ]);
});