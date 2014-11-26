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
                cx = React.addons.classSet,
                item_binding = binding,
                title = item_binding.sub('metrics').get('title'),
                level = item_binding.sub('metrics').get('level'),
                styles = {
                    'backgroundImage': '-webkit-gradient(linear,left top,  right top, color-stop(' + level / 100 + ', rgb( 64, 232, 240 )), color-stop(' + level / 100 + ', rgb( 190, 190, 190 )))'
                },
                progressClasses = cx({
                    'progress-bar': true,
                    hidden: this._hover
                }),
                rangeClasses = cx({
                    'input-range': true,
                    hidden: !this._hover
                });

            return (
                _.div({className: 'content', onMouseEnter: this.onToggleHovering.bind(null, true), onMouseLeave: this.onToggleHovering.bind(null, false)},
                    _.span({className: 'text title-container'}, this._hover ? '' : title),
                    _.progress({className: progressClasses, value: level, min: 0, max: 100}),
                    _.input({className: rangeClasses, onChange: this.onChangeLevel, type: 'range', min: 0, max: 100, value: level, step: 1, style: styles})
                )
            )
        }
    });
});
