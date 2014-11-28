define([], function () {
    'use strict';

    return React.createClass({
        mixins: [Morearty.Mixin],
        componentDidMount: function () {
            var binding = this.getDefaultBinding(),
                data_binding = this.getBinding('data');

            if (data_binding.get('deviceTags').count() > 0) {
                binding.set('secondaryFilter', data_binding.get('deviceTags').first());
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
                tags = Immutable.List(data_binding.get('deviceTags')).sort();

            return (
                <div className='filter-items'>
                    {tags.map(function(tag) {
                        var ref = 'secondaryFilter-' + tag,
                            css_classes = cx({
                                filter: true,
                                selected: secondary_filter === tag
                            });

                        return (
                            <span
                                ref={ref}
                                onClick={that.setSecondaryFilter.bind(null, tag)}
                                className={css_classes}
                                key={tag}
                            >{tag}</span>
                        );
                    }).toArray()}
                </div>
            );
        }
    });
});
