define([], function () {
    "use strict";

    return {
        isFloat: function (n) {
            return n !== "" && !isNaN(n) && Math.round(n) != n;
        },
        isInt: function (n) {
            return n !== "" && !isNaN(n) && Math.round(n) == n;
        }
    };
});