define([], function () {
    'use strict';

    return React.createClass({
        mixins: [Morearty.Mixin],
        render: function () {

            return (
                <div className='metrics-container'>
                    <button className='quad-button up-button'>Up</button>
                    <button className='quad-button down-button'>Down</button>
                </div>
            );
        }
    });
});
