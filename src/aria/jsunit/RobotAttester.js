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

/**
 * This class is still experimental, its interface may change without notice. Implementation of the aria.jsunit.IRobot
 * interface through calls to the attester robot system.
 * @private
 */
Aria.classDefinition({
    $classpath : 'aria.jsunit.RobotAttester',
    $implements : ['aria.jsunit.IRobot'],
    $singleton : true,
    $statics : {
        // Keyboard keys:
        KEYS : {
            VK_0 : 48,
            VK_1 : 49,
            VK_2 : 50,
            VK_3 : 51,
            VK_4 : 52,
            VK_5 : 53,
            VK_6 : 54,
            VK_7 : 55,
            VK_8 : 56,
            VK_9 : 57,
            VK_A : 65,
            VK_ACCEPT : 30,
            VK_ADD : 107,
            VK_AGAIN : 65481,
            VK_ALL_CANDIDATES : 256,
            VK_ALPHANUMERIC : 240,
            VK_ALT : 18,
            VK_ALT_GRAPH : 65406,
            VK_AMPERSAND : 150,
            VK_ASTERISK : 151,
            VK_AT : 512,
            VK_B : 66,
            VK_BACK_QUOTE : 192,
            VK_BACK_SLASH : 92,
            VK_BACK_SPACE : 8,
            VK_BEGIN : 65368,
            VK_BRACELEFT : 161,
            VK_BRACERIGHT : 162,
            VK_C : 67,
            VK_CANCEL : 3,
            VK_CAPS_LOCK : 20,
            VK_CIRCUMFLEX : 514,
            VK_CLEAR : 12,
            VK_CLOSE_BRACKET : 93,
            VK_CODE_INPUT : 258,
            VK_COLON : 513,
            VK_COMMA : 44,
            VK_COMPOSE : 65312,
            VK_CONTEXT_MENU : 525,
            VK_CONTROL : 17,
            VK_CONVERT : 28,
            VK_COPY : 65485,
            VK_CUT : 65489,
            VK_D : 68,
            VK_DEAD_ABOVEDOT : 134,
            VK_DEAD_ABOVERING : 136,
            VK_DEAD_ACUTE : 129,
            VK_DEAD_BREVE : 133,
            VK_DEAD_CARON : 138,
            VK_DEAD_CEDILLA : 139,
            VK_DEAD_CIRCUMFLEX : 130,
            VK_DEAD_DIAERESIS : 135,
            VK_DEAD_DOUBLEACUTE : 137,
            VK_DEAD_GRAVE : 128,
            VK_DEAD_IOTA : 141,
            VK_DEAD_MACRON : 132,
            VK_DEAD_OGONEK : 140,
            VK_DEAD_SEMIVOICED_SOUND : 143,
            VK_DEAD_TILDE : 131,
            VK_DEAD_VOICED_SOUND : 142,
            VK_DECIMAL : 110,
            VK_DELETE : 127,
            VK_DIVIDE : 111,
            VK_DOLLAR : 515,
            VK_DOWN : 40,
            VK_E : 69,
            VK_END : 35,
            VK_ENTER : 10,
            VK_EQUALS : 61,
            VK_ESCAPE : 27,
            VK_EURO_SIGN : 516,
            VK_EXCLAMATION_MARK : 517,
            VK_F : 70,
            VK_F1 : 112,
            VK_F10 : 121,
            VK_F11 : 122,
            VK_F12 : 123,
            VK_F13 : 61440,
            VK_F14 : 61441,
            VK_F15 : 61442,
            VK_F16 : 61443,
            VK_F17 : 61444,
            VK_F18 : 61445,
            VK_F19 : 61446,
            VK_F2 : 113,
            VK_F20 : 61447,
            VK_F21 : 61448,
            VK_F22 : 61449,
            VK_F23 : 61450,
            VK_F24 : 61451,
            VK_F3 : 114,
            VK_F4 : 115,
            VK_F5 : 116,
            VK_F6 : 117,
            VK_F7 : 118,
            VK_F8 : 119,
            VK_F9 : 120,
            VK_FINAL : 24,
            VK_FIND : 65488,
            VK_FULL_WIDTH : 243,
            VK_G : 71,
            VK_GREATER : 160,
            VK_H : 72,
            VK_HALF_WIDTH : 244,
            VK_HELP : 156,
            VK_HIRAGANA : 242,
            VK_HOME : 36,
            VK_I : 73,
            VK_INPUT_METHOD_ON_OFF : 263,
            VK_INSERT : 155,
            VK_INVERTED_EXCLAMATION_MARK : 518,
            VK_J : 74,
            VK_JAPANESE_HIRAGANA : 260,
            VK_JAPANESE_KATAKANA : 259,
            VK_JAPANESE_ROMAN : 261,
            VK_K : 75,
            VK_KANA : 21,
            VK_KANA_LOCK : 262,
            VK_KANJI : 25,
            VK_KATAKANA : 241,
            VK_KP_DOWN : 225,
            VK_KP_LEFT : 226,
            VK_KP_RIGHT : 227,
            VK_KP_UP : 224,
            VK_L : 76,
            VK_LEFT : 37,
            VK_LEFT_PARENTHESIS : 519,
            VK_LESS : 153,
            VK_M : 77,
            VK_META : 157,
            VK_MINUS : 45,
            VK_MODECHANGE : 31,
            VK_MULTIPLY : 106,
            VK_N : 78,
            VK_NONCONVERT : 29,
            VK_NUM_LOCK : 144,
            VK_NUMBER_SIGN : 520,
            VK_NUMPAD0 : 96,
            VK_NUMPAD1 : 97,
            VK_NUMPAD2 : 98,
            VK_NUMPAD3 : 99,
            VK_NUMPAD4 : 100,
            VK_NUMPAD5 : 101,
            VK_NUMPAD6 : 102,
            VK_NUMPAD7 : 103,
            VK_NUMPAD8 : 104,
            VK_NUMPAD9 : 105,
            VK_O : 79,
            VK_OPEN_BRACKET : 91,
            VK_P : 80,
            VK_PAGE_DOWN : 34,
            VK_PAGE_UP : 33,
            VK_PASTE : 65487,
            VK_PAUSE : 19,
            VK_PERIOD : 46,
            VK_PLUS : 521,
            VK_PREVIOUS_CANDIDATE : 257,
            VK_PRINTSCREEN : 154,
            VK_PROPS : 65482,
            VK_Q : 81,
            VK_QUOTE : 222,
            VK_QUOTEDBL : 152,
            VK_R : 82,
            VK_RIGHT : 39,
            VK_RIGHT_PARENTHESIS : 522,
            VK_ROMAN_CHARACTERS : 245,
            VK_S : 83,
            VK_SCROLL_LOCK : 145,
            VK_SEMICOLON : 59,
            VK_SEPARATOR : 108,
            VK_SHIFT : 16,
            VK_SLASH : 47,
            VK_SPACE : 32,
            VK_STOP : 65480,
            VK_SUBTRACT : 109,
            VK_T : 84,
            VK_TAB : 9,
            VK_U : 85,
            VK_UNDEFINED : 0,
            VK_UNDERSCORE : 523,
            VK_UNDO : 65483,
            VK_UP : 38,
            VK_V : 86,
            VK_W : 87,
            VK_WINDOWS : 524,
            VK_X : 88,
            VK_Y : 89,
            VK_Z : 90
        }
    },
    $prototype : {

        /**
         * Return true if the robot is most likely usable (Java enabled).
         */
        isUsable : function () {
            var attester = Aria.$frameworkWindow.top.attester;
            this._robot = attester && attester.robot;
            return !!this._robot;
        },

        /**
         * Initializes the robot. Do not call any other method of the robot (except isUsable) before calling this method
         * and waiting for it to call its callback.
         * @param {aria.core.CfgBeans:Callback} callback called when the robot is ready to be used.
         */
        initRobot : function (cb) {
            if (this.isUsable()) {
                this.$callback(cb);
            }
        },

        /**
         * Translates a mouse position from coordinates relative to the viewport to screen coordinates.
         * @param {Object} position position given as an object with x and y properties, in viewport coordinates
         * @return {Object} position given as an object with x and y properties, in screen coordinates
         */
        _translateCoordinates : function (position) {
            var window = Aria.$window;
            var screenX = window.screenX != null ? window.screenX : window.screenLeft;
            var screenY = window.screenY != null ? window.screenY : window.screenTop;
            var robot = this._robot;
            return {
                x : position.x + robot.offsetX + screenX,
                y : position.y + robot.offsetY + screenY
            };
        },

        _createCallback : function (callback) {
            var self = this;
            return function (result) {
                if (result.error) {
                    this.$logError(result.error);
                }
                self.$callback(callback);
            };
        },

        /**
         * Sets the mouse position, with coordinates relative to the viewport.
         * @param {Object} position position where to set the mouse (given as an object with x and y properties, in
         * viewport coordinates)
         * @param {aria.core.CfgBeans:Callback} callback
         */
        mouseMove : function (position, callback) {
            var translatedPosition = this._translateCoordinates(position);
            this.absoluteMouseMove(translatedPosition, callback);
        },

        /**
         * Sets the mouse position, with screen coordinates.
         * @param {Object} position position where to set the mouse (given as an object with x and y properties, in
         * screen coordinates)
         * @param {aria.core.CfgBeans:Callback} callback
         */
        absoluteMouseMove : function (position, callback) {
            this._robot.mouseMove(position.x, position.y, this._createCallback(callback));
        },

        /**
         * Smoothly moves the mouse from one position to another, with coordinates relative to the viewport.
         * @param {Object} fromPosition initial position where to set the mouse first (given as an object with x and y
         * properties, in viewport coordinates)
         * @param {Object} toPosition final position of mouse (given as an object with x and y properties, in viewport
         * coordinates)
         * @param {Number} duration Time in ms for the mouse move.
         * @param {aria.core.CfgBeans:Callback} callback
         */
        smoothMouseMove : function (from, to, duration, cb) {
            var translatedFromPosition = this._translateCoordinates(from);
            var translatedToPosition = this._translateCoordinates(to);
            this.smoothAbsoluteMouseMove(translatedFromPosition, translatedToPosition, duration, cb);
        },

        /**
         * Smoothly moves the mouse from one position to another, with PhantomJS screen coordinates.
         * @param {Object} fromPosition initial position where to set the mouse first (given as an object with x and y
         * properties, in PhantomJS screen coordinates)
         * @param {Object} toPosition final position of mouse (given as an object with x and y properties, in PhantomJS
         * screen coordinates)
         * @param {Number} duration Time in ms for the mouse move.
         * @param {aria.core.CfgBeans:Callback} callback
         */
        smoothAbsoluteMouseMove : function (from, to, duration, cb) {
            this._robot.smoothMouseMove(from.x, from.y, to.x, to.y, duration, this._createCallback(cb));
        },

        /**
         * Simulates a mouse button press.
         * @param {Number} button Button to be pressed (should be the value of aria.jsunit.Robot.BUTTONx_MASK, with x
         * replaced by 1, 2 or 3).
         * @param {aria.core.CfgBeans:Callback} callback
         */
        mousePress : function (button, cb) {
            this._robot.mousePress(button, this._createCallback(cb));
        },

        /**
         * Simulates a mouse button released.
         * @param {Number} button Button to be released (should be the value of aria.jsunit.Robot.BUTTONx_MASK, with x
         * replaced by 1, 2 or 3).
         * @param {aria.core.CfgBeans:Callback} callback
         */
        mouseRelease : function (button, cb) {
            this._robot.mouseRelease(button, this._createCallback(cb));
        },

        /**
         * This method is not implemented. It logs an error.
         */
        mouseWheel : function (wheelAmt, cb) {
            this._robot.mouseWheel(wheelAmt, this._createCallback(cb));
        },

        /**
         * Simulates a keyboard key press.
         * @param {MultiTypes} key specifies which key should be pressed. It can be any value among the ones in the KEYS
         * property.
         * @param {aria.core.CfgBeans:Callback} callback
         */
        keyPress : function (keyCode, cb) {
            this._robot.keyPress(keyCode, this._createCallback(cb));
        },

        /**
         * Simulates a keyboard key release.
         * @param {MultiTypes} key specifies which key should be released. It can be any value among the ones in the
         * KEYS property.
         * @param {aria.core.CfgBeans:Callback} callback
         */
        keyRelease : function (keyCode, cb) {
            this._robot.keyRelease(keyCode, this._createCallback(cb));
        }

    }
});
