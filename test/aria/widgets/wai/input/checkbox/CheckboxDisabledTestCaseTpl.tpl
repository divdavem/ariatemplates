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
{Template {
    $classpath : "test.aria.widgets.wai.input.checkbox.CheckboxDisabledTestCaseTpl"
}}

    {macro main()}
        <div style="margin:10px;font-size:+3;font-style:bold;">This test needs focus.</div>
        {@aria:TextField {
            id : "tf1",
            label : "First textfield",
            labelWidth: 100,
            value: ""
        }/}

        {call checkBoxes("std") /}
        {call checkBoxes("simple") /}

        {@aria:TextField {
            id : "tf2",
            label : "Last textfield",
            labelWidth: 100,
            value: ""
        }/}

    {/macro}

    {macro checkBoxes(sclass)}
        <div style="margin:10px;">
            {@aria:CheckBox {
                waiAria : true,
                label : sclass + " input 1",
                labelWidth: 100,
                sclass: sclass,
                bind: {
                    value: {
                        to: "checkboxChecked",
                        inside: data
                    }
                }
            }/}
            {@aria:CheckBox {
                waiAria : true,
                label : sclass + " input 2",
                labelWidth: 100,
                sclass: sclass,
                bind: {
                    value: {
                        to: "checkboxDisabled",
                        inside: data
                    }
                }
            }/}
            {@aria:CheckBox {
                waiAria : true,
                label : sclass + " input 3",
                labelWidth: 100,
                sclass: sclass,
                bind: {
                    disabled: {
                        to: "checkboxDisabled",
                        inside: data
                    },
                    value: {
                        to: "checkboxChecked",
                        inside: data
                  }
              }
            }/}

            <span class="xSROnly" id="${sclass+"input4Label"}" aria-hidden="true">${sclass} input 4</span>
            {@aria:CheckBox {
                waiAria : true,
                label: sclass + " input 4",
                waiLabelHidden: true,
                waiLabelledBy: sclass + "input4Label",
                labelWidth: 100,
                sclass: sclass,
                disabled: true,
                value: true
            } /}

            {@aria:CheckBox {
                id: sclass+"Input5",
                waiAria : true,
                labelWidth: 100,
                sclass: sclass,
                disabled: true,
                value: true
            } /}
            <span class="xSROnly" for="${sclass+"Input5"}_input">${sclass} input 5</span>
        </div>
    {/macro}

{/Template}
