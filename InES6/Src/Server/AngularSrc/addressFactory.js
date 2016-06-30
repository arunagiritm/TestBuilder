define(['../module'], function(modelModule) {
    'use strict';
    modelModule.factory('addressFactory', function(appConfig, CommonDataService) {

        return {
            addressdetail: function() {

                var thataddressdetail = {
                    contact: {},
                    address: {},
                    name: {}
                };

                thataddressdetail.organisation;
                thataddressdetail.phone;
                thataddressdetail.ext;
                
                thataddressdetail.attention;
                thataddressdetail.contact.contactFirstname;
                thataddressdetail.contact.contactLastname;
                thataddressdetail.contact.contactname;
                thataddressdetail.contact.contactphone;
                thataddressdetail.contact.contactext;
                thataddressdetail.contact.contactfax;
                thataddressdetail.contact.contactemail;
                thataddressdetail.address.addressLine1;
                thataddressdetail.address.addressLine2;
                thataddressdetail.address.city;
                thataddressdetail.address.state;
                thataddressdetail.address.zip;
                thataddressdetail.address.plus4;
                thataddressdetail.address.country;
                thataddressdetail.address.subdivisioncode;
                thataddressdetail.name.orgNameOrLastName;
                thataddressdetail.name.prefix;
                thataddressdetail.name.suffix;
                thataddressdetail.name.firstname;
                thataddressdetail.name.lastname;
                thataddressdetail.name.middlename;
                thataddressdetail.name.mi;

                
                thataddressdetail.setOrganisation = function(organisation) {
                    thataddressdetail.organisation = organisation;
                };
                thataddressdetail.setPhone = function(phone) {
                    thataddressdetail.phone = phone;
                };
                thataddressdetail.setExt = function(ext) {
                    thataddressdetail.ext = ext;
                };
                thataddressdetail.setAttention = function(attention) {
                    thataddressdetail.attention = attention;
                };
                thataddressdetail.setContactFirstname = function(contactFirstname) {
                    thataddressdetail.contact.contactFirstname = contactFirstname;
                };
                thataddressdetail.setContactLastname = function(contactFirstname) {
                    thataddressdetail.contact.contactLastname = contactFirstname;
                };
                thataddressdetail.setContactName = function(contactname) {
                    thataddressdetail.contact.contactname = contactname;
                };
                thataddressdetail.setContactPhone = function(contactphone) {
                    thataddressdetail.contact.contactphone = contactphone;
                };
                thataddressdetail.setContactExt = function(contactext) {
                    thataddressdetail.contact.contactext = contactext;
                };
                thataddressdetail.setContactFax = function(contactfax) {
                    thataddressdetail.contact.contactfax = contactfax;
                };
                thataddressdetail.setContactEmail = function(contactemail) {
                    thataddressdetail.contact.contactemail = contactemail;
                };

                thataddressdetail.setAddressLine1 = function(addressLine1) {
                    thataddressdetail.address.addressLine1 = addressLine1;
                };
                thataddressdetail.setAddressLine2 = function(addressLine2) {
                    thataddressdetail.address.addressLine2 = addressLine2;
                };
                thataddressdetail.setCity = function(city) {
                    thataddressdetail.address.city = city;
                };
                thataddressdetail.setState = function(state) {
                    thataddressdetail.address.state = state;
                };
                thataddressdetail.setZip = function(zip) {
                    thataddressdetail.address.zip = zip;
                };
                thataddressdetail.setPlus4 = function(plus4) {
                    thataddressdetail.address.plus4 = plus4;
                };
                thataddressdetail.setSubDivisionCode = function(subdivisioncode) {
                    thataddressdetail.address.subdivisioncode = subdivisioncode;
                };
                thataddressdetail.setCountry = function(country) {
                    thataddressdetail.address.country = country;
                };
                thataddressdetail.setFirstname = function(firstname) {
                    thataddressdetail.name.firstname = firstname;
                };
                thataddressdetail.setLastname = function(lastname) {
                    thataddressdetail.name.lastname = lastname;
                };
                thataddressdetail.setMiddlename = function(middlename) {
                    thataddressdetail.name.middlename = middlename;
                };
                thataddressdetail.setPrefix = function(prefix) {
                    thataddressdetail.name.prefix = prefix;
                };
                thataddressdetail.setSuffix = function(suffix) {
                    thataddressdetail.name.suffix = suffix;
                };
                thataddressdetail.setMi = function(mi) {
                    thataddressdetail.name.mi = mi;
                };
                thataddressdetail.setOrgNameOrLastName = function(orgNameOrLastName) {
                    thataddressdetail.name.orgNameOrLastName = orgNameOrLastName;
                };


                

                thataddressdetail.getOrganisation = function() {
                    return thataddressdetail.organisation;
                };
                thataddressdetail.getPhone = function() {
                    return thataddressdetail.phone;
                };
                thataddressdetail.getExt = function() {
                    return thataddressdetail.ext;
                };

                thataddressdetail.getAttention = function() {
                    return thataddressdetail.attention;
                };
                thataddressdetail.getContactFirstname = function() {
                    return thataddressdetail.contact.contactFirstname;
                };
                thataddressdetail.getContactLastname = function() {
                    return thataddressdetail.contact.contactLastname;
                };

                thataddressdetail.getContactName = function() {
                    return thataddressdetail.contact.contactname;
                };
                thataddressdetail.getContactPhone = function() {
                    return thataddressdetail.contact.contactphone;
                };
                thataddressdetail.getContactExt = function() {
                    return thataddressdetail.contact.contactext;
                };
                thataddressdetail.getContactFax = function() {
                    return thataddressdetail.contact.contactfax;
                };
                thataddressdetail.getContactEmail = function() {
                    return thataddressdetail.contact.contactemail;
                };

                thataddressdetail.getAddressLine1 = function() {
                    return thataddressdetail.address.addressLine1;
                };
                thataddressdetail.getAddressLine2 = function() {
                    return thataddressdetail.address.addressLine2;
                };
                thataddressdetail.getCity = function() {
                    return thataddressdetail.address.city;
                };
                thataddressdetail.getState = function() {
                    return thataddressdetail.address.state;
                };
                thataddressdetail.getZip = function() {
                    return thataddressdetail.address.zip;
                };
                thataddressdetail.getPlus4 = function() {
                    return thataddressdetail.address.plus4;
                };
                thataddressdetail.getSubDivisionCode = function() {
                    return thataddressdetail.address.subdivisioncode;
                };
                thataddressdetail.getCountry = function() {
                    return thataddressdetail.address.country;
                };
                thataddressdetail.getFirstname = function() {
                    return thataddressdetail.name.firstname;
                };
                thataddressdetail.getLastname = function() {
                    return thataddressdetail.name.lastname;
                };
                thataddressdetail.getMiddlename = function() {
                    return thataddressdetail.name.middlename;
                };
                thataddressdetail.getPrefix = function() {
                    return thataddressdetail.name.prefix;
                };
                thataddressdetail.getSuffix = function() {
                    return thataddressdetail.name.suffix;
                };
                thataddressdetail.getMi = function() {
                    return thataddressdetail.name.mi;
                };
                thataddressdetail.getOrgNameOrLastName = function() {
                    return thataddressdetail.name.orgNameOrLastName;
                };

                
                thataddressdetail.validateZip = function(suffix, errorList) {
                    var zip = thataddressdetail.address.zip;
                    var plus4 = thataddressdetail.address.plus4;

                    if (isNaN(zip)) {
                        errorList.push(appConfig.REQ_UNIT_NUM + suffix);
                    }

                    if (!isNaN(zip) && zip.length !== 5) {
                        errorList.push(appConfig.ZIP_INVALID + suffix);
                    }

                    if (plus4 && (isNaN(plus4))) {
                        errorList.push(appConfig.REQ_UNIT_NUM + suffix);
                    }

                    if (plus4 && plus4.length !== 4 && !isNaN(plus4)) {
                        errorList.push(appConfig.PLUS4_INVALID + suffix);
                    }
                    
                }

                
                thataddressdetail.validateCountry = function(suffix, errorList) {
                    var country = thataddressdetail.address.country;
                    if (country) {
                        country = country.toLowerCase();
                        if ((country != "usa" && country != "can") && !thataddressdetail.address.subdivisioncode) {
                            errorList.push(appConfig.SUB_DIV_REQ + suffix);
                        }
                    }
                }

                
                thataddressdetail.validateAddress = function(suffix, errorList) {

                    var validStatus = true;
                    var list = errorList;

                    if (!thataddressdetail.address.addressLine1) {
                        errorList.push(appConfig.ADD_REQ + suffix);
                    }

                    if (!thataddressdetail.address.city) {
                        errorList.push(appConfig.CITY_REQ + suffix);
                    }

                    if (!thataddressdetail.address.state || !thataddressdetail.address.zip) {

                        errorList.push(appConfig.STATE_ZIP_REQ + suffix);
                    }

                    
                    if (thataddressdetail.address.zip) {
                        thataddressdetail.validateZip(suffix, errorList);
                    }

                    if (thataddressdetail.address.country) {
                        thataddressdetail.validateCountry(suffix, errorList);
                    }

                    if (list != errorList) {
                        validStatus = false;
                    }

                    return validStatus;
                }

                

                
                thataddressdetail.pushMessage = function(msg, errorList) {
                    if (errorString.indexOf(msg) == -1) {
                        errorList.push(msg);
                    }
                }

                
                thataddressdetail.validateContact = function(suffix, errorList) {

                    if (thataddressdetail.contact.contactphone || thataddressdetail.contact.contactext || thataddressdetail.contact.contactfax || thataddressdetail.contact.contactemail) {
                        pushMessage(appConfig.CONT_NAME_REQ + screenName, errorList);
                    }

                    if (thataddressdetail.contact.contactphone && thataddressdetail.contact.contactfax && thataddressdetail.contact.contactemail) {
                        pushMessage(appConfig.PH_FX_EMAIL + screenName, errorList);
                    }

                    if (thataddressdetail.contact.contactext) {
                        pushMessage(appConfig.INS_CONT_PHNO_REQ + screenName, errorList);
                    }

                    var phoneno = thataddressdetail.contact.contactphone;
                    if (phoneno && !CommonDataService.isValidPhoneno(phoneno)) {
                        pushMessage(appConfig.PH_NO_INVALID + screenName, errorList);
                    }

                    var faxno = thataddressdetail.contact.contactfax;
                    if (faxno && !CommonDataService.isValidFax(faxno)) {
                        pushMessage(appConfig.FAX_NO_INVALID + screenName, errorList);
                    }

                    return errorList;
                }
					

                return thataddressdetail;
            }
        };

    });
});
