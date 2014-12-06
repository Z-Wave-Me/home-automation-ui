define([
    'jsx!components/popup'
], function (
    Popup
) {
    "use strict";

    return React.createClass({
        mixins: [Morearty.Mixin],
        componentWillMount: function () {
            this.getDefaultBinding().set('widgets.settings.menu_selected', 'settings');
        },
        componentWillUnmount: function () {
            this.getDefaultBinding().remove('widgets.settings.menu_selected');
        },
        onSelectedMenuItem: function (id) {
            this.getDefaultBinding().set('widgets.settings.menu_selected', id);
        },
        render: function () {
            var binding = this.getDefaultBinding(),
                devices_binding = this.getBinding('data').sub('devices'),
                index = devices_binding.get().findIndex(function (device) {
                    return binding.get('widgets.settings.device_id') === device.get('id');
                }),
                device_binding = index !== -1 ? devices_binding.sub(index) : null,
                selected = binding.get('widgets.settings.menu_selected'),
                popup_binding = {
                    default: binding,
                    showing: binding.sub('widgets.settings.showing'),
                    selected: binding.sub('widgets.settings.menu_selected')
                },
                options = {
                    title: device_binding ? device_binding.get('metrics.title').toUpperCase() : '',
                    menu: [
                        {id: 'settings', title: 'SETTINGS', icon: 'fa-cogs'},
                        {id: 'statistics', title: 'STATS', icon: 'fa-pie-chart'}
                    ],
                    menu_handler: this.onSelectedMenuItem
                };

            return (
                <Popup binding={popup_binding} options={options}>
                    {selected === 'settings' ?
                        <div className="content-block settings">
                            <div className="content">

                            </div>
                            <ul className="tags">
                                <li><a href="#" className="tag">HTML</a></li>
                                <li><a href="#" className="tag">CSS</a></li>
                                <li><a href="#" className="tag">JavaScript</a></li>
                            </ul>
                        </div> :
                        <div className="content-block statistics">

                        </div>
                    }
                </Popup>
            );
        }
    });
});