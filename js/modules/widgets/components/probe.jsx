define([
    //mixins
    'mixins/data/js',
    '../mixins/positions_mixin'
], function (
    //mixins
    JSMixin,
    PositionsMixin
) {
    'use strict';

    return React.createClass({
        mixins: [Morearty.Mixin, JSMixin, PositionsMixin],
        render: function () {
            var binding = this.getDefaultBinding(),
                metrics_binding = binding.sub('metrics'),
                level = this.isFloat(metrics_binding.get('level')) ? metrics_binding.get('level').toFixed(1)
                    : metrics_binding.get('level'),
                scaleTitle = metrics_binding.get('scaleTitle') ? ' ' + metrics_binding.get('scaleTitle') : '';


            return (
                <div className='metrics-container'>
                    <span className='value-field'>{level + scaleTitle}</span>
                </div>
            );
        }
    });
});
