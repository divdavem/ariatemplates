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

{Template {
    $classpath : "test.aria.widgets.wai.datePicker.DatePickerTpl"
}}
    {macro main()}
        <div style="margin:10px;font-size:+3;font-weight:bold;">DatePicker accessibility sample</div>
        <div style="margin:10px;">
            With accessibility enabled: <br><br>
            {call datePicker("dpWaiEnabled", true) /} <br><br><br>
            With accessibility disabled: <br><br>
            {call datePicker("dpWaiDisabled", false) /} <br><br><br>
        </div>
    {/macro}

    {macro datePicker(id, waiAria)}
        {@aria:DatePicker {
            id: id,
            label: "Travel date",
            iconTooltip: "Display calendar",
            waiAria: waiAria,
            waiAriaDateFormat: "EEEE d MMMM yyyy",
        }/}
    {/macro}

{/Template}
