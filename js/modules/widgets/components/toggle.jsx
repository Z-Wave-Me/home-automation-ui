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
            var binding = this.getDefaultBinding(),
                rearrange_showing = this.getBinding('footer').get('rearrange_showing');

            return (
                <div className={'widget ' + binding.get('deviceType')}>
                    {rearrange_showing ? <div className='select-button'></div> : null}
                    <span className='icon' style={icon_style}></span>
                    <span className='title'>{metrics_binding.get('title')}</span>
                    {!rearrange_showing ?
                        <div className='metrics-container'>
                            <span
                                className='switch-door bubble-door active'
                                onClick={this.toggleSwitch.bind(null, 'on')}
                            >
                                <span className='bubble'></span>
                            </span>
                        </div> :
                        <div className='settings-container'>
                            <span className='setting fa-gear fa'></span>
                        </div>
                    }
                </div>
            );
        }
    });
});
