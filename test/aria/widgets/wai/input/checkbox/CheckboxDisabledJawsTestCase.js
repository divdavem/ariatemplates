/*
 * Copyright 2016 Amadeus s.a.s.
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

Aria.classDefinition({
    $classpath : "test.aria.widgets.wai.input.checkbox.CheckboxDisabledJawsTestCase",
    $extends : "aria.jsunit.JawsTestCase",
    $constructor : function () {
        this.$JawsTestCase.constructor.call(this);
        this.setTestEnv({
            template : "test.aria.widgets.wai.input.checkbox.CheckboxDisabledTestCaseTpl"
        });
    },
    $prototype : {
        runTemplateTest : function () {

            var filterRegExp = /(First textfield Edit|Type in text\.)\n/gi;
            var checkedRegExp = /not checked\nchecked/g;
            var notCheckedRegExp = /checked\nnot checked/g;

            this.synEvent.execute([
                ["click", this.getElementById("tf1")], ["pause", 500],
                ["type", null, "[down]"], ["pause", 500],
                ["type", null, "[space]"], ["pause", 500],
                ["type", null, "[down]"], ["pause", 500],
                ["type", null, "[down]"], ["pause", 500],
                ["type", null, "[space]"], ["pause", 500],
                ["type", null, "[down]"], ["pause", 500],
                ["type", null, "[down]"], ["pause", 500],
                ["type", null, "[down]"], ["pause", 500],
                ["type", null, "[down]"], ["pause", 500],
                ["type", null, "[down]"], ["pause", 500],
                ["type", null, "[down]"], ["pause", 500],
                ["type", null, "[down]"], ["pause", 500],
                ["type", null, "[down]"], ["pause", 500],
                ["type", null, "[down]"], ["pause", 500],
                ["type", null, "[down]"], ["pause", 500],
                ["type", null, "[down]"], ["pause", 500],
                ["type", null, "[down]"], ["pause", 500],
                ["type", null, "[down]"], ["pause", 500],
                ["type", null, "[down]"], ["pause", 500],
                ["type", null, "[down]"], ["pause", 500]
            ], {
                fn: function () {
                    this.assertJawsHistoryEquals(
                        "std input 1 check box not checked\nstd input 1 check box checked\nstd input 1\nstd input 2 check box not checked\nstd input 2 check box checked\nstd input 2\nstd input 3 check box checked Unavailable\nstd input 3\nstd input 4\ncheck box checked Unavailable\nstd input 5 check box checked Unavailable\nstd input 5\nsimple input 1 check box checked\nsimple input 1\nsimple input 2 check box checked\nsimple input 2\nsimple input 3 check box checked Unavailable\nsimple input 3\nsimple input 4\ncheck box checked Unavailable\nsimple input 5 check box checked Unavailable\nsimple input 5",
                    this.end,
                    function(response) {
                        return response.replace(filterRegExp, "").
                            replace(checkedRegExp, "checked").
                            replace(notCheckedRegExp, "not checked");
                    });
                },
                scope: this
            });
        }
    }
});
