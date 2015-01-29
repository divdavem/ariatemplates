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

// Creates a preprocessor for a specific class generator
var Promise = require('noder-js/promise.js');

module.exports = function (classGenerator) {
    return function (content, fileName) {
        return new Promise(function (resolve, reject) {
            classGenerator.parseTemplate(content, false, function (res) {
                if (res.classDef) {
                    resolve(res.classDef);
                } else {
                    reject(new Error("Template '"
                            + fileName
                            + "' could not be compiled to javascript. Please check the previous errors in the console for more details."));
                }
            }, {
                "file_classpath" : fileName
            });
        });
    };
};
