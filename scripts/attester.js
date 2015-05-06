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

var browser = process.env.BROWSER || "phantomjs";
var seleniumServer = process.env.SELENIUM_SERVER;
var useSelenium = (process.env.USE_SELENIUM == "true" && !!seleniumServer);
var travis = (process.env.TRAVIS == "true");
var noPhantomjs = false;
var phantomjsInstances = "0";
var seleniumJavaRobotArgs = ["--auto-restart"];
var seleniumJavaRobotInstances = 0;

var appendCapability = function (name, value) {
    if (value) {
        seleniumJavaRobotArgs.push("-C" + name + "=" + value);
    }
};

process.argv = process.argv.filter(function (arg) {
    if (arg == "--no-phantomjs") {
        noPhantomjs = true;
        return false;
    }
    return true;
});

if (noPhantomjs && browser == "phantomjs") {
    browser = travis ? "firefox" : "chrome";
}

if (browser != "none") {
    if (useSelenium) {
        seleniumJavaRobotArgs.push("--selenium-server", seleniumServer);
        appendCapability("platform", process.env.BROWSER_PLATFORM);
        appendCapability("version", process.env.BROWSER_VERSION);
        appendCapability("name", "Aria Templates test");
        appendCapability("tunnel-identifier", process.env.TRAVIS_JOB_NUMBER);
        appendCapability("build", process.env.TRAVIS_BUILD_NUMBER);
        seleniumJavaRobotInstances = 2;
    } else if (browser == "phantomjs") {
        phantomjsInstances = "2";
    } else {
        // only one instance is possible
        seleniumJavaRobotInstances = 1;
    }
    seleniumJavaRobotArgs.push("--browser", browser);
}

process.argv.push("--phantomjs-instances", phantomjsInstances);

if (seleniumJavaRobotInstances > 0) {
    var seleniumJavaRobot = require("selenium-java-robot").exec;
    var registerChildProcess = require("attester/lib/util/child-processes").register;
    var attester = require("attester");

    attester.event.on("launcher.connect", function(slaveURL) {
        var args = seleniumJavaRobotArgs.concat(["--url", slaveURL]);
        console.log("Starting " + seleniumJavaRobotInstances + " instance(s) of:\n selenium-java-robot '" + args.join("' '") + "'");
        var robotProcess;

        for (var i = 0; i < seleniumJavaRobotInstances; i++) {
            robotProcess = seleniumJavaRobot(args, {
                stdio: "pipe"
            });
            registerChildProcess(robotProcess);
            robotProcess.stdout.pipe(process.stdout);
            robotProcess.stderr.pipe(process.stderr);
        }
    });
}

require("attester/bin/attester");
