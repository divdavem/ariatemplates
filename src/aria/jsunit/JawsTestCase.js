/*
 * Copyright 2015 Amadeus s.a.s.
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
var Aria = require("../Aria");
var ariaUtilsString = require("../utils/String");
var ariaUtilsJson = require("../utils/Json");

/**
 * Class to be extended to create a template test case which checks the behavior with
 * the Jaws screen reader. It contains method to help checking what Jaws said.
 */
module.exports = Aria.classDefinition({
    $classpath : "aria.jsunit.JawsTestCase",
    $extends : require("./RobotTestCase"),
    $prototype : {
        /**
         * Private helper function, starts the tests once the template has been successfully loaded and rendered
         */
        _startTests : function () {
            // automatically clear Jaws history before starting the test
            this.clearJawsHistory(this.$RobotTestCase._startTests);
        },

        _createFullScreenTextArea : function () {
            var textArea = this.testDocument.createElement("textarea");
            var textAreaStyle = textArea.style;
            textAreaStyle.position = "absolute";
            textAreaStyle.display = "block";
            textAreaStyle.top = "0px";
            textAreaStyle.left = "0px";
            textAreaStyle.width = "100%";
            textAreaStyle.height = "100%";
            textAreaStyle.zIndex = "999999";
            this.testDocument.body.appendChild(textArea);
            return textArea;
        },

        clearJawsHistory : function (cb) {
            var textArea = this._createFullScreenTextArea();
            this.synEvent.execute([
                ["click", textArea],
                ["pause", 500],
                ["type", null, "[<insert>][space][>insert<][<shift>]h[>shift<]"],
                ["pause", 2000]
            ],{
                fn: function () {
                    var textAreaContent = textArea.value;
                    textArea.parentNode.removeChild(textArea);
                    // if there is something in the text area, there is something
                    // wrong in the setup (e.g.: JAWS not enabled or wrong robot
                    // implementation)
                    if (textAreaContent === "") {
                        this.$callback(cb);
                    } else {
                        // ends the test
                        this.raiseFailure("JAWS is not running or wrong robot implementation");
                        this.end();
                    }

                },
                scope: this
            });
        },

        retrieveJawsHistory : function (cb) {
            var textArea = this._createFullScreenTextArea();
            this.synEvent.execute([
                ["type", null, "[<insert>][space][>insert<]h"], // displays history
                ["pause", 2000],
                ["type", null, "[<ctrl>]a[>ctrl<]"], // copies history
                ["pause", 1000],
                ["type", null, "[<ctrl>]c[>ctrl<]"],
                ["pause", 1000],
                ["type", null, "[<alt>][F4][>alt<]"],
                ["click", textArea],
                ["type", null, "[<ctrl>]v[>ctrl<]"], // pastes history
                ["pause", 2000]
            ], {
                fn: function () {
                    textArea.parentNode.removeChild(textArea);
                    var textAreaContent = textArea.value;
                    this.$callback(cb, ariaUtilsString.trim(textAreaContent.replace(/\s*\r?\n\s*/, "\n")));
                },
                scope: this
            });
        },

        assertJawsHistoryEquals : function (expectedOutput, callback) {
            this.retrieveJawsHistory({
                fn: function (response) {
                    this.assertEquals(response, expectedOutput, "JAWS history: " + ariaUtilsJson.convertToJsonString(response));
                    this.$callback(callback);
                },
                scope: this
            });
        }
    }
});
