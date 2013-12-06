Aria.classDefinition({
    $classpath : "aria.widgets.form.MultiAutoComplete",
    $extends : "aria.widgets.form.AutoComplete",
    $dependencies : ["aria.widgets.controllers.MultiAutoCompleteController"],
    $css : ["aria.widgets.form.MultiAutoCompleteStyle"],
    $constructor : function (cfg, ctxt, lineNumber, controllerParam) {
        var controller = controllerParam || new aria.widgets.controllers.MultiAutoCompleteController();
        this.$AutoComplete.$constructor.call(this, cfg, ctxt, lineNumber, controller);
    },
    $prototype : {
        _cfgBean : "aria.widgets.CfgBeans.AutoCompleteCfg",
        _skinnableClass : "MultiAutoComplete",

        _inputWithFrameMarkup : function (out) {
            out.write("<span>");
            this.$AutoComplete._inputWithFrameMarkup.call(this, out);
            out.write("</span>");
        },

        _initInputMarkup : function (elt) {
            this.$AutoComplete._initInputMarkup.call(this, elt);
            this._multiOptionsSpan = this._frame.getChild(0);
            this._textInputField = this._multiOptionsSpan.firstChild;
        }
    }
});