define([
    'jsx!components/button',
    'jsx!components/overlay'
], function (Button, Overlay) {
    "use strict";

    return React.createClass({
        mixins: [Morearty.Mixin],
        onClickCloseButton: function () {
            this.getBinding('showing').set(false);
        },
        render: function () {
            var that = this,
                cx = React.addons.classSet,
                showing = this.getBinding('showing').toJS(),
                options = this.props.options,
                popover_class_name = cx({
                    popover: true,
                    active: Boolean(showing)
                }) + ' ' + options.className || '',
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
                }) : null,
                dynamic_title = this.getBinding('dynamic_title') ? this.getBinding('dynamic_title').get() : '',
                title = options.title + dynamic_title,
                status_binding = this.getBinding('status_binding').get() || 'normal';

            return (
                <div>
                    <div className={popover_class_name }>
                        <section className='popover-header'>
                            {title}
                            {menu ? <span className='menu-container'>{menu}</span> : null}
                        </section>
                        <section className='popover-content'>{this.props.children}</section>
                        <section className='popover-footer material'>
                            {options.buttons.close && status_binding === 'normal' ? <Button
                                classes='grey'
                                title='close'
                                handler={this.onClickCloseButton}
                            /> : null}
                            {options.buttons.cancel && status_binding === 'normal' ? <Button
                                classes='grey'
                                title='cancel'
                                handler={options.onCancelHandler}
                            /> : null}
                            {options.buttons.save && status_binding === 'normal' ? <Button
                                classes='green raised'
                                title='save'
                                handler={options.onSaveHandler}
                            /> : null}
                            {status_binding === 'sync' ? <Button
                                classes='grey label-blue'
                                title='syncing...'
                            /> : null}
                            {status_binding === 'saved' ? <Button
                                classes='green raised'
                                title='saved'
                            /> : null}
                        </section>
                    </div>
                    <Overlay binding={this.getBinding('showing')} />
                </div>
            );
        }
    });
});