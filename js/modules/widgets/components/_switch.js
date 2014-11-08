define([
    // components
    '../common/color_picker',
    // mixins
    'mixins/sync/sync-layer',
    'mixins/ui/dom'
], function (
    // components
    ColorPicker,
    // mixins
    SyncLayerMixin,
    DomMixin
    ) {
    'use strict';

    return React.createClass({
        _serviceId: 'devices',
        mixins: [Morearty.Mixin, SyncLayerMixin, DomMixin],
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

            if (binding.val('deviceType') !== 'doorlock') {
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
        componentDidUpdate: function () {
            if (this.isMounted() && this.state.show_picker) {
                var color_picker = document.getElementsByClassName('picker-container')[0],
                    picker_button = this.refs.pickerButton.getDOMNode(),
                    picker_button_offset = this.getOffset(picker_button);

                color_picker.style.top = picker_button_offset.top + picker_button.offsetHeight/2 - color_picker.offsetHeight/2  + 'px';
                color_picker.style.left = picker_button_offset.left + picker_button.offsetWidth + 5 + 'px';
            }
        },
        render: function () {
            var that = this,
                _ = React.DOM,
                cx = React.addons.classSet,
                binding = this.getDefaultBinding(),
                title = binding.sub('metrics.title').val(),
                level = binding.sub('metrics.level').val(),
                color = binding.sub('metrics.color').toJS(),
                classes = cx({
                    switch: true,
                    active: level === 'on' || level === 'open'
                }),
                _isRGB = binding.val('deviceType') === 'switchRGBW';

            return _.div({className: 'content'},
                _.span({className: 'title-container'}, title),
                _isRGB ? _.div({ref: 'colorsContainer',className: 'colors-container'},
                    _.div({ref: 'pickerButton', className: 'picker', style: {
                        'background-color': 'rgb(' + [color.r, color.g, color.b].join(', ') + ')'
                    }, onClick: this.onToggleShowPicker})
                ) : null,
                _.span({onClick: this.toggleSwitch, className: classes},
                    _.span({className: 'bubble'}),
                    _.span({className: 'text'}, level.toUpperCase())
                ),
                this.state.show_picker && _isRGB ?
                    _.div({
                        className: 'overlay transparent show fixed',
                        onClick: this.onToggleShowPicker
                    }, ColorPicker({
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
                    })
                ) : null
            );
        }
    });
});
