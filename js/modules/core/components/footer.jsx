define([
    // components
    'jsx!Preferences/components/common/base_search',
    // mixins
    'mixins/data/profiles',
    'mixins/sync/sync-layer'
], function (
    // components
    BaseSearch,
    // mixins
    ProfilesMixin,
    SyncLayerMixin
) {
    'use strict';

    return React.createClass({
        mixins: [Morearty.Mixin, TranslateMixin, ProfilesMixin, SyncLayerMixin],
        componentWillMount: function () {
            this.getDefaultBinding().set('footer.search_string', '');
        },
        componentWillUnmount: function () {
            this.getDefaultBinding().delete('footer.search_string');
        },
        onSelectDeviceHandler: function (device_id) {
            var binding = this.getDefaultBinding();
            var active_profile = this.addDeviceToPositions(device_id);
            binding.set('footer.search_string', '');
            if (active_profile) {
                this.save({model: active_profile, serviceId: 'profiles'});
            }
        },
        getAutoComplete: function () {
            var that = this,
                binding = this.getDefaultBinding(),
                data_binding = this.getBinding('data'),
                devices_binding = data_binding.sub('devices'),
                search_string = binding.get('footer.search_string').toLowerCase();

            if (search_string.length > 1 && devices_binding.get().size) {
                var matches_devices = devices_binding.get().filter(function (device, index) {
                        var title = devices_binding.get(index + '.metrics.title').toLowerCase();
                        return title.indexOf(search_string) !== -1 && !that.isExistDeviceInPositions(device.get('id'));
                    }),
                    device_types = matches_devices.reduce(function (memo, device) {
                        if (memo.indexOf(device.get('deviceType')) !== -1) {
                            return memo;
                        } else {
                            return memo.push(device.get('deviceType'));
                        }
                    }, Immutable.List());

                if (matches_devices.size > 0) {
                    return (
                        device_types.map(function (type) {
                            return (
                                <li key='subgroup-{type}' className='subgroup'>
                                    <span key='subgroup-title-{type}' className='title-subgroup'>{type}</span>
                                    <ul key='items-{type}' className='items'>
                                        {matches_devices.filter(function (device) {
                                            return device.get('deviceType') === type;
                                        }).map(function (device) {
                                            var id = device.get('id');
                                            return (
                                                <li
                                                    onClick={that.onSelectDeviceHandler.bind(null, id)}
                                                    key={id}
                                                    className='item'>{device.get('metrics').get('title')}
                                                </li>);
                                        }).toArray()}
                                    </ul>
                                </li>);
                        }).toArray()
                    );
                } else {
                    return null;
                }
            } else {
                return null;
            }
        },
        onSetRearrangeMenu: function (status) {
            this.getDefaultBinding().set('footer.rearrange_showing', status);
        },
        onDrop: function (e) {
            console.log(e);
            e.preventDefault();
        },
        render: function () {
            var cx = React.addons.classSet,
                binding = this.getDefaultBinding(),
                rearrange_showing = binding.get('footer.rearrange_showing'),
                __ = this.gls,
                rearrange_classes = cx({
                    'rearrange-menu': true,
                    mini: !rearrange_showing
                }),
                menu_label_text = !rearrange_showing ? __('rearrange_and_settings', 'case') : 'Drag & drop to rearrange';

            return (
                <div className='footer'>
                    <div className={rearrange_classes}>
                        <div className='columns three rearrange-area' onClick={this.onSetRearrangeMenu.bind(this, true)}>
                            <span className='pencil fa fa-pencil'></span>
                            <span className='menu-label'>{menu_label_text}</span>
                        </div>
                        {rearrange_showing ?
                            <div className='add-dashboard-container columns four'>
                                <ul className='autocomplete'>{this.getAutoComplete()}</ul>
                                <span className='plus fa fa-plus-circle'></span>
                                <BaseSearch binding={binding.sub('footer.search_string')} />
                            </div>
                        : null}
                        {rearrange_showing ?
                            <div onDrop={this.onDrop} className='drop-here-container columns four'>
                                <span className='minus fa fa-minus-circle'></span>
                                <span className='drop-here'>Drop here to remove</span>
                            </div>
                        : null}
                        {rearrange_showing ?
                            <div className='done-container columns two' onClick={this.onSetRearrangeMenu.bind(this, false)}>
                                <span className='fa-check-circle fa'></span>
                                <span className='label'>Done</span>
                            </div>
                        : null}
                    </div>
                </div>
            );
        }
    });
});
