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

var Aria = require("ariatemplates/Aria");
var AppEnvironment = require("ariatemplates/core/AppEnvironment");

module.exports = Aria.classDefinition({
    $classpath : "test.aria.templates.resources.TemplateWithResourcesDevTestCase",
    $extends : require("ariatemplates/jsunit/TemplateTestCase"),
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);
        this.setTestEnv({
            template : "test.aria.templates.resources.TemplateWithResources"
        });
    },
    $prototype : {
        run : function () {
            AppEnvironment.setEnvironment({
                appSettings : {
                    devMode : true
                }
            }, {
                fn : this.$TemplateTestCase.run,
                scope : this
            });
        },

        runTemplateTest : function () {
            var content = (this.testDiv.textContent || this.testDiv.innerText).replace(/^\s*(.*?)\s*$/, "$1");
            this.assertEquals(content, "IT IS WORKING!");
            this.notifyTemplateTestEnd();
        }
    }
});