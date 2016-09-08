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
 * Aria Templates bootstrap build file for files generated in the source folder directly.
 */
module.exports = function (grunt) {
    var packagingSettings = require('./config-packaging')(grunt);

    grunt.config.set('atpackager.checkUnused', {
        options : {
            sourceDirectories : ['src'],
            sourceFiles : packagingSettings.atExtensions.concat(["!node/**", "!noder-modules/**"]),
            onlySourceFiles : true,
            outputDirectory : 'out',
            visitors : [
            {
                type: 'ImportSourceFiles',
                cfg: {
                    sourceDirectory: "test",
                    sourceFiles : packagingSettings.atExtensions.concat(["!**/*Script.js", "!node/**", "!nodeTestResources/**"]),
                    targetBaseLogicalPath: "test"
                }
            }, "ATDependencies",
            {
                type : 'NoderDependencies',
                cfg : {
                    externalDependencies : ['noder-js/**'],
                    files : packagingSettings.atExtensions
                }
            }, {
                type : function () {
                    console.log("test suite dependencies");
                    return {
                        computeDependencies: function (packaging, inputFile) {
                            var textContent = inputFile.getTextContent();
                            var fileInfo = require("attester/lib/test-type/aria-templates/at-file-reader")(textContent, inputFile.logicalPath);
                            var dependencies = [];
                            if (fileInfo.testSuite) {
                                dependencies = dependencies.concat(fileInfo.subTests.map(function (value) { return {classpath:value, ext:".js"};}));
                            } else {
                                var detector = /('|")((test|aria)(\.[a-z]\w*)*(\.[_A-Z]\w*))(\.\w+)*\1/g;
                                var match = detector.exec(textContent);
                                while (match) {
                                    dependencies.push({
                                        classpath: match[2]
                                    });
                                    match = detector.exec(textContent);
                                }
                            }
                            dependencies.forEach(function (info) {
                                var baseClasspath = info.classpath.replace(/\./g, "/");
                                var correspondingFile = null;
                                if (!info.ext) {
                                    [".js", ".tpl", ".tpl.css", ".tpl.txt", ".cml", ".tml"].some(function (ext) {
                                        var file = packaging.getSourceFile(baseClasspath + ext);
                                        if (file) {
                                            correspondingFile = file;
                                            return true;
                                        }
                                    });
                                    if (!correspondingFile) {
                                        console.log("no file found for " + info.classpath + " from " + inputFile.logicalPath.yellow);
                                        return;
                                    }
                                } else {
                                    correspondingFile = packaging.getSourceFile(baseClasspath + info.ext);
                                }
                                if (correspondingFile) {
                                    inputFile.addDependency(correspondingFile);
                                } else {
                                    grunt.log.error(inputFile.logicalPath.yellow + " depends on " + dependency + " which cannot be found.");
                                }
                            });
                        }
                    };
                },
                cfg : {}
            }, {
                type : 'CheckDependencies',
                cfg : {
                    noCircularDependencies : false,
                    checkPackagesOrder : false
                }
            },
             {
                 type: "CheckPackaged",
                 cfg: {
                     files: ["**/*.js"]
                 }
             }
         ],
            packages : [
                {
                    name : "package.js",
                    builder : {
                        type : 'NoderBootstrapPackage',
                        cfg : {
                            noderConfigOptions : {
                                resolver : {
                                    "default" : {
                                        ariatemplates : "aria"
                                    }
                                },
                                packaging : {
                                    ariatemplates : true
                                }
                            }
                        }
                    }
                },
            {
                name: "usedFiles",
                builder: {
                    type: function (cfg) {
                        console.log("my builder", cfg);
                        return {
                            build: function () {}
                        };
                    },
                    config: {}
                },
                files: packagingSettings.bootstrap.files.concat([
                    "test/aria/widgets/skin/FlatSkinTestSuite.js",
                    "test/aria/widgets/skin/ExternalCSSTest.js",
                    "test/aria/widgets/icon/fontIcon/FontIconTest.js",
                    "test/aria/widgets/form/widgetsfont/WidgetsFontTest.js",
                    "test/aria/widgets/form/fullWidth/FullWidthTest.js",
                    "test/aria/widgets/form/fullWidth/errorLog/ErrorLogTest.js",
                    "test/MainTestSuite.js",
                    "test/JawsTestSuite.js"
                ])
            }]
        }
    });

    grunt.registerTask('checkUnused', ['atpackager:checkUnused']);
};
