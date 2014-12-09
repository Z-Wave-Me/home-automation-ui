define([], function () {
    "use strict";

    return React.createClass({
        mixins: [Morearty.Mixin],
        propTypes: {
            items: React.PropTypes.array.isRequired
        },
        render: function () {

            return (
                <div className='material paper-container'>
                    <div className="menu visible paper z-depth-1 rounded">
                        <div className="paper z-depth-bottom">
                            {this.props.items.map(function (item) {
                                return (
                                    <div className="menu-item">
                                        <div className="ripple"></div>
                                        <span className="menu-item-icon icon mdfi_home"></span>
                                        <span className="title">{item.title}</span>
                                        <span className="menu-item-data">{item.data}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            );
        }
    })
});