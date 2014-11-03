define([], function () {
    'use strict';

    return React.createClass({
        mixins: [Morearty.Mixin],
        componentWillMount: function () {
            var that = this;
            that.getBinding('data').addListener('deviceTags', function () {
                if (that.isMounted()) {
                    that.forceUpdate();
                }
            });
        },
        componentDidMount: function () {
            var binding = this.getDefaultBinding(),
                dataBinding = this.getBinding('data');

            if (dataBinding.get('deviceTags').count() > 0) {
                binding.set('secondaryFilter', dataBinding.get('deviceTags').first());
            }
        },
        setSecondaryFilter: function (value) {
            this.getDefaultBinding().set('secondaryFilter', value);
            return false;
        },
        render: function () {
            var that = this,
                binding = this.getDefaultBinding(),
                dataBinding = this.getBinding('data'),
                _ = React.DOM,
                secondaryFilter = binding.get('secondaryFilter'),
                tagsBinding = dataBinding.sub('deviceTags'),
                tags = tagsBinding.toJS();

            return _.div({className: 'secondary-filters'},
                tags
                    .map(function (tag) {
                        return _.div({
                            onClick: that.setSecondaryFilter.bind(null, tag),
                            className: secondaryFilter === tag ? 'secondary-filter selected' : 'secondary-filter',
                            key: tag
                        }, tag);
                    })
            );
        }
    });
});
