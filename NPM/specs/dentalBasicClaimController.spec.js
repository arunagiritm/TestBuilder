define(['jQuery', 'angular', 'angular-mock'], function($) {

            //Declare all global variables here
            var dentalBasicClaimController, scope,
                $scope,
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
                accordianFactory, ;

            // Read mock data from external file uncomment this to read mock data from json file

            // $.get('base/test/unit/claims/dental/JSON/dentalBasicClaim.json',function(data){
            // 	var mockData=JSON.parse(data.toString());
            // });

            //Any other mock objects/ functions that is required can be intialized here
            // require("generalFunctions");

            //Main describe here
            describe('dentalBasicClaimController', function() {

                //beforeEach function.  create and intialize module, controllers and services here
                beforeEach(function() {
                    spyOn(angular, 'element').and.callFake(mockData.angularFaked);
                    module(he);
                    inject(function($rootScope, $controller, _notificationSrvc_, _appConfig_, _CommonDataService_, _otherClaimInfoDataService_, _dentalBasicClaimFactory_, _claimInfoFactory_, _listenerFactory_, _appUtil_, _accordianFactory_) {
                        scope = $rootScope.$new();
                        notificationSrvc = _notificationSrvc_;
                        appConfig = _appConfig_;
                        CommonDataService = _CommonDataService_;
                        otherClaimInfoDataService = _otherClaimInfoDataService_;
                        dentalBasicClaimFactory = _dentalBasicClaimFactory_;
                        claimInfoFactory = _claimInfoFactory_;
                        listenerFactory = _listenerFactory_;
                        appUtil = _appUtil_;
                        accordianFactory = _accordianFactory_;
                        dentalBasicClaimController = $controller('dentalBasicClaimController', {
                            $scope: scope
                            d_relatedcause: mockdata.EmptyString;
                            d_state: mockdata.EmptyString;
                            d_dentalplaceofservice: mockdata.EmptyString;
                            d_benefitsassignmentcertification: mockdata.EmptyString;
                            d_dentalassignment: mockdata.EmptyString;
                            d_releaseofinformationcode: mockdata.EmptyString;
                            d_delayreasoncode: mockdata.EmptyString;
                            d_dentalsplpgmtypecode: mockdata.EmptyString;
                            d_serviceauthorizationexception: mockdata.EmptyString;
                            d_dentalattachmenttype: mockdata.EmptyString;
                            d_claimsdeliverymethod: mockdata.EmptyString;;


                        });
                    });

                    afterEach(function() {

                    });

                    //create additional describes if needed

                    //create your it and expect statements here
                    it('should instantiate dentalBasicClaimController', function() {
                        expect(dentalBasicClaimController).toBeDefined();
                        expect(scope).toBeDefined();
                    });

                    it('should call scope.init ', function() {
                        //Invoke the method call
                        scope.init();
                        //modify your expect statement to match your logic
                        expect(scope.init).toBeTrue()
                    });

                    it('should call scope.initAttachment ', function() {
                        //Invoke the method call
                        scope.initAttachment(mockData.actionType);
                        //modify your expect statement to match your logic
                        expect(scope.initAttachment).toBeTrue()
                    });

                    it('should call scope.saveAttachments ', function() {
                        //Invoke the method call
                        scope.saveAttachments();
                        //modify your expect statement to match your logic
                        expect(scope.saveAttachments).toBeTrue()
                    });

                    it('should call scope.editAttachment ', function() {
                        //Invoke the method call
                        scope.editAttachment(mockData.attachmentObj);
                        //modify your expect statement to match your logic
                        expect(scope.editAttachment).toBeTrue()
                    });

                    it('should call scope.updateAttachment ', function() {
                        //Invoke the method call
                        scope.updateAttachment(mockData.attachEditableIdx);
                        //modify your expect statement to match your logic
                        expect(scope.updateAttachment).toBeTrue()
                    });

                    it('should call scope.deleteAttachment ', function() {
                        //Invoke the method call
                        scope.deleteAttachment(mockData.attachmentObj);
                        //modify your expect statement to match your logic
                        expect(scope.deleteAttachment).toBeTrue()
                    });

                    it('should call scope.validateAttachment ', function() {
                        //Invoke the method call
                        scope.validateAttachment();
                        //modify your expect statement to match your logic
                        expect(scope.validateAttachment).toBeTrue()
                    });

                    it('should call scope.validate ', function() {
                        //Invoke the method call
                        scope.validate();
                        //modify your expect statement to match your logic
                        expect(scope.validate).toBeTrue()
                    });

                    it('should call scope.validateSave', function() {
                        //Invoke the method call
                        scope.validateSave();
                        //modify your expect statement to match your logic
                        expect(scope.validateSave).toBeTrue()
                    });

                    it('should call scope.continueBasicClaimInformation ', function() {
                        //Invoke the method call
                        scope.continueBasicClaimInformation();
                        //modify your expect statement to match your logic
                        expect(scope.continueBasicClaimInformation).toBeTrue()
                    });

                    it('should call scope.intialiseBasicClaimInformation ', function() {
                        //Invoke the method call
                        scope.intialiseBasicClaimInformation();
                        //modify your expect statement to match your logic
                        expect(scope.intialiseBasicClaimInformation).toBeTrue()
                    });

                    it('should call scope.validateTemplate ', function() {
                        //Invoke the method call
                        scope.validateTemplate();
                        //modify your expect statement to match your logic
                        expect(scope.validateTemplate).toBeTrue()
                    });




                });


            });