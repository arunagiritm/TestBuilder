(function() {
    var path = require('path');
    var fs = require('fs');
    var process = require('process');
    var angutil = require("./AngularUtils");
    var deparray = {};
    var callback = function(deparray) {
        console.log(deparray);
    }

    function createTest(args) {
        if (process.argv.length <= 2 && arguments.length < 1) {
            console.log("Enter the filename as argument");
            return;
        }
        if (arguments.length > 0) {
            for (var i = 0; i < arguments.length; i++) {
                process.argv.push(arguments[i]);

            };
            // console.log(process.argv);

        }
        for (var i = 2; i < process.argv.length; i++) {
            //var fname = path.join(__dirname, process.argv[i]);
            var fname = process.argv[i];
            var strExists = "";
            var fcontent = '';
            var fileObj = {};
            if (!fs.existsSync(fname)) {

                strExists = " does not exists";
                console.log(fname + strExists);
                continue;
                //return;
            }
            console.log(fname + strExists);
            fcontent = fs.readFileSync(fname);
            fileObj.filename = process.argv[i];
            fileObj.fileContent = fcontent;
            angutil.getDependencies(fileObj, callback);
        };
        var foldername = path.join(__dirname, "specs");
        var wf = require(path.join(__dirname, "./WriteFactories"));
        wf.CreateZip(foldername, foldername + "/JasmineSpecs.zip");

    }
    if (process.argv.length>2) {
    	createTest();
    };
    module.exports = {
        createTest: createTest
    }

})();