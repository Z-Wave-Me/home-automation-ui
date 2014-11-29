define([
    // components
    'jsx!./components/_base',
    // mixins
    'mixins/data/data-layer'
], function (
    // components
    BaseWidget,
    // mixins
    data_layer_mixin
    ) {
    'use strict';

    return React.createClass({
        mixins: [Morearty.Mixin, data_layer_mixin],
        render: function () {
            var __ = React.DOM,
                binding = this.getDefaultBinding(),
                data_binding = this.getBinding('data'),
                primary_filter = binding.get('primaryFilter'),
                secondary_filter = binding.get('secondaryFilter'),
                items_binding = data_binding.sub('devices'),
                footer_binding = binding.sub('footer'),
                active_profile = this.getActiveProfile(),
                positions = active_profile !== null ? active_profile.get('positions') : [],
                isShown, isSearchMatch;

            isSearchMatch = function (index) {
                var search_string = binding.get('searchStringMainPanel'),
                    title = items_binding.get(index + '.metrics.title');

                return search_string.length > 0 ? title.toLowerCase().indexOf(search_string.toLowerCase()) !== -1 : true;
            };

            isShown = function (item) {
                if (!item.get('permanently_hidden')) {
                    if (binding.get('nowShowing') === 'dashboard') {
                        return positions.indexOf(item.get('id')) !== -1;
                    } else {
                        if (primary_filter === 'rooms') {
                            return item.get('location') === secondary_filter;
                        } else if (primary_filter === 'types') {
                            return item.get('deviceType') === secondary_filter;
                        } else if (primary_filter === 'tags') {
                            return item.get('tags').indexOf(secondary_filter) !== -1;
                        } else {
                            return true;
                        }
                    }
                } else {
                    return false;
                }
            };

            return (
                <section className='widgets'>
                    {items_binding.get().map(function (item, index) {
                        var binding = { default: items_binding.sub(index), footer: footer_binding};
                        if (isShown(item) && isSearchMatch(index)) {
                            return <BaseWidget key={index} binding={binding} />;
                        } else {
                            return null;
                        }
                    }).toArray()}
                </section>
            );

        }
    });
});
