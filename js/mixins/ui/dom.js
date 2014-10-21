define([], function () {
    'use strict';

    return {
        getOffset: function( el ) {
            var _x = 0,
                _y = 0;

            while ( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
                _x += el.offsetLeft - el.scrollLeft;
                _y += el.offsetTop - el.scrollTop;
                el = el.offsetParent;
            }

            return { top: _y, left: _x };
        }
    };
});