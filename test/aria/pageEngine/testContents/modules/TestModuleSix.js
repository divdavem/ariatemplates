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
 * Test Module
 */
Aria.classDefinition({
    $classpath : "test.aria.pageEngine.testContents.modules.TestModuleSix",
    $extends : "aria.templates.ModuleCtrl",
    $implements : ["test.aria.pageEngine.testContents.modules.TestModuleInterface"],
    $constructor : function () {
        this.$ModuleCtrl.constructor.call(this);
    },
    $destructor : function () {
        this.$ModuleCtrl.$destructor.call(this);
    },
    $prototype : {
        $publicInterfaceName : "test.aria.pageEngine.testContents.modules.TestModuleInterface",

        triggerNavigation : function () {
            this.$raiseEvent({
                name : "navigate",
                page : {
                    pageId : "AAAA"
                }
            });

        }
    }
});
