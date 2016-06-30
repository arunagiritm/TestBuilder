export
default
function fileReadDirective() {

    return {
        scope: {
            fileread: "=",
            filename: "="
        },
        link: function(scope, element, attributes) {
            element.bind("change", function(changeEvent) {
                var reader = new FileReader();
                var fileContent = [];
                var totFiles = changeEvent.target.files.length;

                function readFile(index) {
                    if (index >= totFiles) {
                        return;
                    }
                    reader.onload = function(loadEvent) {

                        fileContent.push(loadEvent.target.result);
                        scope.$apply(function() {
                            scope.fileread = fileContent;
                            scope.filename = scope.filename + changeEvent.target.files[index].name;
                            if (index < totFiles - 1) {
                                scope.filename = scope.filename + ",";
                            }

                        });
                        readFile(index + 1);
                    }
                    reader.readAsText(changeEvent.target.files[index]);
                }
                readFile(0);
            });
        }
    }
}