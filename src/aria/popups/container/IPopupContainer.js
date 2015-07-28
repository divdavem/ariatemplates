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

module.exports = Aria.interfaceDefinition({
    $classpath : "aria.popups.container.IPopupContainer",
    $interface : {
        getContainerRef : function () {},

        getContainerElt : function () {},

        getContainerScroll : function () {},

        getContainerOverflow : function () {},

        /*
         * Changes the overflow style of the container.
         * Returns the previous value.
         */
        changeContainerOverflow : function (newValue) {},

        /**
         * Calculates the position of the given domElt inside the container.
         */
        calculatePosition : function (domElt) {},

        getScrollSize : function () {},

        getClientSize : function () {},

        isInside : function (position, size, base) {},

        fitInside : function (position, size, base) {},

        centerInside : function (size, base) {}
    }
});
