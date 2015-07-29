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
var Aria = require("../../Aria");
var DomUtils = require("../../utils/Dom");
var Browser = require("../../core/Browser");

module.exports = Aria.classDefinition({
    $classpath : "aria.popups.container.Viewport",
    $singleton : true,
    $implements : [require("./IPopupContainer")],
    $prototype : {

        getContainerRef : function () {
            return DomUtils.VIEWPORT;
        },

        getContainerElt : function () {
            return Aria.$window.document.body;
        },

        getContainerScroll : function () {
            return DomUtils._getDocumentScroll();
        },

        getContainerOverflow : function () {
            return DomUtils.getDocumentScrollElement().style.overflow;
        },

        /*
         * Changes the overflow style of the container.
         * Returns the previous value.
         */
        changeContainerOverflow : function (newValue) {
            // PTR 04893174 was rolled back for release 1.1-13 because it introduces a regression on Airrail.
            // PTR 04893174: do not set scrollElement = document.body on Firefox, as it resets all scrolling
            // position when changing the overflow style
            // PTR 05210073: the changes reverted for PTR 04893174 were put back in place and the code changes
            // in order to fix the regression were implemented

            var scrollElement = DomUtils.getDocumentScrollElement();
            var res = scrollElement.style.overflow;
            if (Browser.isFirefox) {
                var docScroll = DomUtils._getDocumentScroll();
                scrollElement.style.overflow = newValue;
                scrollElement.scrollTop = docScroll.scrollTop;
                scrollElement.scrollLeft = docScroll.scrollLeft;
            } else {
                scrollElement.style.overflow = newValue;
            }
            return res;
        },

        /**
         * Calculates the position of the given domElt inside the container.
         */
        calculatePosition : function (domElt) {
            var position = DomUtils.calculatePosition(domElt);
            return {
                left: position.left,
                top: position.top
            };
        },

        getScrollSize : function () {
            var viewport = DomUtils._getViewportSize();
            var scrollElement = DomUtils.getDocumentScrollElement();
            // ensure that all viewport is used
            return {
                width: Math.max(viewport.width, scrollElement.scrollWidth),
                height: Math.max(viewport.height, scrollElement.scrollHeight)
            };
        },

        getClientSize : function () {
            return DomUtils._getViewportSize();
        },

        isInside : function (position, size, base) {
            return DomUtils.isInViewport(position, size, base);
        },

        fitInside : function (position, size, base) {
            return DomUtils.fitInViewport(position, size, base);
        },

        centerInside : function (size, base) {
            return DomUtils.centerInViewport(size, base);
        }
    }
});
