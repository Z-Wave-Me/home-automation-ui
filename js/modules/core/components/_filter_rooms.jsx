define([], function () {
    'use strict';

    return React.createClass({
        mixins: [Morearty.Mixin],
        componentDidMount: function () {
            var binding = this.getDefaultBinding(),
                data_binding = this.getBinding('data');

            if (data_binding.get('locations').size > 0) {
                binding.set('secondaryFilter', data_binding.sub('locations.0.id'));
            }
        },
        setSecondaryFilter: function (value) {
            this.getDefaultBinding().set('secondaryFilter', value);
        },
        render: function () {
            var that = this,
                cx = React.addons.classSet,
                binding = this.getDefaultBinding(),
                data_binding = this.getBinding('data'),
                secondary_filter = binding.get('secondaryFilter'),
                locations_binding = data_binding.sub('locations'),
                locations = locations_binding.get();

            return (
                <div className='filter-items'>
                    {locations.map(function (item) {
                        var id = item.get('id'),
                            ref = 'secondaryFilter-' + id,
                            title = item.get('title'),
                            css_classes = cx({
                                filter: true,
                                selected: secondary_filter === id
                            });

                        return (
                            <span
                                className={css_classes}
                                ref={ref}
                                onClick={that.setSecondaryFilter.bind(null, id)}
                                key={id}
                            >{title}</span>
                        );
                    }).toArray()}
                </div>
            );
        }
    });
});
