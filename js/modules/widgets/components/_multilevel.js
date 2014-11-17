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
            var _ = React.DOM,
                binding = this.getDefaultBinding(),
                rearrange_showing = this.getBinding('footer').val('rearrange_showing'),
                cx = React.addons.classSet,
                item_binding = binding,
                title = item_binding.val('metrics.title'),
                level = item_binding.val('metrics.level'),
                icon = item_binding.val('metrics.icon'),
                styles = {
                    'background-image': '-webkit-gradient(linear,left top,  right top, color-stop(' + level / 100 + ', rgb( 64, 232, 240 )), color-stop(' + level / 100 + ', rgb( 190, 190, 190 )))'
                };

            return _.div({className: 'widget multilevel'},
                rearrange_showing ? _.div({className: 'select-button'}) : null,
                _.span({className: 'icon', style: {backgroundImage: 'url(' + icon + ')'}}),
                _.span({className: 'title'}, title),
                _.div({className: 'metrics-container', onMouseEnter: this.onToggleHovering.bind(null, true), onMouseLeave: this.onToggleHovering.bind(null, false)},
                    !this._hover ? _.progress({className: 'progress', value: level, min: 0, max: 100}) :
                    _.input({className: 'range', onChange: this.onChangeLevel, type: 'range', min: 0, max: 100, value: level, step: 1, style: styles})
                )
            );
        }
    });
});
