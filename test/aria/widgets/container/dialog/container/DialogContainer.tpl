/*
 * Copyright 2015 Amadeus s.a.s.
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

{Template {
   $classpath : "test.aria.widgets.container.dialog.container.DialogContainer",
   $css : ["test.aria.widgets.container.dialog.container.DialogContainerStyle"],
   $hasScript : true
}}

    {macro main ()}
        <div style="height:10000px;padding:10px;">
            <div style="height:1500px;">
            </div>
            <div>
                {call dialogButton("generalDialogModal", null, true)/}
                {call dialogButton("generalDialogNonModal", null, false)/}<br>
                <input> <br>
                <input> <br><br>
            </div>
            <div>
                {@aria:Tab {
                    tabId: "home",
                    bind: {
                        selectedTab: {
                            to: "activeTab",
                            inside: data
                        }
                    }
                }}Home (position relative){/@aria:Tab}
                {@aria:Tab {
                    tabId: "info",
                    bind: {
                        selectedTab: {
                            to: "activeTab",
                            inside: data
                        }
                    }
                }}Info (position static){/@aria:Tab}
                {@aria:Tab {
                    tabId: "details",
                    bind: {
                        selectedTab: {
                            to: "activeTab",
                            inside: data
                        }
                    }
                }}Details (position relative){/@aria:Tab}
            </div>
            <div style="border:1px solid black;">
                <div class="tabContent active" {id "home"/}>
                    <p><b>Home tab</b></p>
                    {call dialogButton("homeDialogModal", "home", true)/}
                    {call dialogButton("homeDialogNonModal", "home", false)/}<br>
                    <input> <br>
                    <input> <br>
                </div>
                <div class="tabContent" {id "info"/} style="position: static;">
                  {call dialogButton("infoDialogModal", "info", true)/}
                  {call dialogButton("infoDialogNonModal", "info", false)/}<br>
                  <input> <br>
                  <input> <br>
                </div>
                <div class="tabContent" {id "details"/}>
                  {call dialogButton("detailsDialogModal", "details", true)/}
                  {call dialogButton("detailsDialogNonModal", "details", false)/}<br>
                  <input> <br>
                  <input> <br>
                </div>
            </div>
        </div>
    {/macro}

    {macro dialogButton(name, containerId, modal)}
        {@aria:Button {
            label: "Toggle "+name,
            onclick: {
                fn: toggleDialog,
                args: name
            }
        }/}
        {@aria:Dialog {
            macro: {
                name: "dialogContent",
                args: [name]
            },
            movable: true,
            resizable: true,
            maximizable: true,
            modal: modal,
            containerId: containerId ? $getId(containerId) : null,
            bind: {
                center: {
                    to: name+"Center",
                    inside: data
                },
                xpos: {
                    to: name+"X",
                    inside: data
                },
                ypos: {
                    to: name+"Y",
                    inside: data
                },
                visible: {
                    to: name+"Visible",
                    inside: data
                }
            }
        }/}
    {/macro}

    {macro dialogContent(name)}
        This is dialog ${name}. <br>
        <input> <br>
        <input> <br>
    {/macro}

{/Template}
