define([
    // mixins
    'mixins/sync/sync-layer'
], function (
    sync_layer_mixin
    ) {
    'use strict';

    return React.createClass({
        mixins: [Morearty.Mixin, sync_layer_mixin],
        toggleSwitch: function (command) {
            this.fetch({
                model: this.getDefaultBinding(),
                serviceId: 'devices'
            }, command);
            return false;
        },
        render: function () {
            return (
                <div className='metrics-container'>
                    <span
                        className='switch-door bubble-door active'
                        onClick={this.toggleSwitch.bind(null, 'on')}
                    >
                        <span className='bubble'></span>
                    </span>
                </div>
            );
        }
    });
});
