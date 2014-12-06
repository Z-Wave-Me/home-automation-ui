define([], function () {
    "use strict";

    return React.createClass({
        mixins: [Morearty.Mixin],
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
                        <section className='popover-content'>{this.props.children}</section>
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