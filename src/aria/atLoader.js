(function () {

    /**
     * atLoader.js
     * this script is used to synchronously load Aria Templates classes that are not included
     * in the AT package.
     * It is sufficient to insert the array of classes as the innerHTML of the tag 
     * used to load this script.
     * All the classes' dependencies have to be added to this array.
     * No comments or other sintax is allowed in it except for the array itself.
     *
     * i.e:
     *     <script type="text/javascript" src="../../src/aria/atLoader.js">
     *           ["aria/utils/Number.js", "aria/utils/environment/Number.js"]
     *     </script>
     */

    var document = Aria.$window.document;

    var getLastScript = function () {
        // When not in the "loading" mode, it is not reliable to use the last script to find the configuration
        // IE is using the "interactive" mode instead of "loading".
        if (document.readyState == "loading" || document.readyState == "interactive") {
            var scripts = document.getElementsByTagName('script');
            return scripts[scripts.length - 1];
        }
    };

    var script = document.currentScript || getLastScript();

    var dependencies = Aria.eval('return ' + script.innerHTML.trim());
    var map = {};

    for (var i = 0, l = dependencies.length; i < l; i++) {
        var dep = aria.core.DownloadMgr.resolveURL(dependencies[i]);
        if(map[dep] !== true) {
            document.write('<script type=\"text/javascript\" src=\"' + dep + '\"></script>');
            map[dep] = true;
        }        
    }

})();
