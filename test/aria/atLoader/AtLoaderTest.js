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

Aria.classDefinition({
    $classpath : "test.aria.atLoader.AtLoaderTest",
    $extends : "aria.jsunit.TestCase",
    $dependencies : ["aria.utils.FrameATLoader","aria.core.DownloadMgr"],
    $prototype : {
        testAsyncCheckAtLoader: function () {
            var window = Aria.$window;
            var document = window.document;

            window.frameworkHref = aria.utils.FrameATLoader.getFrameworkHref();
            debugger
            window.atLoaderHref = window.frameworkHref.replace(/\/([^\/]+)-([^\/-]+\.js)$/, "/atLoader-$2");
            window.atLoaderScript = aria.core.DownloadMgr.resolveURL("test/aria/atLoader/atLoader.js");
            var iFrame = document.createElement("iframe");
            iFrame.src = aria.core.DownloadMgr.resolveURL("test/aria/atLoader/atLoader.html");
            iFrame.style.cssText = "position: absolute; left: 10px; top: 100px; width: 500px; height: 500px;";
            document.body.appendChild(iFrame);
            this.waitFor({
                condition: function () {
                    return iFrame.contentWindow.document.getElementById("result");
                },
                callback: function () {
                    debugger
                }
            });
        }
    }
});
