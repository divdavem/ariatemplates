/*
 * Copyright 2017 Amadeus s.a.s.
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
var jv = require("../core/JsonValidator");
var fastNormalizers = require("../core/JsonTypesCheck").fastNormalizers;
var ariaUtilsString = require("./String");
var ariaUtilsType = require("./Type");
var asyncRequire = require('noder-js/asyncRequire').create(module);

var getNamespaceLogicalPath = function (namespace) {
    if (typeof namespace !== "string") {
        namespace = namespace.$package;
    }
    return Aria.getLogicalPath(namespace, ".js");
};

var Code = function (code) {
    this.code = code;
};

var namespacesReplacer = function (path, value) {
    if (path.length === 1) {
        return new Code("require(" + ariaUtilsString.stringify(getNamespaceLogicalPath(value)) + ")");
    }
    return value;
};

var variablesMgr = function () {
    var counter = 0;
    var out = null;
    return {
        createVariable: function (value) {
            if (!out) {
                out = ["var "];
            } else {
                out.push(",\n");
            }
            var name = "v" + counter;
            counter++;
            out.push(name, "=", value);
            return name;
        },
        getCode: function () {
            var res = "";
            if (out) {
                out.push(";");
                res = out.join("");
                out = null;
            }
            return res;
        }
    };
};

var stringify = function (rootValue, filter, replacer) {
    var out = [];
    var processValue = function (path, value) {
        if (replacer) {
            value = replacer(path, value, rootValue);
        }
        if (value instanceof Code) {
            out.push(value.code);
        } else if (ariaUtilsType.isArray(value)) {
            out.push("[");
            var first = true;
            for (var i = 0, l = value.length; i < l; i++) {
                var subPath = path.concat([i]);
                var subValue = value[i];
                if (filter(subPath, subValue, rootValue)) {
                    if (first) {
                        first = false;
                    } else {
                        out.push(",");
                    }
                    processValue(subPath, subValue);
                }
            }
            out.push("]");
        } else if (ariaUtilsType.isObject(value)) {
            out.push("{");
            var first = true;
            for (var key in value) {
                if (value.hasOwnProperty(key)) {
                    var subPath = path.concat([key]);
                    var subValue = value[key];
                    if (filter(subPath, subValue, rootValue)) {
                        if (first) {
                            first = false;
                        } else {
                            out.push(",");
                        }
                        out.push(ariaUtilsString.stringify(key), ":");
                        processValue(subPath, subValue);
                    }
                }
            }
            out.push("}");
        } else if (ariaUtilsType.isString(value)) {
            out.push(ariaUtilsString.stringify(value));
        } else if (value == null || ariaUtilsType.isBoolean(value) || ariaUtilsType.isNumber(value) || isNaN(value) || ariaUtilsType.isFunction(value) || ariaUtilsType.isRegExp(value)) {
            out.push(value + "");
        } else {
            throw new Error("Unexpected value to stringify: " + value);
        }
    };

    processValue([], rootValue);
    return out.join("");
};

var excludedProperties = {
    $properties: true,
    $contentType: true,
    $keyType: true,
    $contentTypes: true
};
excludedProperties[jv._MD_TYPENAME] = true;
excludedProperties[jv._MD_PARENTDEF] = true;
excludedProperties[jv._MD_BASETYPE] = true;

var docExcludedProperties = {
    $description: true,
    $sample: true
};

var onlyFastNormIncludedProperties = {
    $fastNorm: true,
    $getDefault: true
};

var getTypeName = function (bean) {
    return bean[jv._MD_TYPENAME];
};

var getParentBean = function (bean) {
    return bean[jv._MD_PARENTDEF];
};

var WeakMap = Aria.$global.WeakMap || (function () {
    // mini weak map implementation for our needs
    var weakMapCounter = 0;
    var WeakMap = function () {
        this._key = "aria.utils.BeanExtractor:weakMap" + weakMapCounter;
        weakMapCounter++;
    };
    WeakMap.prototype = {
        'get': function (obj) {
            return obj[this._key];
        },
        'set': function (obj, value) {
            obj[this._key] = value;
        }
    };
    return WeakMap;
})();

var globalFnMap = new WeakMap();
for (var key in fastNormalizers) {
    if (fastNormalizers.hasOwnProperty(key)) {
        globalFnMap.set(fastNormalizers[key], "fastNormalizers." + key);
    }
}
globalFnMap.set(Aria.returnNull, "Aria.returnNull");

module.exports = Aria.classDefinition({
    $classpath: "aria.utils.BeanExtractor",
    $singleton: true,
    $prototype: {
        extract: function (logicalPath, config) {
            return asyncRequire(logicalPath).spreadSync(function (beanPackage) {
                if (!(beanPackage.$package && beanPackage.$namespaces && beanPackage.$beans) || beanPackage.$package === jv._BASE_TYPES_PACKAGE) {
                    return {
                        skip: true,
                        text: null
                    };
                }
                config = config || {};
                config.removeDoc = "removeDoc" in config ? !!config.removeDoc : true;
                config.removeMultiTypes = "removeMultiTypes" in config ? !!config.removeMultiTypes : true;
                config.onlyFastNorm = "onlyFastNorm" in config ? !!config.onlyFastNorm : true;
                var variables = variablesMgr();
                var subBeansCode = [];
                var toPostProcess = [];
                var packagePathPrefix = beanPackage.$package + ".";
                var packagePathPrefixLength = packagePathPrefix.length;
                var referencedBeans = {};
                var beanStringifyFilter = function (path) {
                    if (path.length === 1) {
                        var name = path[0];
                        if (config.onlyFastNorm) {
                            return onlyFastNormIncludedProperties.hasOwnProperty(name);
                        }
                        if (excludedProperties.hasOwnProperty(name)) {
                            return false;
                        }
                        if (config.removeDoc && docExcludedProperties.hasOwnProperty(name)) {
                            return false;
                        }
                    }
                    return true;
                };
                var localFnMap = new WeakMap();
                var beanPropertiesReplacer = function (path, value, bean) {
                    if (ariaUtilsType.isFunction(value)) {
                        var varName = localFnMap.get(value);
                        if (!varName) {
                            var expression = globalFnMap.get(value);
                            if (!expression) {
                                var parentBean = getParentBean(bean);
                                if (value === parentBean.$fastNorm) {
                                    expression = getVariable(processBean(parentBean)) + ".$fastNorm";
                                } else {
                                    expression = value.toString();
                                }
                            }
                            varName = variables.createVariable(expression);
                            localFnMap.set(value, varName);
                        }
                        return new Code(varName);
                    }
                    return value;
                };

                var getVariable = function (beanInfo) {
                    if (!beanInfo.variable) {
                        throw new Error("Invalid recursive structure in " + getTypeName(beanInfo.bean));
                    }
                    return beanInfo.variable;
                };
                var processSubBean = function (beanInfo, key) {
                    var subBean = beanInfo.bean[key];
                    if (subBean) {
                        subBeansCode.push(getVariable(beanInfo), ".", key, "=", getVariable(processBean(subBean)), ";");
                    }
                };
                var processSubBeansCollection = function (beanInfo, key) {
                    var collection = beanInfo.bean[key];
                    if (collection) {
                        var parentBean = getParentBean(beanInfo.bean);
                        if (collection === parentBean[key]) {
                            var parentBeanInfo = processBean(parentBean);
                            subBeansCode.push(getVariable(beanInfo), ".", key, "=", getVariable(parentBeanInfo), ".", key, ";");
                        } else {
                            subBeansCode.push(getVariable(beanInfo), ".", key, "=", processBeansCollection(collection), ";");
                        }
                    }
                };
                var processBean = function (bean) {
                    var typeName = getTypeName(bean);
                    var beanInfo = referencedBeans[typeName];
                    if (!beanInfo) {
                        beanInfo = referencedBeans[typeName] = {
                            bean: bean
                        };
                        var value;
                        var internalBean = typeName.substr(0, packagePathPrefixLength) === packagePathPrefix;
                        if (internalBean) {
                            var processedParentBean = processBean(getParentBean(bean));
                            var out = ["registerBean(", ariaUtilsString.stringify(typeName.substr(packagePathPrefixLength)), ",", getVariable(processedParentBean)];
                            var stringifiedBean = stringify(bean, beanStringifyFilter, beanPropertiesReplacer);
                            if (stringifiedBean !== "{}") {
                                out.push(",", stringifiedBean);
                            }
                            out.push(")");
                            value = out.join("");
                            toPostProcess.push(beanInfo);
                        } else {
                            value = "getBean(" + ariaUtilsString.stringify(typeName) + ")";
                        }
                        beanInfo.variable = variables.createVariable(value);
                    }
                    return beanInfo;
                };
                var postProcessBeanInfo = function (beanInfo) {
                    processSubBean(beanInfo, "$contentType");
                    processSubBean(beanInfo, "$keyType");
                    processSubBeansCollection(beanInfo, "$properties");
                    if (Aria.debug && !config.removeMultiTypes) {
                        processSubBeansCollection(beanInfo, "$contentTypes");
                    }
                };
                var beanVariableReplacer = function (path, value) {
                    if (path.length === 1) {
                        return new Code(getVariable(processBean(value)));
                    }
                    return value;
                };
                var processBeansCollection = function (beans) {
                    return stringify(beans, Aria.returnTrue, beanVariableReplacer);
                };

                var output = processBeansCollection(beanPackage.$beans);
                if (config.onlyFastNorm) {
                    output = "{}";
                }
                while (toPostProcess.length > 0) {
                    postProcessBeanInfo(toPostProcess.shift());
                }
                return {
                    skip: false,
                    text: [
                        'var Aria = require("ariatemplates/Aria");\n',
                        'module.exports = Aria.beanDefinitions({\n',
                            '$package:', ariaUtilsString.stringify(beanPackage.$package),',\n',
                            '$namespaces:', stringify(beanPackage.$namespaces, Aria.returnTrue, namespacesReplacer), ',\n',
                            '$compiled:function(registerBean, getBean, fastNormalizers){\n',
                                variables.getCode(), subBeansCode.join(""), "\n",
                                "return ", output, ";\n",
                            '}\n',
                        '});\n'
                    ].join("")
                };
            });
        }
    }
});