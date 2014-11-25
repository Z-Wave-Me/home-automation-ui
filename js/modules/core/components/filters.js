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
        displayName: 'filters',
        mixins: [Morearty.Mixin, TranslateMixin],
        setPrimaryFilter: function (filter) {
            this.getDefaultBinding().set('primaryFilter', filter);
            return false;
        },
        getSecondaryFilter: function () {
            var _ = React.DOM,
                binding = this.getDefaultBinding(),
                data_binding = this.getBinding('data'),
                primary_filter = binding.get('primaryFilter'),
                _binding = { default: binding, data: data_binding },
                secondary_filter = null;

            if (primary_filter === 'rooms' && data_binding.get('locations').count() > 0) {
                secondary_filter = FilterRooms({binding: _binding});
            } else if (primary_filter === 'types' && data_binding.get('deviceTypes').count() > 0) {
                secondary_filter = FilterTypes({binding: _binding});
            } else if (primary_filter === 'tags' && data_binding.get('deviceTags').count() > 0) {
                secondary_filter =  FilterTags({binding: _binding});
            }

            if (secondary_filter) {
                return _.div({className: 'secondary-filters'}, secondary_filter);
            } else {
                return null;
            }
        },
        render: function () {
            var _ = React.DOM,
                __ = this.gls,
                binding = this.getDefaultBinding(),
                primaryFilter = binding.get('primaryFilter');

            return _.div({className: 'filters'},
                _.div({className: 'primary-filters'},
                    _.div({className: 'four columns'}),
                    _.div({className: 'columns filter-items'},
                        _.span({onClick: this.setPrimaryFilter.bind(null, 'all'), className: primaryFilter === 'all' ? 'filter selected' : 'filter'}, __('all','capitalize')),
                        _.span({onClick: this.setPrimaryFilter.bind(null, 'rooms'), className: primaryFilter === 'rooms' ? 'filter selected' : 'filter'}, __('rooms','capitalize')),
                        _.span({onClick: this.setPrimaryFilter.bind(null, 'types'), className: primaryFilter === 'types' ? 'filter selected' : 'filter'}, __('types','capitalize')),
                        _.span({onClick: this.setPrimaryFilter.bind(null, 'tags'), className: primaryFilter === 'tags' ? 'filter selected' : 'filter'}, __('tags','capitalize'))
                    ),
                    _.div({className: 'four columns search-container'},
                        BaseSearch({
                            binding: {
                                default: this.getDefaultBinding()
                            },
                            small: true,
                            search_attr: this.getDefaultBinding().sub('searchStringMainPanel')
                        })
                    )
                ),
                this.getSecondaryFilter()
            );
        }
    });
});
