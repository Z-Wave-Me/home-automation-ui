define([], function () {
    'use strict';

    return React.createClass({
        mixins: [Morearty.Mixin, TranslateMixin],
        render: function () {
            var cx = React.addons.classSet,
                __ = this.gls,
                search_classes = cx({
                    'search-input': true,
                    small: this.props.small
                });

            return (
                <div className='base-search-component'>
                    <Morearty.DOM.input
                        className={search_classes}
                        type='search'
                        placeholder={__('search')}
                        onChange={Morearty.Callback.set(this.getDefaultBinding())}
                        value={this.getDefaultBinding().toJS()}
                    />
                </div>
            );
        }
    });
});
