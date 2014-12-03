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
        onClickCloseButton: function () {
            this.getBinding('showing').set(false);
        },
        render: function () {
            var cx = React.addons.classSet,
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
                options = this.props.options;

            return (
                <div>
                    <div className={popover_class_name}>
                        <section className='popover-header'>{options.title}</section>
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