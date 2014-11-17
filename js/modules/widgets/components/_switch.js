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
                isDoorLock = binding.val('deviceType') === 'doorlock',
                level = binding.val('metrics.level'),
                command;

            if (!isDoorLock) {
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
                rearrange_showing = this.getBinding('footer').val('rearrange_showing'),
                title = binding.val('metrics.title'),
                level = binding.val('metrics.level') || binding.val('metrics.mode'),
                classes = cx({
                    switch: true,
                    active: level === 'on' || level === 'open'
                }),
                _isRGB = binding.val('deviceType') === 'switchRGBW',
                color = _isRGB ? binding.sub('metrics.color').toJS() : {};

            return _.div({className: 'widget ' + binding.val('deviceType')},
                rearrange_showing ? _.div({className: 'select-button'}) : null,
                _.span({className: 'icon', style: {backgroundImage: 'url(' + binding.val('metrics.icon') + ')'}}),
                _.span({className: 'title'}, title),
                _.div({className: 'metrics-container'},
                    _.span({onClick: this.toggleSwitch, className: classes},
                        _.span({className: 'bubble'}),
                        _.span({className: 'text'}, level.toUpperCase())
                    ),
                    _isRGB ? _.div({ref: 'pickerButton', className: 'picker-rect', style: {
                        'background-color': 'rgb(' + [color.r, color.g, color.b].join(', ') + ')'
                    }, onClick: this.onToggleShowPicker}) : null,
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
                )
            );
        }
    });
});
