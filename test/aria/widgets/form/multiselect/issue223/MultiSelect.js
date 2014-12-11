Aria.classDefinition({
    $classpath : "test.aria.widgets.form.multiselect.issue223.MultiSelect",
    $extends : "aria.jsunit.TemplateTestCase",
    $prototype : {

        /**
         * This method is always the first entry point to a template test Start the test by opening the MultiSelect
         * popup.
         */
        runTemplateTest : function () {

            this.ms = this.getInputField("ms1");
            this.msDom = this.getWidgetInstance('ms1')._domElt;

            this.assertTrue(this.ms.value === "");
            this.ms.focus();

            // Wait for the field to be focused
            this.waitFor({
                condition : function () {
                    return this.msDom.getElementsByTagName("span")[0].className.indexOf("xMultiSelect_std_normalFocused") > -1;
                },
                callback : {
                    fn : function() {
                        this.synEvent.type(this.ms, "AF,AC,DL,AY", {
                            fn : this._afterTyping,
                            scope : this
                        });
                    },
                    scope : this
                }
            });
        },

        _afterTyping : function () {
            this.assertTrue(this.ms.value === "AF,AC,DL,AY");

            this.getInputField("myTextField").focus();

            // Wait for the field to be blured
            this.waitFor({
                condition : function () {
                    return this.msDom.getElementsByTagName("span")[0].className.indexOf("xMultiSelect_std_normalFocused") == -1;
                },
                callback : {
                    fn : this.finishTest,
                    scope : this
                }
            });

        },

        finishTest : function () {
            this.assertTrue(this.ms.value === "AF,AC,DL");
            this.end();
        }
    }
});
