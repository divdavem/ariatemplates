/*
 * Copyright 2013 Amadeus s.a.s.
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
    $classpath : "test.aria.widgets.form.autocomplete.multiautocomplete.test5.MultiAutoEditUnchangedFreetext",
    $extends : "test.aria.widgets.form.autocomplete.multiautocomplete.BaseMultiAutoCompleteTestCase",
    $prototype : {

        runTemplateTest : function () {
            this.clickAndType(["b", "[enter]", "a", "[enter]"], {
                fn : this._editValues,
                scope : this
            }, 500);
        },

        _editValues : function () {
            this.checkDataModel(2, ["b", "a"]);
            var element = this._getSelectedItemElement(0).firstChild;
            this.synEvent.click(element, {
                fn : this._afterFirstClick,
                scope : this
            });
        },

        _afterFirstClick : function () {
            var element = this._getSelectedItemElement(0).firstChild;
            this.synEvent.click(element, {
                fn : this._afterSecondClick,
                scope : this
            });
        },

        _afterSecondClick : function () {
            aria.core.Timer.addCallback({
                scope : this,
                fn : this._afterWaitSomeTime,
                delay : 10
            });
        },

        _afterWaitSomeTime : function () {
            this.checkDataModel(1, ["a"]);
            this.focusOut({
                scope : this,
                fn : this._afterFocusOut
            });
        },

        _afterFocusOut : function () {
            this.checkDataModel(2, ["a", "b"]);
            this.end();
        }

    }
});
