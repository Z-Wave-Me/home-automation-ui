define([
    // mixins
    'mixins/sync/sync-layer'
], function (
    sync_layer_mixin
    ) {
    'use strict';

    return React.createClass({
        _serviceId: 'devices',
        mixins: [Morearty.Mixin, sync_layer_mixin],
        onToggleHovering: function (hover) {
            this._hover = hover;
            this.forceUpdate();
            return false;
        },
        onChangeLevel: function (event) {
            var that = this,
                metrics_binding = this.getDefaultBinding().sub('metrics');

            that.fetch({
                params: {
                    level: event.target.value
                },
                model: this.getDefaultBinding(),
                serviceId: 'devices'
            }, 'exact');

            metrics_binding.set('level', event.target.value);
            that.forceUpdate();
        },
        render: function () {
            var binding = this.getDefaultBinding(),
                item_binding = binding,
                title = item_binding.get('metrics.title'),
                level = item_binding.get('metrics.level'),
                styles = {
                    'backgroundImage': '-webkit-gradient(linear,left top,  right top, color-stop(' + level / 100 + ', rgb( 64, 232, 240 )), color-stop(' + level / 100 + ', rgb( 190, 190, 190 )))'
                };

            return (
                <div
                    className='metrics-container'
                    onMouseEnter={this.onToggleHovering.bind(null, true)}
                    onMouseLeave={this.onToggleHovering.bind(null, false)}
                >
                            {!this._hover ?
                                <progress className='progress' value={level} min='0' max='0'></progress> :
                                <Morearty.DOM.input
                                    className='range'
                                    onChange={this.onChangeLevel}
                                    type='range'
                                    min='0'
                                    max='100'
                                    value={level}
                                    step='1'
                                    style={styles}
                                />
                                }
                </div>
            );
        }
    });
});
