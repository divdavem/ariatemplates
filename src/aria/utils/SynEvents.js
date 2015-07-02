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
var Aria = require("../Aria");
var ariaUtilsFunction = require("./Function");

var Syn = require("./syn/synthetic.js");
require("./syn/mouse.support.js");
require("./syn/browsers.js");
require("./syn/key.support.js");
require("./syn/drag.js");
Aria.$global.Syn = Syn;

/**
 * Class to simulate DOM events which can bubble in the DOM.
 */
module.exports = Aria.classDefinition({
    $classpath : "aria.utils.SynEvents",
    $singleton : true,
    $prototype : {

        /**
         * Emulate a click event on a specific DOM element, using the underlying Syn library
         * @param {HTMLElement} el The reference to the element to be clicked on
         * @param {Object} cb
         */
        click : function (el, cb) {
            Syn.click({}, el, ariaUtilsFunction.bindCallback(cb));
        },

        /**
         * Emulate typing in a specific DOM element, using the underlying Syn library
         * @param {HTMLElement} el The element to type in
         * @param {String} text The text to be typed in
         * @param {Object} cb
         */
        type : function (el, text, cb) {
            Syn.type(text, el, ariaUtilsFunction.bindCallback(cb));
        },

        /**
         * Emulate moving the mouse from one point to another on the screen, using the underlying Syn library.
         * @param {Object} options
         * @param {HTMLElement} from
         * @param {Object} cb
         */
        move : function (options, from, cb) {
            Syn.move(options, from, ariaUtilsFunction.bindCallback(cb));
        }
    }
});
