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
var DomUtils = require("../../utils/Dom");

module.exports = Aria.classDefinition({
    $classpath : "aria.popups.container.DomElement",
    $implements : [require("./IPopupContainer")],
    $constructor : function (container) {
        this.container = container;
    },
    $destructor : function () {
        this.container = null;
    },
    $prototype : {

        getContainerRef : function () {
            return this.container;
        },

        getContainerElt : function () {
            return this.container;
        },

        getContainerScroll : function () {
            var container = this.container;
            return {
                scrollLeft: container.scrollLeft,
                scrollTop: container.scrollTop
            };
        },

        getContainerOverflow : function () {
            return this.container.style.overflow;
        },

        /*
         * Changes the overflow style of the container.
         * Returns the previous value.
         */
        changeContainerOverflow : function (newValue) {
            var containerStyle = this.container.style;
            var res = containerStyle.overflow;
            containerStyle.overflow = newValue;
            return res;
        },

        /**
         * Calculates the position of the given domElt inside the container.
         */
        calculatePosition : function (domElt) {
            var position = DomUtils.calculatePosition(domElt);
            var container = this.container;
            var containerPosition = DomUtils.calculatePosition(container);
            return {
                left : position.left - containerPosition.left - container.clientLeft,
                top: position.top - containerPosition.top - container.clientTop
            };
        },

        getScrollSize : function () {
            var container = this.container;
            return {
                width: container.scrollWidth,
                height: container.scrollHeight
            };
        },

        getClientSize : function () {
            var container = this.container;
            return {
                width: container.clientWidth,
                height: container.clientHeight
            };
        },

        _getGeometry : function () {
            var container = this.container;
            return {
                x: container.scrollLeft,
                y: container.scrollTop,
                width: container.clientWidth,
                height: container.clientHeight
            };
        },

        isInside : function (position, size, base) {
            return DomUtils.isInside({
                x: position.left,
                y: position.top,
                width: size.width,
                height: size.height
            }, this._getGeometry());
        },

        fitInside : function (position, size, base) {
            return DomUtils.fitInside({
                x: position.left,
                y: position.top,
                width: size.width,
                height: size.height
            },  this._getGeometry());
        },

        centerInside : function (size, base) {
            var container = this.container;
            return {
                left : Math.floor(container.scrollLeft + (container.clientWidth - size.width) / 2),
                top : Math.floor(container.scrollTop + (container.clientHeight - size.height) / 2)
            };
        }

    }
});
