define([
    'mixins/data/profiles',
    'mixins/data/modules',
    'mixins/sync/sync-layer',
    // components
    'jsx!components/popup',
    'jsx!components/checkbox',
    'jsx!components/input',
    'jsx!components/toggle',
    'jsx!components/paper',
    'jsx!modules/widgets/common/tags'
], function (
    ProfilesMixin,
    ModulesMixin,
    SyncMixin,
    Popup,
    Checkbox,
    Input,
    Toggle,
    Paper,
    Tags
) {
    "use strict";

    return React.createClass({
        mixins: [Morearty.Mixin, ProfilesMixin, ModulesMixin, SyncMixin],
        componentWillMount: function () {
            var root_binding = this.getMoreartyContext().getBinding(),
                devices_binding = root_binding.sub('data.devices'),
                default_binding = root_binding.sub('default');

            default_binding.sub('widgets.settings.device_id').addListener(function () {
                var index = devices_binding.get().findIndex(function (device) {
                        return default_binding.get('widgets.settings.device_id') === device.get('id');
                    }),
                    device_binding = index !== -1 ? devices_binding.sub(index) : null;

                if (index !== -1) {
                    device_binding.meta().set('initial_device_data', device_binding.get());
                }
            });

            default_binding.set('widgets.settings.menu_selected', 'settings');
            default_binding.set('widgets.settings.sync_status', 'normal');
        },
        componentWillUnmount: function () {
            this.getDefaultBinding().clear('widgets.settings.menu_selected');
            this.getDefaultBinding().set('widgets.settings.sync_status', 'normal');
        },
        onSelectedMenuItem: function (menu_item_id) {
            this.getDefaultBinding().set('widgets.settings.menu_selected', menu_item_id);
        },
        onChangeShowOnDashboard: function (device_id) {
            this.toggleDevicePositions(device_id);
        },
        onSaveHandler: function () {
            var that = this,
                root_binding = this.getMoreartyContext().getBinding(),
                devices_binding = root_binding.sub('data.devices'),
                default_binding = root_binding.sub('default'),
                index = devices_binding.get().findIndex(function (device) {
                    return default_binding.get('widgets.settings.device_id') === device.get('id');
                }),
                device_binding = index !== -1 ? devices_binding.sub(index) : null;

            if (index !== -1) {
                default_binding.set('widgets.settings.sync_status', 'sync');

                that.save({
                    model: device_binding,
                    serviceId: 'devices',
                    success: function () {
                        default_binding.set('widgets.settings.sync_status', 'saved');
                        setTimeout(function () {
                            default_binding.set('widgets.settings.showing', false);
                            //default_binding.set('widgets.settings.device_id', null);
                            default_binding.set('widgets.settings.sync_status', 'normal');
                        }, 500);
                    }
                });

            }

        },
        onCancelHandler: function () {
            var root_binding = this.getMoreartyContext().getBinding(),
                devices_binding = root_binding.sub('data.devices'),
                default_binding = root_binding.sub('default'),
                index = devices_binding.get().findIndex(function (device) {
                    return default_binding.get('widgets.settings.device_id') === device.get('id');
                }),
                device_binding = index !== -1 ? devices_binding.sub(index) : null;

            if (index !== -1) {
                var meta = device_binding.meta();
                device_binding.update(function () {
                    return meta.get('initial_device_data');
                });
            }

            this.getDefaultBinding().set('widgets.settings.showing', false);
            this.getDefaultBinding().set('widgets.settings.sync_status', 'normal');
        },
        render: function () {
            var binding = this.getDefaultBinding(),
                devices_binding = this.getMoreartyContext().getBinding().sub('data.devices'),
                default_binding = this.getMoreartyContext().getBinding().sub('default'),
                data_binding = this.getMoreartyContext().getBinding().sub('data'),
                index = devices_binding.get().findIndex(function (device) {
                    return default_binding.get('widgets.settings.device_id') === device.get('id');
                }),
                device_binding = index !== -1 ? devices_binding.sub(index) : null,
                selected = binding.get('widgets.settings.menu_selected'),
                popup_binding = {
                    default: binding,
                    showing: binding.sub('widgets.settings.showing'),
                    selected: binding.sub('widgets.settings.menu_selected'),
                    dynamic_title: index !== -1 ? device_binding.sub('metrics.title') : null,
                    status_binding: default_binding.sub('widgets.settings.sync_status')
                },
                options = {
                    title: '',
                    menu: [
                        {id: 'settings', title: 'SETTINGS', icon: 'fa-cogs'},
                        {id: 'statistics', title: 'STATS', icon: 'fa-pie-chart'}
                    ],
                    menu_handler: this.onSelectedMenuItem,
                    onSaveHandler: this.onSaveHandler,
                    onCancelHandler: this.onCancelHandler,
                    buttons: {
                        save: true,
                        cancel: true,
                        close: false
                    },
                    className: 'settings-popover'
                },items, creator, creatorId;

            if (index !== -1) {
                creatorId = device_binding.get('creatorId'),
                creator = this.getInstanceById(creatorId);
                items = [
                    {
                        title: 'ID',
                        data: device_binding.get('id')
                    },
                    {
                        title: 'DeviceType',
                        data: device_binding.get('deviceType')
                    },
                    {
                        title: 'CreatorID',
                        data: creator.get('title') || '' + '[#' + device_binding.get('creatorId') + '][' + creator.get('moduleId') + ']'
                    }
                ];
            }


            return (
                index !== -1 ? <Popup binding={popup_binding} options={options}>
                    {selected === 'settings' ?
                        <div className='content-block settings'>
                            <Paper items={items} />
                            <div className='modified-block five columns omega'>
                                <Input title='Title' binding={device_binding.sub('metrics.title')}  />
                                <Toggle
                                    id='permanently-hidden'
                                    title='Permanently hidden'
                                    binding={device_binding.sub('permanently_hidden')}
                                />
                                <Toggle
                                    id='show-on-dashboard'
                                    title='Show on dashboard'
                                    checked={this.isExistDeviceInPositions.bind(null, device_binding.get('id'))}
                                    handler={this.onChangeShowOnDashboard.bind(null, device_binding.get('id'))}
                                />
                            </div>
                            <div className='tags-container'>
                                <Tags binding={device_binding.sub('tags')} />
                            </div>
                        </div> :
                        <div className="content-block statistics">
                        </div>
                    }
                </Popup> : null
            );
        }
    });
});