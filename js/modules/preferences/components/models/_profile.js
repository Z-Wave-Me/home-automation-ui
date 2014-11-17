define([
    // components
    '../common/_buttons_group',
    '../common/_inline_input',
    // mixins
    'mixins/data/data-layer',
    'mixins/sync/sync-layer'
], function (
    // components
    _buttons_group,
    _inline_input,
    // mixins
    data_layer_mixin
    ) {
    'use strict';

    return React.createClass({
        mixins: [Morearty.Mixin, data_layer_mixin, TranslateMixin],
        isplayName: '_profile',
        setAsDefaultProfile: function (event) {
            this.getBinding('preferences').set('defaultProfileId', event.target.checked ? this.getBinding('item').val('id') : null);
            return false;
        },
        componentWillMount: function () {
            var that = this,
                preferences_binding = that.getBinding('preferences');

            preferences_binding.addListener('activeNodeTreeStatus', function () {
                if (that.isMounted()) {
                    that.forceUpdate();
                }
            });
            preferences_binding.set('temp_string', '');
        },
        componentWillUnmount: function () {
            this.getBinding('preferences').delete('temp_string');
        },
        render: function () {
            var that = this,
                _ = React.DOM,
                __ = this.gls,
                cx = React.addons.classSet,
                preferencesBinding = that.getBinding('preferences'),
                data_binding = that.getBinding('data'),
                item_binding = that.getBinding('item'),
                add_mode = preferencesBinding.val('activeNodeTreeStatus') === 'add',
                default_profile = that.getActiveProfile(),
                default_profile_id = default_profile !== null ? default_profile.val('id') : null,
                id = item_binding.val('id'),
                title = item_binding.val('name'),
                temp_string = that.getBinding('preferences').val('temp_string'),
                description = item_binding.val('description'),
                classes_input_autocomplete = cx({
                    'text-input-autocomplete': true,
                    'focus': temp_string.length > 1
                });

            return _.div({ className: 'model-component'},
                _.div({ className: 'form-data profile clearfix' },
                    _.div({ key: 'form-name-input', className: 'form-group' },
                        _.label({ htmlFor: 'profile-name', className: 'input-label'}, __('profile_name', 'capitalize')),
                        _.input({
                            onChange: Morearty.Callback.set(item_binding, 'name'),
                            id: 'profile-name',
                            className: 'input-value',
                            type: 'text',
                            placeholder: __('name', 'capitalize'),
                            autoFocus: true,
                            value: title
                        })
                    ),
                    _.div({ key: 'form-description-input', className: 'form-group' },
                        _.label({ htmlFor: 'profile-description', className: 'input-label'}, __('description', 'capitalize')),
                        _.textarea({
                            onChange: Morearty.Callback.set(item_binding, 'description'),
                            id: 'profile-description',
                            className: 'input-value textarea-type',
                            col: 3,
                            row: 3,
                            placeholder: __('description', 'capitalize'),
                            value: description
                        })
                    ),
                    !add_mode ? _.div({ key: 'form-device-input', className: 'form-group' },
                        _.label({ htmlFor: 'profile-tagsinput', className: 'input-label block'}, __('show_on_dashboard', 'capitalize')),
                        _.div({ id: 'profile-tagsinput', className: 'tagsinput'},
                            item_binding.val('positions').map(function (label) {
                                var device_index = data_binding.sub('devices').val().findIndex(function (device) {
                                        return device.get('id') === label;
                                    }),
                                    device = data_binding.sub('devices.' + device_index);

                                    return _.span({ key: label, className: 'tag label label-info'}, device.val('metrics.title'),
                                    _.span({
                                        className: 'tag-remove',
                                        onClick: that.removeTagHandler.bind(null, label)
                                    })
                                );
                            }).toArray()
                        ),
                        _.input({
                            className: classes_input_autocomplete,
                            placeholder: __('device_name', 'capitalize'),
                            onChange: Morearty.Callback.set(preferencesBinding, 'temp_string'),
                            value: temp_string
                        }),
                        temp_string.length > 1 ? _.div({className: 'autocomplete-box autocomplete-device'},
                            _.button({
                                className: 'close-button',
                                onClick: that.onBlurHandler
                            }, '✖'),
                            _.ul({className: 'result-list'},
                                that.getDevicesAvailable()
                            )
                        ) : null
                    ) : null,
                    !add_mode ? _.div({ key: 'form-default-profile-input', className: 'form-group' },
                        _.label({className: 'switch-container'},
                            _.input({
                                    className: 'ios-switch green',
                                    type: 'checkbox',
                                    checked: String(default_profile_id) === String(id),
                                    onChange: that.setAsDefaultProfile
                                },
                                _.div({},
                                    _.div({className: 'bubble-switch'})
                                )
                            ),
                            __('make_as_default', 'capitalize'), ' ', __('profile')
                        )
                    ) : null,
                    _buttons_group({
                        binding: {
                            default: preferencesBinding,
                            item: item_binding,
                            items: data_binding.sub('profiles')
                        },
                        serviceId: this.props.serviceId
                    })
                )
            );
        },
        getDevicesAvailable: function () {
            var that = this,
                _ = React.DOM,
                __ = this.gls,
                devices_binding = that.getBinding('data').sub('devices'),
                item_binding = that.getBinding('item'),
                temp_string = that.getBinding('preferences').val('temp_string'),
                filtered_devices = devices_binding.val().filter(function (device) {
                    return item_binding.val('positions').indexOf(device.get('id')) === -1 &&
                        device.get('metrics').get('title').toLowerCase().indexOf(temp_string.toLowerCase()) !== -1;
                }),
                deviceTypes = Sticky.get('App.Helpers.JS').arrayUnique(filtered_devices.map(function (device) {
                    return device.get('deviceType');
                }));

            if (filtered_devices.toArray().length > 0) {
                return deviceTypes.map(function (type) {
                    return _.li({className: 'result-dept'},
                        _.div({className: 'result-label'}, type),
                        _.ul({className: 'result-sub'},
                            filtered_devices.filter(function (device) {
                                return device.get('deviceType') === type;
                            }).map(function (device) {
                                return _.li({
                                        key: 'device-autocomplete-' + device.get('id'),
                                        className: 'result-item',
                                        onClick: that.addTagHandler.bind(null, device.get('id'))
                                    },
                                    _.strong({ className: 'strong-deviceId' }, '[' + device.get('id') + '] '),  device.get('metrics').title
                                );
                            }).toArray()
                        )
                    );
                });
            } else {
                return _.li({className: 'result-dept'},
                    _.div({className: 'result-label no-matches'}, __('no_matches'))
                );
            }
        },
        addTagHandler: function (deviceId) {
            var that = this,
                item_binding = that.getBinding('item');

            item_binding.update('positions', function (positions) {
                return positions.push(deviceId);
            });

            that.forceUpdate();
        },
        removeTagHandler: function (label) {
            var that = this,
                item_binding = that.getBinding('item');

            item_binding.update('positions', function (positions) {
                return positions.filter(function (deviceId) {
                    return deviceId !== label;
                });
            });

            that.forceUpdate();
        },
        onBlurHandler: function () {
            this.getBinding('preferences').set('temp_string', '');
            this.forceUpdate();
            return false;
        }
    });
});
