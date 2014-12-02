define([
    // components
    'jsx!./_filter_rooms',
    'jsx!./_filter_tags',
    'jsx!./_filter_types',
    'jsx!Preferences/components/common/base_search'
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
        },
        getSecondaryFilter: function () {
            var default_binding = this.getDefaultBinding(),
                data_binding = this.getBinding('data'),
                primary_filter = default_binding.get('primaryFilter'),
                filter_binding = { default: default_binding, data: data_binding },
                SecondaryFilter = null;

            if (primary_filter === 'rooms' && data_binding.get('locations').count() > 0) {
                SecondaryFilter = <FilterRooms binding={filter_binding} />;
            } else if (primary_filter === 'types' && data_binding.get('deviceTypes').count() > 0) {
                SecondaryFilter = <FilterTypes binding={filter_binding} />;
            } else if (primary_filter === 'tags' && data_binding.get('deviceTags').count() > 0) {
                SecondaryFilter =  <FilterTags binding={filter_binding} />;
            }

            if (SecondaryFilter !== null) {
                return <div className='secondary-filters'>{SecondaryFilter}</div>;
            } else {
                return null;
            }
        },
        render: function () {
            var __ = this.gls,
                binding = this.getDefaultBinding(),
                primaryFilter = binding.get('primaryFilter');

            return (
                <div className='filters'>
                    <div className='primary-filters'>
                        <div className='four columns'></div>
                        <div className='columns filter-items'>
                            <span
                                className={primaryFilter === 'all' ? 'filter selected' : 'filter'}
                                onClick={this.setPrimaryFilter.bind(null, 'all')}
                            >{__('all','capitalize')}</span>
                            <span
                                className={primaryFilter === 'rooms' ? 'filter selected' : 'filter'}
                                onClick={this.setPrimaryFilter.bind(null, 'rooms')}
                            >{__('rooms','capitalize')}</span>
                            <span
                                className={primaryFilter === 'types' ? 'filter selected' : 'filter'}
                                onClick={this.setPrimaryFilter.bind(null, 'types')}
                            >{__('types','capitalize')}</span>
                            <span
                                className={primaryFilter === 'tags' ? 'filter selected' : 'filter'}
                                onClick={this.setPrimaryFilter.bind(null, 'tags')}
                            >{__('tags','capitalize')}</span>
                        </div>
                        <div className='four columns search-container'>
                            <BaseSearch binding={binding.sub('searchStringMainPanel')} small={true}/>
                        </div>
                    </div>
                    {this.getSecondaryFilter()}
                </div>
            );
        }
    });
});
