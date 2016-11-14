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
    $classpath : "test.aria.widgets.wai.dropdown.icon.DropDownIconJawsTestCase",
    $extends : "aria.jsunit.JawsTestCase",
    $constructor : function () {
        this.$JawsTestCase.constructor.call(this);
        this.setTestEnv({
            template : "test.aria.widgets.wai.dropdown.icon.Tpl"
        });
    },
    $prototype : {
        runTemplateTest : function () {
            this.noiseRegExps.push(/type/i);
            var actions = [
                ["click", this.getElementById("firstItem")], ["pause", 500]
            ];
            this.synEvent.execute(actions, {
                fn: function () {
                    var availableActions = Aria.$window.top.SeleniumJavaRobot.actions;
                    var actions = [];
                    for (var i = 0; i < 9; i++) {
                        actions.push(availableActions.type("[tab]"), availableActions.pause(500));
                    }
                    actions.push(availableActions.type("[<insert>][F5][>insert<]"), availableActions.pause(500));
                    for (var i = 0; i < 5; i++) {
                        actions.push(availableActions.type("[down]"), availableActions.pause(500));
                    }
                    actions.push(availableActions.type("[escape]"), availableActions.pause(500));
                    Aria.$window.top.SeleniumJavaRobot.execute(actions, {
                        fn: function () {
                            this.assertJawsHistoryEquals([
                                "FirstFieldLabel Edit",
                                "DatePickerLabel Edit",
                                "DropDownLabelForDatePicker",
                                "AutoCompleteLabel Edit",
                                "DropDownLabelForAutoComplete",
                                "SelectBoxLabel Edit",
                                "DropDownLabelForSelectBox",
                                "MultiSelectLabel Edit",
                                "DropDownLabelForMultiSelect",
                                "LastFieldLabel Edit",
                                "Select a Form Field dialog",
                                "List1 List view",
                                "FirstFieldLabel Edit",
                                "1 of 6",
                                "To move to items use the Arrow keys.",
                                "DatePickerLabel Edit",
                                "AutoCompleteLabel Edit",
                                "SelectBoxLabel Edit",
                                "MultiSelectLabel Edit",
                                "LastFieldLabel Edit"
                            ].join("\n"), this.end);
                        },
                        scope: this

                    });
                },
                scope: this
            })
            /*this.synEvent.execute(actions, {
                fn: function () {
                    this.assertJawsHistoryEquals("", this.end);
                },
                scope: this
            });*/
        }
    }
});
