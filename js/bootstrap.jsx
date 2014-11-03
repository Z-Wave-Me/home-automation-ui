/**
 * Bootstrap Application file.
 * @jsx React.DOM
 */

define(['App'], function (App) {
    'use strict';

    return React.createClass({
        mixins: [Morearty.Mixin],
        componentWillMount: function () {
            this.props.ctx.init(this);
        },

        render: function () {
            var ctx = this.props.ctx,
                app_binding = {
                    default: ctx.getBinding().sub('default'),
                    preferences: ctx.getBinding().sub('preferences'),
                    services: ctx.getBinding().sub('services'),
                    data: ctx.getBinding().sub('data')
                };
            return React.withContext({ morearty: ctx }, function () {
                return <App binding={ app_binding } />
            });
        }
    });
});