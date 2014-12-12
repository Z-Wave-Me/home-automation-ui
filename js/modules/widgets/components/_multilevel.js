define([
    // mixins
    'mixins/data/manipulation',
    'mixins/sync/sync-layer'
], function (
    manipulation_mixin,
    sync_layer_mixin
    ) {
    'use strict';

    return React.createClass({
        _serviceId: 'devices',
        mixins: [Morearty.Mixin, sync_layer_mixin, manipulation_mixin],
        getInitialState: function () {
            var that = this;

            return {
                setValueFunc: that.debounce(function (level, binding) {
                    that.fetch({
                        params: {
                            level: level
                        },
                        model: binding,
                        serviceId: 'devices'
                    }, 'exact');
                }, 100)
            };
        },
        onToggleHovering: function (hover) {
            this._hover = hover;
            this.forceUpdate();
            return false;
        },
        onChangeLevel: function (event) {
            var binding = this.getDefaultBinding(),
                metrics_binding = binding.sub('metrics'),
                level = event.target.value;

            metrics_binding.set('level', level);
            this.state.setValueFunc(level, binding);
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
                    Morearty.DOM.input({
                        className: rangeClasses,
                        onChange: this.onChangeLevel,
                        type: 'range',
                        min: 0,
                        max: 100,
                        value: level,
                        step: 1,
                        style: styles
                    })
                )
            );
        }
    });
});
