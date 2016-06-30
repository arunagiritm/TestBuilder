import toastr from "toastr";

class TestBuilderController {
    
    constructor($http, $location, commonService, $q) {
       let vm = this;
        vm.genFileShow = false;
        vm.PbarShow = false;
        vm.fileread = "";
        vm.filename = "";
        vm.fileObj = {
            filename: null,
            fileContent: null
        };
        vm.mf = {};
        vm.$http=$http;
        vm.commonService=commonService;
        vm.$q=$q;
        vm.files;
        vm.cntIncr;
        

    }

    readFile() {
        this.filename = "";
        this.fileread = "";
        this.resetProgress();
        $('#fileJson').click();
    }
    resetProgress() {
        this.genFileShow = false;
        this.PbarShow = false;
        $(".progress-bar").css("width", "0%");
    }

    populate() {
        var vmm=this;
        if (this.filename.length == 0) {
            // alert("Please select an Angular source file");
            toastr.info("Please select an Angular source file");
            return;
        }
        this.resetProgress();
        this.files = this.filename.split(",");
        for(var file in this.files){
            if(!this.files[file].match(/\.js$/)){
                toastr.error("only javascript files are allowed");
                return;
            }
        }
        this.cntIncr = 100 / this.files.length;
        var delStatus = false;
        this.PbarShow = true;
        //fileread will contain the content of the file
        if (this.fileread) {
            //Delete the existing folder. This may need change for multiuser
            this.$http.get("/DelFolder").success(function(response) {
                vmm.createSpec(0);
            });
        }
    }

    createSpec(index) {
        var vmm=this;
        //for (file in files) {
        if (index >= this.files.length) {
            this.$http.get("/CreateZip").success(function(response) {
                vmm.genFileShow = true;
                // alert("Test spec(s) created. Click the generated link to download.")
                toastr.success("Test spec(s) created. Click the generated link to download.")
            });
            return;
        }
        var file = index;
        this.fileObj = {
            filename: this.files[file],
            fileContent: this.fileread[file].toString()
        }
        var pbar = (file + 1) * this.cntIncr;
        if (pbar > 100) {
            pbar = 100;
        }
        $(".progress-bar").css("width", pbar.toString() + "%");
        $(".progress-bar").html(pbar.toString() + "%");
        this.commonService.getControllerDetails(this.fileObj)
            .then(function(result) {
                vmm.createSpec(index + 1)
            });

    }

    close() {
        window.top.close();
    }

}

TestBuilderController.$inject=['$http', '$location', 'commonService', '$q'];

export default TestBuilderController;