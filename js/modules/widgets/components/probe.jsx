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
                rearrange_showing = this.getBinding('footer').get('rearrange_showing'),
                metrics_binding = binding.sub('metrics'),
                level = this.isFloat(metrics_binding.get('level')) ? metrics_binding.get('level').toFixed(1)
                    : metrics_binding.get('level'),
                scaleTitle = metrics_binding.get('scaleTitle') ? ' ' + metrics_binding.get('scaleTitle') : '',
                icon_style = {'backgroundImage': 'url(' + metrics_binding.get('icon') + ')'};


            return (
                <div className={'widget probe ' + binding.get('deviceType')}>
                    {rearrange_showing ? <div className='select-button'></div> : null}
                    <span className='icon' style={icon_style}></span>
                    <span className='title'>{metrics_binding.get('title')}</span>
                    {!rearrange_showing ?
                        <div className='metrics-container'>
                            <span className='value-field'>{level + scaleTitle}</span>
                        </div> :
                        <div className='settings-container'>
                            <span className='setting fa-gear fa'></span>
                        </div>
                    }
                </div>
            );
        }
    });
});
