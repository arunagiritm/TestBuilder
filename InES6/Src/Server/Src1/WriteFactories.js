var fs = require('fs');
var path=require('path');
var foldername =path.join(__dirname,"../Specs");
var WriteToFile=function (fname,tplFile){
    if (!fs.existsSync(foldername)){
    fs.mkdirSync(foldername);
    }
    //console.log("foldername :" +foldername);
    var fname= foldername+"/" +fname+'.spec.js';
    //console.log("filename "+fname);
    fs.writeFileSync(fname,tplFile);
    
}
var DelFolder=function(path){
  if( fs.existsSync(path) ) {
    fs.readdirSync(path).forEach(function(file,index){
      var curPath = path + "/" + file;
        fs.unlinkSync(curPath);
//      if(fs.lstatSync(curPath).isDirectory()) { // recurse
//        DelFolder(curPath);
//      } else { // delete file
//        //console.log("Deleting file "+curPath);
//        fs.unlinkSync(curPath);
//      }
    });
    //fs.rmdirSync(path);
  }
};

var CreateZip=function(fldname,outputfilename){
    var fs=require('fs');
    var EasyZip = require('easy-zip').EasyZip;
    var zip=new EasyZip();
    var pubFolder=path.join(__dirname,"../../../public");
    var zipFile=pubFolder+'/'+path.basename(outputfilename);
    console.log("zipping folder "+fldname);
    zip.zipFolder(fldname,function(){
	zip.writeToFile(zipFile);
    console.log("public folder ",pubFolder);
    console.log("zip file name ",path.basename(outputfilename));
    // fs.createReadStream(outputfilename).pipe(fs.createWriteStream(zipFile));
    console.log("zip file Created" +outputfilename+ " Successfully");
});
}
module.exports={
    WriteToFile:WriteToFile,
    CreateZip:CreateZip,
    DelFolder:DelFolder
}