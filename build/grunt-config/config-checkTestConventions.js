/*
 * Copyright 2012 Amadeus s.a.s.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Configuration for at-diff to check test files.
 * @param {Object} grunt
 */
module.exports = function (grunt) {
    var jsonFilePath = "test/target/jsfiles.json";

    var knownSimpleTestCases = [
        // those are tests which are known to be test cases but cannot be detected automatically:
        "aria/jsunit/TestCase.js", // the root test case
        "test/aria/core/prototypefn/PrototypeFnTestCase.js" // has its prototype defined as a function
    ];
    var knownJawsTestCases = [
        // those are tests which are known to be Jaws test cases but cannot be detected automatically:
        "aria/jsunit/JawsTestCase.js" // the root Jaws test case
    ];
    var knownRobotTestCases = [
        // those are tests which are known to be robot test cases but cannot be detected automatically:
        "aria/jsunit/RobotTestCase.js", // the root robot test case
        "test/EnhancedRobotBase.js", // has its prototype defined outside of Aria.classDefinition (in a variable)
        "test/EnhancedRobotTestCase.js" // has its prototype defined outside of Aria.classDefinition (in a variable)
    ];

    grunt.config.set('at-diff-parse.test', {
        options: {
            jsonOutput: jsonFilePath
        },
        files: [
            {src: ["aria/**"], cwd: "src", filter: 'isFile'},
            {src: ["test/**", "!test/target/**", "!test/nodeTestResources/**"], cwd: "", filter: 'isFile'}
        ]
    });

    function toClassPath(logicalPath) {
        return logicalPath.replace(/\..*$/, "").replace(/\//g, ".");
    }

    function toClassName(classPath) {
        return classPath.split(".").pop();
    }

    grunt.registerTask('check-test-conventions-postprocess', function () {
        var files = JSON.parse(grunt.file.read(jsonFilePath)).files;
        var processedMap = Object.create(null);

        function processFile(fileName) {
            fileName = fileName.replace(/^ariatemplates\//, "aria/");
            var response = processedMap[fileName];
            if (!response) {
                var classPath = toClassPath(fileName);
                processedMap[fileName] = response = {
                    fileName: fileName,
                    classPath: classPath,
                    className: toClassName(classPath),
                    processing: true,
                    isSimpleTestCase: false,
                    isJawsTestCase: false,
                    isRobotTestCase: false,
                    isTestSuite: false,
                    childClasses: []
                };
                var parseInfo = response.parseInfo = files[fileName];
                if (knownSimpleTestCases.indexOf(fileName) > -1) {
                    response.isSimpleTestCase = true;
                } else if (knownJawsTestCases.indexOf(fileName) > -1) {
                    response.isJawsTestCase = true;
                } else if (knownRobotTestCases.indexOf(fileName) > -1) {
                    response.isRobotTestCase = true;
                } else if (fileName == "aria/jsunit/TestSuite") {
                    response.isTestSuite = true;
                } else if (parseInfo && parseInfo.type == "classDefinition" && parseInfo.content.parent) {
                    var parentResponse = processFile(parseInfo.content.parent);
                    if (parentResponse.processing) {
                        grunt.log.error(fileName.yellow + " contains recursion in the parent hierarchy.");
                    }
                    response.parent = parentResponse;
                    if (!response.parent.parseInfo) {
                        grunt.log.error(parseInfo.content.parent.yellow + " parent of " + fileName.yellow + " could not be found!");
                    }
                    parentResponse.childClasses.push(response);
                    response.isSimpleTestCase = parentResponse.isSimpleTestCase;
                    response.isJawsTestCase = parentResponse.isJawsTestCase;
                    response.isRobotTestCase = parentResponse.isRobotTestCase;
                    response.isTestSuite = parentResponse.isTestSuite;
                }
                response.processing = false;
            }
            return response;
        }

        var fileNames = Object.keys(files);
        fileNames.forEach(processFile);

        var filesToRename = [];
        var inTestFolderRegExp = /^test\//;
        var testSuffixRegExp = /(TestCase|Base)\.js$/;
        var partsToRemoveRegExp = /Suite|Robot|Tests?|Case|Base|Jaws|\.js$/g;

        function buildExpectedName(existingName, fileInfo) {
            var expectedSuffix = "";
            if (fileInfo.isJawsTestCase) {
                expectedSuffix = "Jaws";
            } else if (fileInfo.isRobotTestCase) {
                expectedSuffix = "Robot";
            }
            if (fileInfo.isSimpleTestCase || expectedSuffix) {
                if (fileInfo.childClasses.length > 0) {
                    expectedSuffix += "Base";
                } else {
                    expectedSuffix += "TestCase";
                }
            } else if (fileInfo.isTestSuite) {
                expectedSuffix = "TestSuite";
            } else if (!testSuffixRegExp.test(existingName)) {
                return existingName;
            }
            var parts = existingName.split("/");
            var lastPart = parts.pop();
            var baseLastPart = lastPart.replace(partsToRemoveRegExp, "");
            var counter = 0;
            lastPart = baseLastPart + expectedSuffix;
            var parent = fileInfo.parent;
            while (parent) {
                if (lastPart === parent.className) {
                    lastPart = baseLastPart + String.fromCharCode(65 + counter) + expectedSuffix;
                    counter++;
                    parent = fileInfo; // restart from the beginning
                }
                parent = parent.parent;
            }
            parts.push(lastPart + ".js");
            return parts.join("/");
        }

        function toRegExp(path, boundaryBegin, boundaryEnd) {
            return new RegExp(
                (boundaryBegin !== false ? "\\b" : "") +
                path.replace(/([^a-zA-Z0-9])/g, "\\$1") +
                (boundaryEnd !== false ? "\\b" : "")
            , "g");
        }

        function toReplace(response) {
            return function () {
                return response;
            };
        }

        function changeName(fileInfo, newFileName) {
            var oldFileName = fileInfo.newFileName || fileInfo.fileName;
            if (oldFileName === newFileName) {
                // nothing to do!
                return;
            }
            if (processedMap[newFileName]) {
                grunt.log.error(oldFileName.yellow + " would replace an existing file: " + newFileName.yellow);
                return;
            }
            processedMap[newFileName] = fileInfo;
            fileInfo.newFileName = newFileName;
            var newClassPath = toClassPath(newFileName);
            var newClassName = toClassName(newClassPath);
            filesToRename.push(fileInfo);

            // check if there is an associated template and script:
            var associatedTpl = processedMap[oldFileName.replace(/\.js$/, "Tpl.tpl")];
            if (associatedTpl) {
                changeName(associatedTpl, newFileName.replace(/\.js$/, "Tpl.tpl"));
            }

            var associatedScript = processedMap[oldFileName.replace(/\.tpl$/, "Script.js")];
            if (associatedScript) {
                changeName(associatedScript, newFileName.replace(/\.tpl$/, "Script.js"));
            }

            var oldFileNameWithoutJS = oldFileName.replace(/\.js$/, "");
            var newFileNameWithoutJS = newFileName.replace(/\.js$/, "");
            fileInfo.localReplacements = [{
                find: toRegExp("this.$" + fileInfo.className, false),
                replace: toReplace("this.$" + newClassName)
            }];
            fileInfo.globalReplacements = [{
                find: toRegExp(fileInfo.classPath),
                replace: toReplace(newClassPath)
            }, {
                find: toRegExp(oldFileNameWithoutJS),
                replace: toReplace(newFileNameWithoutJS)
            }];

            fileInfo.oldFileNameWithoutJS = oldFileNameWithoutJS;
            fileInfo.newFileNameWithoutJS = newFileNameWithoutJS;
        }

        function checkName(fileInfo) {
            var expectedName = buildExpectedName(fileInfo.fileName, fileInfo);
            if (fileInfo.fileName !== expectedName) {
                var checkStable = buildExpectedName(expectedName, fileInfo);
                if (checkStable !== expectedName) {
                    grunt.log.error(fileInfo.fileName.yellow + " would not have a stable name: " + expectedName.yellow + " => " + checkStable.yellow);
                    return;
                }
                changeName(fileInfo, expectedName);
            }
        }

        fileNames.forEach(function (fileName) {
            if (!inTestFolderRegExp.test(fileName)) {
                return;
            }
            var fileInfo = processedMap[fileName];
            checkName(fileInfo);
        });

        if (this.errorCount > 0) {
            throw new Error("Error were raised! Stopping before renaming files!");
        }

        if (filesToRename.length === 0) {
            console.log("No file to rename!");
            return;
        }

/*
        filesToRename.forEach(function (fileInfo) {
            console.log(fileInfo.fileName.yellow + " => " + fileInfo.newFileName.yellow);
        });
*/
        var path = require("path").posix;
        function toRelative(fileName, contextFileName) {
            var contextDir = path.dirname(contextFileName);
            var res = path.relative(contextDir, fileName);
            if (!/^\.\.\//.test(res)) {
                res = "./" + res;
            }
            return res;
        }

        function followReplacementsArray(fileContent, replacements) {
            if (replacements) {
                replacements.forEach(function (replacement) {
                    fileContent = fileContent.replace(replacement.find, replacement.replace);
                });
            }
            return fileContent;
        }

        function doReplacements(fileContent, fileInfo) {
            filesToRename.forEach(function (toRenameInfo) {
                fileContent = followReplacementsArray(fileContent, toRenameInfo.globalReplacements.concat({
                    find: toRegExp(toRelative(toRenameInfo.oldFileNameWithoutJS, fileInfo.fileName), false, false),
                    replace: toReplace(toRelative(toRenameInfo.newFileNameWithoutJS, fileInfo.fileName))
                }));
            });
            var parent = fileInfo;
            while (parent != null) {
                fileContent = followReplacementsArray(fileContent, parent.localReplacements);
                parent = parent.parent;
            }
            return fileContent;
        }
        var noWrite = grunt.option("no-write");
        var child_process = require("child_process");
        fileNames.forEach(function (fileName) {
            if (!inTestFolderRegExp.test(fileName)) {
                return;
            }
            var fileInfo = processedMap[fileName];
            console.log("Checking " + fileName);
            var fileContent = grunt.file.read(fileName);
            var newFileName = fileInfo.newFileName || fileName;
            if (newFileName !== fileName && !noWrite) {
                grunt.file["delete"](fileName);
                grunt.file.write(newFileName, fileContent);
                child_process.execSync("git add " + fileName + " " + newFileName);
            }
            var updatedFileContent = doReplacements(fileContent, fileInfo);
            if (updatedFileContent !== fileContent && !noWrite) {
                grunt.file.write(newFileName, updatedFileContent);
            }
        });
        child_process.execSync('git commit -m "Renaming files"');
        child_process.execSync('git commit -a -m "Changing content after renaming files"');
    });

    grunt.registerTask('checkTestConventions', ['at-diff-parse:test', 'check-test-conventions-postprocess']);
};
