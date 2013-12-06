Aria.tplScriptDefinition({
    $classpath : "test.aria.templates.multiautocomplete.MultiAutoCompleteTplScript",
    $dependencies : ["aria.resources.handlers.LCResourcesHandler"],
    $destructor : function () {
        if (this.handler) {
            this.handler.$dispose()
            this.handler = null;
        }
    },
    $prototype : {
        getResourceHandler : function () {
            var res = this.handler;
            if (!res) {
                res = this.handler = new aria.resources.handlers.LCResourcesHandler();
                res.setSuggestions([{
                            label : "Paris",
                            code : "PAR"
                        }, {
                            label : "London",
                            code : "LON"
                        }]);
            }
            return res;
        }
    }
});