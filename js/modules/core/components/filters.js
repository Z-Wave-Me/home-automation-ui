define([
    // components
    './_filter_rooms',
    './_filter_tags',
    './_filter_types',
    'Preferences/components/common/_base_search'
], function (
    // components
    FilterRooms,
    FilterTags,
    FilterTypes,
    BaseSearch
    ) {
    'use strict';

    return React.createClass({
        mixins: [Morearty.Mixin, TranslateMixin],
        setPrimaryFilter: function (filter) {
            this.getDefaultBinding().set('primaryFilter', filter);
            return false;
        },
        render: function () {
            var binding = this.getDefaultBinding(),
                dataBinding = this.getBinding('data'),
                _ = React.DOM,
                __ = this.gls,
                SecondaryFilters,
                primaryFilter = binding.get('primaryFilter');

            SecondaryFilters = function () {
                if (primaryFilter === 'rooms') {
                    return dataBinding.get('locations').count() > 0 ? FilterRooms({binding: { default: binding, data: dataBinding }}) : null;
                } else if (primaryFilter === 'types') {
                    return dataBinding.get('deviceTypes').count() > 0 ? FilterTypes({binding: { default: binding, data: dataBinding }}) : null;
                } else if (primaryFilter === 'tags') {
                    return dataBinding.get('deviceTags').count() > 0 ? FilterTags({binding: { default: binding, data: dataBinding }}) : null;
                } else {
                    return null;
                }
            };

            return _.div({className: 'filters-container'},
                _.div({className: 'panel-filter left-filter'}),
                _.div({className: 'panel-filter primary-filters'},
                    _.span({onClick: this.setPrimaryFilter.bind(null, 'all'), className: primaryFilter === 'all' ? 'primary-filter selected' : 'primary-filter'}, __('all','capitalize')),
                    _.span({onClick: this.setPrimaryFilter.bind(null, 'rooms'), className: primaryFilter === 'rooms' ? 'primary-filter selected' : 'primary-filter'}, __('rooms','capitalize')),
                    _.span({onClick: this.setPrimaryFilter.bind(null, 'types'), className: primaryFilter === 'types' ? 'primary-filter selected' : 'primary-filter'}, __('types','capitalize')),
                    _.span({onClick: this.setPrimaryFilter.bind(null, 'tags'), className: primaryFilter === 'tags' ? 'primary-filter selected' : 'primary-filter'}, __('tags','capitalize'))
                ),
                _.div({className: 'panel-filter right-filter'},
                    BaseSearch({
                        binding: {
                            default: this.getDefaultBinding()
                        },
                        search_attr: this.getDefaultBinding().sub('searchStringMainPanel')
                    })
                ),
                SecondaryFilters()
            );
        }
    });
});
