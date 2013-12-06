Aria.classDefinition({
    $classpath : "aria.widgets.controllers.MultiAutoCompleteController",
    $extends : "aria.widgets.controllers.AutoCompleteController",
    $constructor : function () {
        this.$AutoCompleteController.$constructor.call(this);

        this._dataModel.globalValue = [];
    },
    $prototype : {

        checkText : function (text) {
            return this._adaptReport(this.$AutoCompleteController.checkText.call(this, text));
        },

        checkValue : function (value) {
            if (value instanceof Array) {
                value = value[0];
            }
            return this._adaptReport(this.$AutoCompleteController.checkValue.call(this, value));
        },

        checkKeyStroke : function (charCode, keyCode, currentText, caretPosStart, caretPosEnd, event) {
            return this._adaptReport(this.$AutoCompleteController.checkKeyStroke.call(this, charCode, keyCode, currentText, caretPosStart, caretPosEnd, event));
        },

        _adaptReport : function (report) {
            if (report) {
                if (report.value == null) {
                    report.value = []
                } else {
                    report.value = [report.value];
                }
            }
            return report;
        },

        _raiseReport : function (report, arg) {
            this._adaptReport(report);
            this.$AutoCompleteController._raiseReport.call(this, report, arg);
        }
    }
});