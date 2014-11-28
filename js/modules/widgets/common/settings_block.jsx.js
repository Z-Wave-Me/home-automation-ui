define([], function () {
    "use strict";

    return React.createClass({
        onClickGear: function () {
            console.log('click_on_gear');
        },
        render: function () {
            return <span className='gear fa fa-gear'></span>
        }
    });
});