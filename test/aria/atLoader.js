(function () {

    var err = [];
    function checkEqual(arg1, arg2, value1, value2) {
        if (value1 !== value2) {
            var msg = arg1 + ' is ' + value1 + ' while ' + arg2 + ' is ' + value2;
            err.push(msg);
            console.error(msg);
        }
    }

    function showResult() {
        var res, className;
        if (err.length > 0) {
            err.unshift('test FAILED')
            res = err.join('<br>');
            className = 'error';
        } else {
            res = 'test PASSED';
            className = 'success';
        }
        document.write('<h2 class=\"' + className + '\">' + res + '</h2>')
    }

    function testInjection() {
        var num = "55",
            convertedNum;

        Aria.load({
            classes : ['aria.utils.Number']
        });

        try {
            convertedNum = aria.utils.Number.toNumber(num);
        } catch (e) {
            console.error(e.message);
            err.push(e.message);
        }

        checkEqual('convertedNum', 'num', convertedNum, 55);
    }

    testInjection();
    showResult();

})();
