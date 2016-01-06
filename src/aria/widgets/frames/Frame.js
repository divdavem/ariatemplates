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
var Aria = require("../../Aria");
var ariaUtilsDom = require("../../utils/Dom");


/**
 * The Frame class is a base class used by widgets which need a border.
 * @class aria.widgets.container.Frame
 */
module.exports = Aria.classDefinition({
    $classpath : 'aria.widgets.frames.Frame',
    /**
     * @param {aria.widgets.frames.CfgBeans:FrameCfg} cfg Frame configuration.
     */
    $constructor : function (cfg) {
        cfg.stateObject = cfg.skinObject.states[cfg.state].frame;
        /**
         * CSS prefix for the current skin class and state
         * @type String
         * @protected
         */
        this._cssPrefix = ['x', cfg.skinnableClass, '_', cfg.sclass, '_', cfg.state, "_"].join("");
        /**
         * Frame configuration.
         * @type aria.widgets.frames.CfgBeans:FrameCfg
         * @protected
         */
        this._cfg = cfg;
        /**
         * The width available for the client area. This value is set at the Frame creation time and may change when the
         * state changes. A value of -1 means that the content of the frame can have any width, the size of the frame
         * will be adapted.
         * @type Number
         */
        this.innerWidth = cfg.fullWidth ? -1 : cfg.width;
        /**
         * The width available for the client area. This value is set at the Frame creation time and may change when the
         * state changes. A value of -1 means that the content of the frame can have any height, the size of the frame
         * will be adapted.
         * @type Number
         */
        this.innerHeight = cfg.height;
        /**
         * The root element of the DOM structure generated by this frame. Is only available after the linkToDom method
         * have been called.
         * @type HTMLElement
         * @protected
         */
        this._domElt = null;
        /**
         * The last open DOM element generated by writeMarkupBegin (which directly contains child elements). have been
         * called.
         * @type HTMLElement
         * @protected
         */
        this._childRootElt = null;
        /**
         * The number of root dom elements generated by this frame (in writeMarkupBegin and writeMarkupEnd).
         * @type Number
         */
        this.domElementNbr = 1;
    },
    $destructor : function () {
        this._domElt = null;
        this._childRootElt = null;
    },
    $statics : {
        // ERROR MESSAGE:
        FRAME_INVALID_STATE : "Invalid state (%1) for the frame in this skinnable class (%2)."
    },
    $prototype : {
        /**
         * Generate the begining of the markup for this frame.
         * @param {aria.templates.MarkupWriter} out
         */
        writeMarkupBegin : function (out) {},

        /**
         * Generate the end of the markup for this frame.
         * @param {aria.templates.MarkupWriter} out
         */
        writeMarkupEnd : function (out) {},

        /**
         * Link this frame to a DOM element after the markup has been inserted in the DOM.
         * @param {HTMLElement} domElt The DOM element which corresponds to the first item inserted by the
         * writeMarkupBegin method.
         */
        linkToDom : function (domElt) {
            this.$assert(57, this._domElt == null);
            this._domElt = domElt;
        },

        /**
         * Return one of the DOM elements inside the frame. Must not be called before linkToDom has been called.
         * @param {Number} idx index of the child to retrieve. 0 means the first HTML element written after
         * writeMarkupBegin has returned.
         * @return {HTMLElement} the requested DOM element inside the frame
         */
        getChild : function (idx) {
            return ariaUtilsDom.getDomElementChild(this._childRootElt, idx);
        },

        /**
         * Checks if a state exists
         * @param {String} stateName
         * @return {Boolean}
         */
        checkState : function (stateName) {
            return !!this._cfg.skinObject.states[stateName];
        },

        /**
         * Change the state of the frame. Must not be called before linkToDom has been called.
         * @param {String} stateName name of the state
         */
        changeState : function (stateName) {
            var cfg = this._cfg;
            var newState = cfg.skinObject.states[stateName];
            if (newState == null) {
                this.$logError(this.FRAME_INVALID_STATE, [stateName, cfg.skinnableClass]);
                return;
            }
            cfg.state = stateName;
            cfg.stateObject = newState.frame;
            this._cssPrefix = ['x', cfg.skinnableClass, '_', cfg.sclass, '_', cfg.state, "_"].join("");
        },

        /**
         * Return the skin class object for this frame.
         * @return {Object} skin class object
         */
        getSkinObject : function () {
            return this._cfg.skinObject;
        },

        /**
         * Return the current state object inside the skin class.
         * @return {String} current state name
         */
        getStateName : function () {
            return this._cfg.state;
        },

        /**
         * Return the current state object inside the skin class.
         * @return {Object} state object (could also be retrieved with getSkinObject().states[getStateName()])
         */
        getStateObject : function () {
            return this._cfg.stateObject;
        },

        /**
         * Resize the frame to new dimensions.
         * @param {Number} width New width, or -1 to fit the content width
         * @param {Number} height New height, or -1 to fit the content height
         */
        resize : function (width, height) {
            var cfg = this._cfg;
            cfg.width = width;
            cfg.height = height;
        },

        /**
         * Method intended to be used by classes which extend this class. It reads the frame configuration (this._cfg),
         * the inner dimensions (this.innerWidth and this.innerHeight) and appends size info (actual width and height
         * and also CSS classes for scrollbars...) to the obj parameter, so that it is easier for each frame to set
         * this in the DOM (both at markup generation time and when updating the state of the frame).
         * @param {Object} obj object with style and className properties. This method sets the width property on this
         * object (e.g. "100px"), and appends to the className property the CSS classes (e.g. " xOverflowXAuto").
         * Moreover, if the style property is not null, the width is appended to it (e.g. "width:100px;").
         */
        _appendInnerSizeInfo : function (obj) {
            var overflowX = null, overflowY = null;
            if (this.innerWidth > -1) {
                obj.width = this.innerWidth + "px";
                if (obj.style != null) {
                    obj.style += "width:" + obj.width + ";";
                }
            } else {
                obj.width = "";
            }
            if (this.innerWidth > -1 || this._cfg.fullWidth) {
                overflowX = this._cfg.scrollBarX ? "Auto" : "Hidden";
                if (this._cfg.printOptions == "adaptX" || this._cfg.printOptions == "adaptXY") {
                    obj.className += " xPrintAdaptX";
                }
            }
            if (this.innerHeight > -1) {
                var height = obj.height = this.innerHeight + "px";
                if (obj.style != null) {
                    obj.style += "height:" + height + ";";
                }
                overflowY = this._cfg.scrollBarY ? "Auto" : "Hidden";
                if (this._cfg.printOptions == "adaptY" || this._cfg.printOptions == "adaptXY") {
                    obj.className += " xPrintAdaptY";
                }
            } else {
                obj.height = "";
            }
            var overflowValue = overflowX || overflowY;
            if (overflowValue) {
                // Specifying only overflow-x or only overflow-y makes Firefox behave strangely
                // (especially: it makes the corresponding element focusable)
                // Here we make sure both values are always specified:
                if (overflowX === overflowY || !overflowX || !overflowY) {
                    // when both values are the same or one is missing, use the value for both X and Y without distinction:
                    obj.className += " xOverflow" + overflowValue;
                } else {
                    // When both values are specified, use them as they are:
                    obj.className += " xOverflowX" + overflowX + " xOverflowY" + overflowY;
                }
            }
        }
    }
});
