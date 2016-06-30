var fs = require('fs');
var path = require('path');
var beautify = require('js-beautify').js_beautify;
require('./string.extensions.js');
var wf = require('./writefactories');
var depArray;
var depfuncontent;
var depType;
var directiveName;
global.define = function(filename, callback) {
    depType = "";
    callback(mycontroller);
}

global.mycontroller = {

    controller: function(ctrlName, inputArray) {
        var scope = {};
        if (depType == "") {
            depType = "controller";
        }
        if (typeof inputArray != 'undefined') {

            if (typeof inputArray == 'function') {
                depfuncontent = inputArray;
                depArray = null;
            } else {
                //Last parameter is the function content
                depfuncontent = inputArray[inputArray.length - 1];
                //reduce the length by 1 to remove the last function parameter
                inputArray.length = inputArray.length - 1;
                depArray = inputArray;
            }
        }
    },
    factory: function(ctrlName, inputArray) {
        depType = "factory";
        if (ctrlName.match(/service/gi)) {
            depType = "service";
        }
        mycontroller.controller(ctrlName, inputArray);
    },
    service: function(ctrlName, inputArray) {
        depType = "service";
        mycontroller.controller(ctrlName, inputArray);
    },
    provider: function(ctrlName, inputArray) {
        depType = "provider";
        mycontroller.controller(ctrlName, inputArray);
    },
    directive: function(ctrlName, inputArray) {
        depType = "directive";
        directiveName = ctrlName;
        mycontroller.controller(ctrlName, inputArray);
    },
    config: function(ctrlName, inputArray) {
        mycontroller.controller(ctrlName, inputArray);
    }
}

var getDependencies = function(funObject, callback) {

    var dtStamp = new Date().getTime().toString();
    var foldername = path.join(__dirname, "/specs");
    dtStamp = "";
    //Add datetimestamp to invalidate cache
    var fname = path.join(foldername, funObject.filename).replace(".js", dtStamp + ".js");

    fs.writeFileSync(fname, funObject.fileContent);
    depArray = "";
    depfuncontent = "";
    //require will call for a method define which in turn 
    //will call mycontroller to return the dependencies
    if (require.resolve(fname)) {
        delete require.cache[require.resolve(fname)];
    }
    var fcontent = require(fname);
    //wait for the file to be read
    var depMethods = getallFunctions(depfuncontent);
    var dirObject = getDirectiveObject(depfuncontent, directiveName)
    createTestSpec(fname.replace(dtStamp, ""), depArray, depMethods, dirObject);
    //return depArray;
    callback(depArray); //callback once completed
}

var getDirectiveObject = function(fcontent, directiveName) {
    var sMatch;
    var dirObject = {},
        directiveScope = null,
        directiveRequire = null,
        directiveReplace = null,
        directiveTransclude = null;

    //directiveName = fcontent.toString().match(/directive\(.*,/);
    directiveScope = fcontent.toString().match(/scope\s*:\s*(.(\r|\n)*)*?}/);
    directiveRequire = fcontent.toString().match(/require\s*:\s*.*,/);
    directiveTransclude = fcontent.toString().match(/transclude\s*:\s*.*,/);
    directiveReplace = fcontent.toString().match(/replace\s*:\s*.*,/);

    if (null != directiveName) {
        directiveName = directiveName.replace(/\/\*(.(\n)*)*\*\//g, "").replace(/\/\/.*/g, "");
        directiveName = directiveName.replace(/(directive|\(|:|\s|'|"|,|\[|\])/g, "");
        dirObject.directiveName = directiveName.replace(/([A-Z])/g, function(capLetter) {
            return "-" + capLetter.toLowerCase();
        })
    }
    if (null != directiveScope) {
        //will build a key value pair eg.,({fileread:"=",filescope:"@",onChange:"&"})
        var dscopeObj = {};
        var dscopeArr;
        //remove remarks
        directiveScope = directiveScope[0].replace(/\/\*(.(\n)*)*\*\//g, "").replace(/\/\/.*/g, "");
        directiveScope = directiveScope.replace(/(scope:|\s|\{|\}|'|")/g, "").split(",");
        for (ls in directiveScope) {
            dscopeArr = directiveScope[ls].split(":");
            if (dscopeArr.length >= 0) {
                dscopeObj[dscopeArr[0]] = dscopeArr[1];
            }
        }
        dirObject.directiveScope = dscopeObj;
    }
    if (null != directiveRequire) {
        //will return an array of require object. eg.,(ngModel,form)
        directiveRequire = directiveRequire[0].replace(/\/\*(.(\n)*)*\*\//g, "").replace(/\/\/.*/g, "");
        dirObject.directiveRequire = directiveRequire.replace(/(require:|\s|'|"|\[|\])/g, "").split(",");
    }
    if (null != directiveTransclude) {
        //will return a string "true"
        directiveTransclude = directiveTransclude[0].replace(/\/\*(.(\n)*)*\*\//g, "").replace(/\/\/.*/g, "");
        dirObject.directiveTransclude = directiveTransclude.replace(/(transclude:|\s|'|"|,|\[|\])/g, "");
    }
    if (null != directiveReplace) {
        //will return a string "true"
        directiveReplace = directiveReplace[0].replace(/\/\*(.(\n)*)*\*\//g, "").replace(/\/\/.*/g, "");
        dirObject.directiveReplace = directiveReplace.replace(/(replace:|\s|'|"|,|\[|\])/g, "");
    }

    return dirObject;

}
var buildDirectiveItStaments = function(dirObject) {
    //call builDirectiveScope to build isolated scope its of a directive
    var scopeTemplate = fs.readFileSync('./server/template/scopeItsTemplate.js').toString();
    var scopeIts = "";
    scopeIts = scopeIts.AppendLine(buildDirectiveScopeIts(dirObject, scopeTemplate));
    scopeIts = scopeIts.AppendLine(buildDirectiveReplaceIts(dirObject, scopeTemplate));
    scopeIts = scopeIts.AppendLine(buildDirectiveRequireIts(dirObject, scopeTemplate));
    scopeIts = scopeIts.AppendLine(buildDirectiveTranscludeIts(dirObject, scopeTemplate));
    return scopeIts;
}
var buildDirectiveRequireIts = function(dirObject, scopeTemplate) {
    var requireCode = scopeTemplate.match(/\/\/require(.(\r|\n)*)*?End/)[0].replace(/\/\/.*/g, "");;
    var dirRequireIts = "";
    for (drequire in dirObject.directiveRequire) {
        dirRequireIts = dirRequireIts.AppendLine(requireCode.replace(/{directiveName}/g, dirObject.directiveName));
        dirRequireIts = dirRequireIts.AppendLine(requireCode.replace(/{requireScope}/g, drequire));
    }

    return dirRequireIts;
}
var buildDirectiveTranscludeIts = function(dirObject, scopeTemplate) {
    var transcludeCode = scopeTemplate.match(/\/\/transclude(.(\r|\n)*)*?End/)[0].replace(/\/\/.*/g, "");
    var dirTranscludeIts = "";
    if (dirObject.directiveTransclude && dirObject.directiveTransclude.toUpperCase() == "TRUE") {
        dirTranscludeIts = dirTranscludeIts.AppendLine(transcludeCode.replace(/{directiveName}/g, dirObject.directiveName));
    }
    return dirTranscludeIts;
}

var buildDirectiveReplaceIts = function(dirObject, scopeTemplate) {
    var replaceCode = scopeTemplate.match(/\/\/replace(.(\r|\n)*)*?End/)[0].replace(/\/\/.*/g, "");;
    var dirReplaceIts = "";
    if (dirObject.directiveReplace && dirObject.directiveReplace.toUpperCase() == "TRUE") {
        dirReplaceIts = dirReplaceIts.AppendLine(replaceCode.replace(/{directiveName}/g, dirObject.directiveName));
    }
    return dirReplaceIts;
}

var buildDirectiveScopeIts = function(dirObject, scopeTemplate) {

    var twowayCode = scopeTemplate.match(/\/\/two(.(\r|\n)*)*?End/)[0].replace(/\/\/.*/g, "");;
    var onewayCode = scopeTemplate.match(/\/\/one(.(\r|\n)*)*?End/)[0].replace(/\/\/.*/g, "");;
    var funCode = scopeTemplate.match(/\/\/function(.(\r|\n)*)*?End/)[0].replace(/\/\/.*/g, "");;
    var dirScopeIts = "";
    if (dirObject.directiveScope) {
        for (dscope in dirObject.directiveScope) {
            if (dirObject.directiveScope[dscope] == "=") {
                //two way binding
                dirScopeIts = dirScopeIts.AppendLine(twowayCode.replace(/{twoway}/g, dscope));
            } else if (dscope == "@") {
                //one way binding
                dirScopeIts = dirScopeIts.AppendLine(onewayCode.replace(/{oneway}/g, dscope));
            } else if (dscope == "&") {
                //method
                dirScopeIts = dirScopeIts.AppendLine(funCode.replace(/{functionScope}/g, dscope));
            }
        }


    }
    return dirScopeIts;
}
var buildServiceMock = function() {
    var scopeTemplate = fs.readFileSync('../server/template/scopeItsTemplate.js').toString();
    var scopeIts = "";
    var serMock = scopeTemplate.match(/\/\/httpMockMethod(.(\r|\n)*)*?End/)[0].replace(/\/\/.*/g, "");
    scopeIts=scopeIts.AppendLine(serMock);
    return scopeIts;
}

var buildServiceIts = function() {
    var scopeTemplate = fs.readFileSync('../server/template/scopeItsTemplate.js').toString();
    var scopeIts = "";
    var serviceIts=scopeTemplate.match(/\/\/ServiceIt(.(\r|\n)*)*?End/)[0].replace(/\/\/.*/g, "");
    return serviceIts;
}
var getallFunctions = function(fcontent) {
    //get the content of the file and do a regex search
    //for scope object and constructor functions
    var fcontentString = fcontent.toString();
    // var scopeRegStr = "\\$scope.*function\\s*\\(.*\\)";
    var scopeRegStr = "([\\w.]+)\\s*(=|:)\\sfunction\\s*\\(.*\\)";
    var scopeRegex = new RegExp(scopeRegStr, "gi");
    var vmRegex = /\w+\s*=\s*this\s*;/gi;
    var depMethods = {};
    var functionName;
    var functionContent;
    var funStr;
    var funLoc;
    var vmStr = "";

    //console.log(fcontent);
    //check whether controller as syntax is used to assign this to local variable
    var vmMatch = fcontentString.match(vmRegex);
    if (vmMatch) {
        var vmStr = vmMatch[0].trim();
        vmStr = vmStr.substring(0, vmStr.indexOf("="));
        // scopeRegStr = scopeRegStr.replace("\\$scope", vmStr);
        // scopeRegex = new RegExp(scopeRegStr, "gi");
    }
    var scopeMethods = fcontentString.match(scopeRegex);
    if (scopeMethods != null && scopeMethods.length > 0) {

        for (sm in scopeMethods) {
            funStr = scopeMethods[sm].trim().replace("$scope", "scope");
            if (vmStr.length > 0) { //controller as is being used then replace the $scope equivalent also
                funStr = scopeMethods[sm].trim().replace(vmStr, "scope");
            }
            funLoc = funStr.indexOf("=");
            if (funLoc < 0) {
                funLoc = funStr.indexOf(":");
            }
            functionName = funStr.substring(0, funLoc);
            functionContent = funStr.substring(funLoc + 1);
            depMethods[functionName] = getFunctionArguments(functionContent);
        }
        return depMethods;
    }

    return null;

}
var getFunctionArguments = function(func) {
    // First match everything inside the function argument parens.
    if (typeof func == 'function') {
        var args = func.toString().match(/function\s.*?\(([^)]*)\)/);
    } else {
        var startloc, endLoc;
        startloc = func.indexOf("(");
        var args = func.substring(startloc + 1);
        endLoc = args.lastIndexOf(")");
        args = args.substring(0, endLoc);
    }


    // Split the arguments string into an array comma delimited.
    return args.split(',').map(function(arg) {
        // Ensure no inline comments are parsed and trim the whitespace.
        return arg.replace(/\/\*.*\*\//, '').trim();
    }).filter(function(arg) {
        // Ensure no undefined values are added.
        return arg;
    });

}
var createTestSpec = function(filename, depArray, depMethods, dirObject) {
    var tplFile = fs.readFileSync('../server/template/jasmineTemplate.js');
    var depStr;
    //Define all template replace variable and intialize
    var globalvariables = "",
        maindescribe = "",
        modulename = "",
        depFunctions = "",
        depFunctionsIntialize = "",
        depControllerIntialize = "",
        itStatements = "",
        fname = path.basename(filename, path.extname(filename)),
        destName = filename.replace("AngularSrc", "specs").replace(".js", ".spec.js"),
        thatRegex = /that.+\./gi,
        httpBackend = (fname.match(/service/gi)) ? "$httpBackend.whenGET(/.*(.json|.html)/gi).respond(200, {})" : "",
        afterEach = "",
        directive = "",
        dirName = "";


    globalvariables = "var " + fname + ",";
    maindescribe = fname.replace("//", "#");
    modulename = "he";
    depFunctions = "";
    if (httpBackend.length > 0) {
        afterEach = afterEach.AppendLine("$httpBackend.verifyNoOutstandingExpectation();");
        afterEach = afterEach.AppendLine("$httpBackend.verifyNoOutstandingRequest();");
    }
    //Add $controller service if the angular service is of controller type
    if (depType == "controller") {
        depFunctions = depFunctions.append("$rootScope,$controller,");
        depFunctionsIntialize = "".AppendLine("scope = $rootScope.$new();");
        depControllerIntialize = fname + "= $controller('" + fname + "', {";
        globalvariables = globalvariables.AppendLine("scope,");
    } else if (depType == "service") {
        depFunctions = depFunctions.append("$rootScope,_$httpBackend_,");
        depFunctionsIntialize = "".AppendLine("scope = $rootScope.$new();");
        depFunctionsIntialize = depFunctionsIntialize.AppendLine("$httpBackend = _$httpBackend_;");
        globalvariables = globalvariables.AppendLine(buildServiceMock());
        globalvariables = "var " + fname + ","; //overwrite as we want the mock method above variable declaration
        globalvariables = globalvariables.AppendLine("scope,");
        globalvariables = globalvariables.AppendLine("$httpBackend,");
        
    } else if (depType == "directive") {
        depFunctions = depFunctions.append("$rootScope,$compile,");
        depFunctionsIntialize = depFunctionsIntialize.AppendLine("scope = $rootScope.$new();");
        depFunctionsIntialize = depFunctionsIntialize.AppendLine("compile = $compile;");
        depFunctionsIntialize = depFunctionsIntialize.AppendLine(fname + "= getCompiledElement();");
        depFunctionsIntialize = depFunctionsIntialize.AppendLine("directiveElem = getCompiledElement();");
        depFunctionsIntialize = depFunctionsIntialize.AppendLine("function getCompiledElement() {");
        depFunctionsIntialize = depFunctionsIntialize.AppendLine("var template=angular.element('<div'" + dirObject.directiveName + "'> </div>');");
        depFunctionsIntialize = depFunctionsIntialize.AppendLine(" var element = angular.element(template);");
        depFunctionsIntialize = depFunctionsIntialize.AppendLine("var compiledElement = compile(element)(scope);");
        depFunctionsIntialize = depFunctionsIntialize.AppendLine("scope.$digest();");
        depFunctionsIntialize = depFunctionsIntialize.AppendLine("return compiledElement");
        depFunctionsIntialize = depFunctionsIntialize.AppendLine("}");
        globalvariables = globalvariables.AppendLine("scope,");
        globalvariables = globalvariables.AppendLine("compile,");

    } else {
        depFunctions = depFunctions.append("_" + fname + "_,");
        depControllerIntialize = fname + "= _" + fname + "_;";
    }

    //Loop through the dependecy array injected functions
    if (depArray != null) {
        for (deparr in depArray) {
            depStr = depArray[deparr].toString()
            globalvariables = globalvariables.AppendLine(depStr + ",");

            //If the dependcy starts with d then it is resolved in the route. 
            //No actual service exists for this, so skip those services
            if (!depStr.startsWith("d_") && !depStr.startsWith("$scope")) {
                depFunctions = depFunctions.append(((depStr == "$scope") ? "" : "_" + depStr) + "_,");
                depFunctionsIntialize = depFunctionsIntialize.AppendLine(depStr + " = _" + depStr + "_;")
            }
            //If angular service is of controller type dependency starts with d
            //Intialize with mock data 
            if (depType == "controller") {
                if (depStr.startsWith("d_") || depStr.startsWith("$scope"))
                    depControllerIntialize = depControllerIntialize.AppendLine(depStr + ":" + ((depStr == "$scope") ? "scope" : "mockdata.EmptyString;"));
            }

        }
    }
    globalvariables = globalvariables.trim().endsWithRemove(",").append(";");
    depFunctions = depFunctions.trim().endsWithRemove(",");



    depFunctionsIntialize = depFunctionsIntialize + depControllerIntialize + ";";
    itStatements = itStatements.AppendLine("it('should instantiate " + fname + "', function(){");
    itStatements = itStatements.AppendLine("expect(" + fname + ").toBeDefined();");

    if (depType == "controller") {
        itStatements = itStatements.AppendLine("expect(scope).toBeDefined();");
        itStatements = itStatements.AppendLine("});");
    } else if (depType == "directive") {
        //Build it statements for directives

        itStatements = itStatements.AppendLine("});");
        itStatements = itStatements.AppendLine(buildDirectiveItStaments(dirObject));
    } else {
        itStatements = itStatements.AppendLine("});");
    }
    if (depType != directive) {
        if (depMethods != null) {
            var serviceIts=buildServiceIts();
            //Loop through all the methods defined in angular services
            //and create jasmine it statements for them
            for (depmthd in depMethods) {
                itStatements = itStatements.AppendLine("");
                if (depType == "service") {
                   itStatements=itStatements.AppendLine(serviceIts.replace(/{serviceMethod}/g, depmthd));
                } else {
                    itStatements = itStatements.AppendLine("it('should call " + depmthd + "', function(){");
                    //itStatements.AppendLine(""+depMethods[depmthd]+ "= mockdata."+ depmthd +");" );
                    var tmpmethod = (depmthd.match(/\./)) ? depmthd : fname + "." + depmthd;
                    itStatements = itStatements.AppendLine("//Invoke the method call");
                    itStatements = itStatements.AppendLine((tmpmethod.replace(thatRegex, fname + ".") + "( " + replaceInArray(depMethods[depmthd], "mockData.") + ");"));
                    itStatements = itStatements.AppendLine("//modify your expect statement to match your logic");
                    itStatements = itStatements.AppendLine("expect(" + tmpmethod.replace(thatRegex, fname + ".") + ").toBeTrue()");
                    itStatements = itStatements.AppendLine("});");
                }

            }
        }
    }

    //Read the template file and do the replacements
    tplFile = tplFile.toString();
    tplFile = tplFile.replace("{globalvariables}", globalvariables);
    tplFile = tplFile.replace("{maindescribe}", maindescribe);
    tplFile = tplFile.replace("{modulename}", modulename);
    tplFile = tplFile.replace("{depFunctions}", depFunctions);
    tplFile = tplFile.replace("{depFunctionsIntialize}", depFunctionsIntialize);
    tplFile = tplFile.replace("{itStatements}", itStatements);
    tplFile = tplFile.replace("{afterEach}", afterEach);
    tplFile = tplFile.replace("{httpBackend}", httpBackend);
    tplFile = tplFile.replace("{directive}", directive);
    //console.log(tplFile);
    //beautify the template file and save it
    tplFile = beautify(tplFile);
    fs.writeFileSync(destName, tplFile);
    //wf.CreateZip(foldername,fname);
    return;

}
var replaceInArray = function(arrayObj, item) {
    var newArray = arrayObj.slice();
    for (aobj in newArray) {
        newArray[aobj] = item + newArray[aobj];
    }
    return newArray.join(",");
}

module.exports = {
    getDependencies: getDependencies
}