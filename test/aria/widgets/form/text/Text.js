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

Aria.classDefinition({
    $classpath : "test.aria.widgets.form.text.Text",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["aria.utils.Ellipsis"],
    $prototype : {

        setUp : function () {
            var document = Aria.$window.document;
            this._element = document.createElement("span");
            document.body.appendChild(this._element);
        },

        testEllipsis : function () {

            this.checkTruncatedTextSize("This is the text to be displayed. At time there is a lot of text and it is necessary to make the test shorter. We do this by using ellipses.");
            this.checkTruncatedTextSize("WWWWWWWWWWWWMMMMMMMMMMMMMMiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii");
            this.checkTruncatedTextSize("MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM");
            this.checkTruncatedTextSize("iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii");
        },

        testPerformanceEllipsis : function () {

            var startTime = new Date();
            for (var i = 0; i < 50; i++) {
                var ellipsis1 = new aria.utils.Ellipsis(this._element, 120, "right", "MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM", null, "fullCharacter");
                var ellipsis2 = new aria.utils.Ellipsis(this._element, 120, "right", "iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii", null, "fullCharacter");
                var ellipsis3 = new aria.utils.Ellipsis(this._element, 120, "right", "MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM", null, "fullCharacter");
                var ellipsis4 = new aria.utils.Ellipsis(this._element, 120, "right", "iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii", null, "fullCharacter");
                var ellipsis5 = new aria.utils.Ellipsis(this._element, 120, "right", "MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM", null, "fullCharacter");
                var ellipsis6 = new aria.utils.Ellipsis(this._element, 120, "right", "iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii", null, "fullCharacter");

                ellipsis1.$dispose();
                ellipsis2.$dispose();
                ellipsis3.$dispose();
                ellipsis4.$dispose();
                ellipsis5.$dispose();
                ellipsis6.$dispose();
            }

            var endTime = new Date();
            var timeElapsed = endTime.getTime() - startTime.getTime();
            this.assertTrue(timeElapsed < 100);
        },

        checkTruncatedTextSize : function (fullText) {

            var ellipsisText = "...";
            var ellipsisWidth = this.getTextSize(ellipsisText);
            var expectedTotalWidth = 120;

            // we calculate the longest letter possible, and make that the acceptable error margin
            var errorMarginWidth = this.getTextSize("M");

            this._element.innerHTML = fullText;

            var ellipsis = new aria.utils.Ellipsis(this._element, expectedTotalWidth, "right", ellipsisText, null, "fullCharacter");

            var totalEllipsisWidth = this._element.offsetWidth;

            // make sure that the width is close to the real ellipsis' width we have set
            var correcSize = (expectedTotalWidth - errorMarginWidth <= totalEllipsisWidth)
                    && (totalEllipsisWidth <= expectedTotalWidth);

            this.assertTrue(correcSize);

            ellipsis.$dispose();

        },

        getTextSize : function (text) {

            var document = Aria.$window.document;
            // Need to make sure the new element has the same exact styling applied as the original element so we use
            // the same tag, class, style and append it to the same parent
            var tempSizerEl = document.createElement(this._element.tagName);
            tempSizerEl.className = this._element.className;
            tempSizerEl.setAttribute("style", this._element.getAttribute("style"));
            this._element.parentNode.appendChild(tempSizerEl);

            // Now we need to make sure the element displays on one line and is not visible in the page
            tempSizerEl.style.visibility = "hidden";
            tempSizerEl.style.position = "absolute";
            tempSizerEl.style.whiteSpace = "nowrap";

            tempSizerEl.innerHTML = text;
            var eltWidth = tempSizerEl.offsetWidth;

            // delete tmp element
            tempSizerEl.parentNode.removeChild(tempSizerEl);
            tempSizerEl = null;

            return eltWidth;
        },

        tearDown : function () {
            this._element.parentNode.removeChild(this._element);
            this._element = null;
        }

        /*
            runTemplateTest : function () {

                var widgetWithEllipsis = this.getWidgetInstance('myTextWithEllipsis');

                var widgetWithoutEllipsis = this.getWidgetInstance('myTextWithoutEllipsis');
                var domNoEllipsisElt = widgetWithoutEllipsis.getDom();

                this.assertTrue(widgetWithEllipsis._ellipsis.truncatedTextSize == domNoEllipsisElt.offsetWidth);

                this.end();

            }
        */
    }
});
