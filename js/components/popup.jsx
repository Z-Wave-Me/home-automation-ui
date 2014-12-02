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
                return <Child binding={binding} />
            } else {
                return null;
            }

        },
        render: function () {
            var cx = React.addons.classSet,
                binding = this.getDefaultBinding(),
                className = cx({
                    popover: true,
                    hidden: true
                });

            return (
                <div className={className}>
                    <section className='popup-header'>
                        <span className='columns alpha omega three'></span>
                        <span className='columns alpha omega six'>title</span>
                        <span classNane='columns alpha omega three'>
                            <i className='close-button fa fa-close'></i>
                        </span>
                    </section>
                    <section className='popup-content'>

                    </section>
                </div>
            );
        }
    });
});