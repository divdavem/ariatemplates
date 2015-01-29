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

Aria.classDefinition({
    $classpath : "test.aria.templates.templateSyntaxError.TemplateSyntaxErrorTestCase",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["aria.templates.Parser"],
    $prototype : {

        _loadTemplate : function (classpath, cb) {
            var document = Aria.$window.document;
            var domElt = this.domElt = document.createElement("div");
            document.body.appendChild(domElt);
            Aria.loadTemplate({
                div : domElt,
                classpath : classpath
            }, {
                fn : cb,
                scope : this
            });
        },

        end : function () {
            this.domElt.parentNode.removeChild(this.domElt);
            this.notifyTestEnd();
        },

        getLastLoggedErrorRootCause : function () {
            var logAppender = aria.core.Log.getAppenders()[0];
            var logs = logAppender.getLogs();
            var lastError = logs[logs.length - 1];
            var cause = lastError.objOrErr;
            while (cause.cause) {
                cause = cause.cause;
            }
            return cause;
        },

        assertStringContains : function (mainString, subString) {
            this.assertTrue(mainString.indexOf(subString) > -1, "The error message '" + mainString
                    + "' does not contain the expected sub-string: '" + subString + "'");
        },

        testAsyncLoadTplWithError1 : function () {
            this._loadTemplate("test.aria.templates.templateSyntaxError.TemplateSyntaxErrorTpl1", this._afterLoadTemplate1);
        },

        _afterLoadTemplate1 : function (a, b) {
            this.assertErrorInLogs(aria.templates.Parser.STATEMENT_CLOSED_NOT_OPEN);
            var errorRootCause = this.getLastLoggedErrorRootCause() + "";
            this.assertStringContains(errorRootCause, "Please check the previous errors in the console for more details.");
            this.assertStringContains(errorRootCause, "test/aria/templates/templateSyntaxError/TemplateSyntaxErrorTpl1.tpl");
            this.assertErrorInLogs(aria.core.MultiLoader.LOAD_ERROR);
            this.assertFalse(a.success);
            this.end();
        },

        testAsyncLoadTplWithError2 : function () {
            this._loadTemplate("test.aria.templates.templateSyntaxError.TemplateSyntaxErrorTpl2", this._afterLoadTemplate2);
        },

        _afterLoadTemplate2 : function (a, b) {
            var errorRootCause = this.getLastLoggedErrorRootCause() + "";
            this.assertStringContains(errorRootCause, "SyntaxError");
            this.assertErrorInLogs(aria.core.MultiLoader.LOAD_ERROR);
            this.assertFalse(a.success);
            this.end();
        }

    }
});
