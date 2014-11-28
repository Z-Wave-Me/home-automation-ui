define([], function () {
    'use strict';

    return React.createClass({
        mixins: [Morearty.Mixin],
        componentDidMount: function () {
            var binding = this.getDefaultBinding(),
                data_binding = this.getBinding('data');

            if (data_binding.get('deviceTypes').count() > 0) {
                binding.set('secondaryFilter', data_binding.get('deviceTypes').first());
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
                types = Immutable.List(data_binding.get('deviceTypes')).sort();

            return (
                <div className='filter-items'>
                    {types.map(function(type) {
                        var ref = 'secondaryFilter-' + type,
                            css_classes = cx({
                                filter: true,
                                selected: secondary_filter === type
                            });

                        return (
                            <span
                                ref={ref}
                                onClick={that.setSecondaryFilter.bind(null, type)}
                                className={css_classes}
                                key={type}
                            >{type}</span>
                        );
                    }).toArray()}
                </div>
            );
        }
    });
});
