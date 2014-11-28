define([
    // components
    'jsx!Widgets',
    'jsx!./filters',
    'jsx!./footer'
], function (
    // components
    Widgets,
    Filters,
    Footer
) {
    'use strict';

    return React.createClass({
        mixins: [Morearty.Mixin],
        getFilters: function () {
            if (this.getDefaultBinding().get('nowShowing') === 'widgets') {
                return <Filters binding={ this.getBinding() } />;
            } else {
                return null;
            }
        },
        render: function () {
            var binding = this.getBinding();

            return (
                <div className='main clearfix'>
                    {this.getFilters()}
                    <Widgets binding={ binding } />
                    <Footer binding={ binding } />
                </div>
            );
        }
    });
});
