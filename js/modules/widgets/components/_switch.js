define([
    // libs
    'morearty',
    // components
    '../common/color_picker',
    // mixins
    'mixins/sync/sync-layer'
], function (
    // libx
    Morearty,
    // components
    ColorPicker,
    // mixins
    SyncLayerMixin
    ) {
    'use strict';

    return React.createClass({
        _serviceId: 'devices',
        mixins: [Morearty.Mixin, SyncLayerMixin],
        getInitialState: function () {
            return {
                show_picker: false
            };
        },
        toggleSwitch: function () {
            var that = this,
                binding = this.getDefaultBinding(),
                level = binding.sub('metrics').val('level'),
                command;

            if (binding.val('deviceType') === 'doorlock') {
                command = level === 'on' ? 'off' : 'on';
            } else {
                command = level === 'open' ? 'close' : 'open';
            }

            that.fetch({
                model: binding,
                success: function () {
                    binding.sub('metrics').set('level', command);
                    that.forceUpdate();
                }
            }, command);

            return false;
        },
        onToggleShowPicker: function () {
            if (this.isMounted()) {
                this.setState({'show_picker': !this.state.show_picker});
                this.forceUpdate();
            }
            return false;
        },
        render: function () {
            var that = this,
                _ = React.DOM,
                cx = React.addons.classSet,
                binding = this.getDefaultBinding(),
                title = binding.sub('metrics').val('title'),
                level = binding.sub('metrics').val('level'),
                color = binding.sub('metrics').sub('color').toJS(),
                classes = cx({
                    switch: true,
                    active: level === 'on' || level === 'open'
                }),
                _isRGB = binding.val('deviceType') === 'switchRGBW';

            return _.div({className: 'content'},
                _.span({className: 'title-container'}, title),
                _isRGB ? _.div({className: 'colors-container'},
                    _.div({className: 'picker', style: {
                        'background-color': 'rgb(' + [color.r, color.g, color.b].join(', ') + ')'
                    }, onClick: this.onToggleShowPicker})
                ) : null,
                _.span({onClick: this.toggleSwitch, className: classes},
                    _.span({className: 'bubble'}),
                    _.span({className: 'text'}, level.toUpperCase())
                ),
                this.state.show_picker ? ColorPicker({
                    binding: {
                        default: binding.sub('metrics').sub('color')
                    },
                    handler: function (color) {
                        that.fetch({
                            serviceId: 'devices',
                            model: binding,
                            params: {
                                red: color.r,
                                green: color.g,
                                blue: color.b
                            }
                        }, 'exact');
                    }
                }) : null
            );
        }
    });
});
