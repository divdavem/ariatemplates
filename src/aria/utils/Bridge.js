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
var Aria = require("../Aria");
var ariaUtilsAriaWindow = require("./AriaWindow");
var ariaUtilsJson = require("./Json");
var ariaUtilsFunction = require("./Function");
var ariaUtilsFrameATLoader = require("./FrameATLoader");
var ariaCoreDownloadMgr = require("../core/DownloadMgr");

/**
 * Creates a subwindow and load a module inside
 * @class aria.utils.Bridge
 */
module.exports = Aria.classDefinition({
    $classpath : 'aria.utils.Bridge',
    $events : {
        "forwardEvent" : {
            description : "Wrapper for an event to forward",
            properties : {
                event : "The forwarded event"
            }
        }
    },
    $constructor : function () {

        /**
         * Child window used to display analysers and controls
         * @protected
         * @type Window
         */
        this._subWindow = null;

        /**
         * Is bridge open, and subwindow created ?
         * @type Boolean
         */
        this.isOpen = false;

        /**
         * Classpath of the module controller to load in subwindow and classpath of root display. Also title
         *
         * <pre>
         *     {
         *         moduleCtrlClasspath : ...
         *         displayClasspath : ...
         *         title : ...
         *     }
         * </pre>
         *
         * @protected
         * @type Object
         */
        this._config = null;

        /**
         * Reference to the main module in subwindow
         * @protected
         * @type aria.templates.ModuleCtrl
         */
        this._moduleCtrlRef = null;

        /**
         * Reference to the root template context in subwindow
         * @protected
         * @type aria.templates.TemplateCtxt
         */
        this._rootTplCtxtRef = null;
    },
    $destructor : function () {
        this.close();
        this._subWindow = null;
    },
    $prototype : {

        /**
         * Create external display with given module controller classpath
         * @param {Object} config moduleControllerClasspath & displayClasspath
         * @param {String} options for opening the subwindow. Default is "width=1024, height=800"
         */
        open : function (config, options) {

            if (this._subWindow) {
                // TODO: log error
                return;
            }

            // default options
            if (!options) {
                options = "width=1024, height=800";
            }

            // create sub window. Use date to create a new one each time
            this._subWindow = Aria.$frameworkWindow.open("", config.title + ("" + (new Date()).getTime()), options);

            // The _subWindow can be null if the popup blocker is enabled in the browser
            if (this._subWindow == null) {
                return;
            }
            // this is for creating the same window (usefull for debugging)
            // this._subWindow = window.open("", config.title, options);

            ariaUtilsFrameATLoader.loadAriaTemplatesInFrame(this._subWindow, {
                fn: this.moduleStart,
                scope: this
            }, {
                iframePageCss: "html,body{padding:0;margin:0;overflow: hidden;}"
            });

            this._config = config;
            ariaUtilsAriaWindow.attachWindow();
            ariaUtilsAriaWindow.$on({
                "unloadWindow" : this._onMainWindowUnload,
                scope : this
            });
        },

        /**
         * Called from the main window when it is being unloaded.
         * @param {Object} e event object
         */
        _onMainWindowUnload : function (e) {
            // automatically close the associated window
            this.close();
        },

        /**
         * Function called from the sub window to start the module
         */
        moduleStart : function () {
            // start working in subwindow
            var Aria = this._subWindow.Aria, aria = this._subWindow.aria;
            this._subWindow.onunload = ariaUtilsFunction.bind(this.close, this);

            // link the url map and the root map in the sub-window
            // to the corresponding maps in the main window:
            aria.core.DownloadMgr._urlMap = ariaCoreDownloadMgr._urlMap;
            aria.core.DownloadMgr._rootMap = ariaCoreDownloadMgr._rootMap;

            Aria.setRootDim({
                width : {
                    min : 16
                },
                height : {
                    min : 16
                }
            });

            Aria.load({
                classes : ['aria.templates.ModuleCtrlFactory'],
                oncomplete : {
                    fn : this._templatesReady,
                    scope : this
                }
            });

        },

        /**
         * Called when templates package is ready. It will create associated module.
         * @protected
         */
        _templatesReady : function () {
            // continue working in subwindow
            // var Aria = this._subWindow.Aria;
            var aria = this._subWindow.aria;

            // creates module instance first to be able to dispose it when window close
            aria.templates.ModuleCtrlFactory.createModuleCtrl({
                classpath : this._config.moduleCtrlClasspath,
                autoDispose : false,
                initArgs : {
                    bridge : this
                }
            }, {
                fn : this._moduleLoaded,
                scope : this
            }, false);
        },

        /**
         * Callback when module source is loaded
         * @param {Object} moduleCtrl and moduleCtrlPrivate
         * @protected
         */
        _moduleLoaded : function (moduleCtrlObject) {
            // finish working in subwindow
            var window = this._subWindow;
            var document = window.document;
            var Aria = window.Aria; // , aria = this._subWindow.aria;

            var div = document.createElement("div");
            div.setAttribute("id", "main");
            document.body.appendChild(div);

            var moduleCtrl = moduleCtrlObject.moduleCtrlPrivate;
            Aria.loadTemplate({
                classpath : this._config.displayClasspath,
                div : div,
                moduleCtrl : moduleCtrl,
                width : {
                    min : 16
                },
                height : {
                    min : 16
                }
            }, {
                fn : this._displayLoaded,
                scope : this
            });
            this._moduleCtrlRef = moduleCtrl;
            this.isOpen = true;
        },

        /**
         * Callback when root display is loaded
         * @protected
         */
        _displayLoaded : function (status) {
            this._rootTplCtxtRef = status.templateCtxt;
        },

        /**
         * Close subwindow and restaure environment
         */
        close : function () {

            if (this.isOpen) {
                if (this._moduleCtrlRef) {
                    this._moduleCtrlRef.$dispose();
                    this._moduleCtrlRef = null;
                }
                if (this._rootTplCtxtRef) {
                    this._rootTplCtxtRef.$dispose();
                    this._rootTplCtxtRef = null;
                }

                this._subWindow.close();
                this._subWindow = null;

                ariaUtilsAriaWindow.$unregisterListeners(this);
                ariaUtilsAriaWindow.detachWindow();

                // restaure hijacked function
                this.isOpen = false;
            }
        },

        /**
         * Returns main window document
         * @return {HTMLElement}
         */
        getDocument : function () {
            return Aria.$window.document;
        },

        /**
         * Returns aria in the main window
         * @return {Object}
         */
        getAriaPackage : function () {
            return aria;
        },

        /**
         * Returns the Aria object in the main window
         * @return {Object}
         */
        getAria : function () {
            return Aria;
        }
    }
});
