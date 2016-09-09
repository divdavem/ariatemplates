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

Aria.classDefinition({
    $classpath : "test.aria.widgets.wai.popup.errortooltip.ErrorTooltipJawsTestSuite",
    $extends : "aria.jsunit.TestSuite",
    $constructor : function () {
        this.$TestSuite.constructor.call(this);
        this.addTests("test.aria.widgets.wai.popup.errortooltip.ErrorTooltipTextFieldJawsTestCase");
        this.addTests("test.aria.widgets.wai.popup.errortooltip.ErrorTooltipTextareaJawsTestCase");
        this.addTests("test.aria.widgets.wai.popup.errortooltip.ErrorTooltipNumberFieldJawsTestCase");
        this.addTests("test.aria.widgets.wai.popup.errortooltip.ErrorTooltipDateFieldJawsTestCase");
        this.addTests("test.aria.widgets.wai.popup.errortooltip.ErrorTooltipTimeFieldJawsTestCase");
        this.addTests("test.aria.widgets.wai.popup.errortooltip.ErrorTooltipDatePickerJawsTestCase");
        this.addTests("test.aria.widgets.wai.popup.errortooltip.ErrorTooltipAutoCompleteJawsTestCase");
        this.addTests("test.aria.widgets.wai.popup.errortooltip.ErrorTooltipMultiSelectJawsTestCase");
        this.addTests("test.aria.widgets.wai.popup.errortooltip.ErrorTooltipSelectBoxJawsTestCase");
        this.addTests("test.aria.widgets.wai.popup.errortooltip.ErrorTooltipMultiAutoCompleteJawsTestCase");
    }
});
