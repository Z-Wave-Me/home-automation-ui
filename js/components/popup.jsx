define([], function () {
    "use strict";

    return React.createClass({
        mixins: [Morearty.Mixin],
        renderItems: function () {
            var root_binding = this.getMoreartyContext().getBinding(),
                default_binding = root_binding.sub('default'),
                devices_binding = root_binding.sub('data.devices'),
                device_id = default_binding.get('widgets.settings.device_id'),
                index = devices_binding.get().findIndex(function (dev) {
                    return dev.get('id') === device_id;
                });

            index = 0;

            if (index !== -1) {
                var Child = this.props.children,
                    binding = {binding: devices_binding.sub(index)};
                return (<Child binding={binding} />);
            } else {
                return null;
            }

        },
        onClickCloseButton: function () {
            this.getBinding('showing').set(false);
        },
        render: function () {
            var that = this,
                cx = React.addons.classSet,
                binding = this.getDefaultBinding(),
                showing = this.getBinding('showing').toJS(),
                popover_class_name = cx({
                    popover: true,
                    active: Boolean(showing)
                }),
                overlay_class_name = cx({
                    hidden: !Boolean(showing),
                    overlay: true
                }),
                options = this.props.options,
                menu = options.menu ? options.menu.map(function (menu_item) {
                    var menu_item_classes = cx({
                        'menu-item': true,
                        'selected': that.getBinding('selected').get() === menu_item.id
                    });

                    return (
                        <span className={menu_item_classes} onClick={options.menu_handler.bind(null, menu_item.id)}>
                            <span className={'menu-item-icon fa ' + menu_item.icon}></span>
                            <span className='menu-item-title'>{menu_item.title}</span>
                        </span>
                        );
                }) : null;

            return (
                <div>
                    <div className={popover_class_name}>
                        <section className='popover-header'>
                            {options.title}
                            {menu ? <span className='menu-container'>{menu}</span> : null}
                        </section>
                        <section className='popover-content'></section>
                        <section className='popover-footer'>
                            <span className='material-button cancel' onClick={this.onClickCloseButton}>CANCEL</span>
                            <span className='material-button submit' onClick={options.submit}>SUBMIT</span>
                        </section>
                    </div>
                    <div className={overlay_class_name} onClick={this.onClickCloseButton}></div>
                </div>
            );
        }
    });
});