define([], function () {
    'use strict';

    return React.createClass({
        mixins: [Morearty.Mixin],
        render: function () {
            var _ = React.DOM,
                binding = this.getDefaultBinding(),
                rearrange_showing = this.getBinding('footer').get('rearrange_showing');

            return (
                <div className={'widget probe' +  binding.get('deviceType')}>
                    {rearrange_showing ? <div className='select-button'></div> : null}
                    <span className='icon' style={icon_style}></span>
                    <span className='title'>{binding.get('metrics.title')}</span>
                    {!rearrange_showing ?
                        <div className='metrics-container'>
                            <button className='quad-button up-button'>Up</button>
                            <button className='quad-button down-button'>Down</button>
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
