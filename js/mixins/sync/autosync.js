define(['../data/manipulation'], function (manipulation) {
    "use strict";

    return ({
        init: function () {
            var that = this,
                ctx = this.getMoreartyContext(),
                defaultBinding = ctx.getBinding().sub('default'),
                servicesBinding = ctx.getBinding().sub('services'),
                dataBinding = ctx.getBinding().sub('data');

            // add local data
            that.getBinding('preferences').addListener('defaultProfileId', function (profileId) {
                localStorage.setItem('defaultProfileId', String(profileId));

                var profiles = dataBinding.sub('profiles'),
                    filter = profiles.get().filter(function (profile) {
                        return String(profile.get('id')) === String(profileId);
                    });

                dataBinding.set('devicesOnDashboard', filter.count() > 0 ? filter.toArray()[0].get('positions') : []);
            });

            defaultBinding.sub('system.current_language').addListener(function (lang) {
                localStorage.setItem('currentLanguage', String(lang));
            });

            dataBinding.addListener('profiles', function (change_descriptor) {

                var profiles = dataBinding.get('profiles'),
                    activeId = localStorage.getItem('defaultProfileId'),
                    filter = profiles.filter(function (profile) {
                        return typeof profile.get === 'function' ? String(profile.get('id')) === String(activeId) : null;
                    });

                dataBinding.set('devicesOnDashboard', filter.size > 0 ? filter.first().get('positions') : []);
            });

            dataBinding.addListener('notifications', function () {
                defaultBinding.sub('notifications').set('count', dataBinding.sub('notifications').get().count());
            });
        },
        pull: function () {
            var that = this,
                functions = {},
                ctx = that.getMoreartyContext(),
                servicesBinding = ctx.getBinding().sub('services'),
                dataBinding = ctx.getBinding().sub('data'),
                collections = servicesBinding.sub('collections'),
                languages_binding = ctx.getBinding().sub('default.system.languages');

            languages_binding.get().forEach(function (lang) {
                that.getLangFile(lang, function (response) {
                    dataBinding.update('languages', function (languages) {
                        return languages.push(Immutable.fromJS({
                            id: lang,
                            data: response
                        }));
                    });

                    ctx.getBinding().sub('default.system.loaded_percentage').update(function (percantage) {
                        return percantage + ((1 / languages_binding.get().count()) * 50);
                    });

                    if (dataBinding.sub('languages').get().count() === languages_binding.get().count()) {
                        ctx.getBinding().sub('default.system.loaded_lang_files').set(true);
                    }
                });
            });

            collections.get().forEach(function (collection, index) {
                var obj = collection.toJS();

                functions[obj.id] = manipulation.debounce(function (callback) {
                    var params = typeof obj.params === 'object' ? obj.params : {};

                    if (obj.sinceField) {
                        params.since = dataBinding.get(obj.sinceField) || 0;
                    }

                    that.fetch({
                        serviceId: obj.id,
                        params: Object.keys(params).length > 0 ? params : null,
                        success: function (response) {
                            if (callback && typeof callback === 'function') {
                                callback(response);
                            }

                            if (obj.hasOwnProperty('postSyncHandler')) {
                                obj.postSyncHandler.call(that, ctx, response, dataBinding.sub(obj.id));
                            }

                            if (response.data) {
                                var models = obj.hasOwnProperty('parse') ? obj.parse(response, ctx) : response.data;
                                if (typeof obj.save === 'function') {
                                    obj.save(ctx, dataBinding, models);
                                } else if (models.length > 0) {
                                    models.forEach(function (model) {
                                        if (!dataBinding.sub(obj.id).get()) {
                                            dataBinding.set(obj.id, Immutable.List());
                                        }

                                        var index_model = dataBinding.sub(obj.id).get().findIndex(function (md) {
                                            return md.get('id') === model.id;
                                        });

                                        if (index_model !== -1) {
                                            dataBinding.sub(obj.id + '.' + index_model).set(Immutable.fromJS(model));
                                        } else {
                                            dataBinding.sub(obj.id).update(function (sub) {
                                                return sub.push(Immutable.fromJS(model));
                                            });
                                        }
                                    });
                                }
                            }

                            if (collections.sub(index).get('loaded') === false) {
                                collections.sub(index).set('loaded', true);
                                ctx.getBinding().sub('default.system.loaded_percentage').update(function (percantage) {
                                    return percantage + ((1 / collections.get().count()) * 50);
                                });

                                if (collections.get().every(function (c) {
                                    return c.get('loaded') === true;
                                })) {
                                    ctx.getBinding().sub('default.system.loaded').set(true);
                                }
                            }
                        }
                    });
                }, 300);

                if (obj.autoSync) {
                    setTimeout(functions[obj.id].bind(this, function () {
                        setInterval(function () {
                            if (collections.sub(index).get('loaded')) {
                                functions[obj.id]();
                            }
                        }, obj.delay || 1000);
                    }), 0);
                } else {
                    setTimeout(functions[obj.id], obj.delay || 0);
                }

                if (obj.id === 'namespaces') {
                    that.getBinding('data').addListener('devices', functions.namespaces);
                }
            });
        },
        equals: function ( x, y ) {
            if ( x === y ) return true;
            // if both x and y are null or undefined and exactly the same

            if ( ! ( x instanceof Object ) || ! ( y instanceof Object ) ) return false;
            // if they are not strictly equal, they both need to be Objects

            if ( x.constructor !== y.constructor ) return false;
            // they must have the exact same prototype chain, the closest we can do is
            // test there constructor.

            for ( var p in x ) {
                if ( ! x.hasOwnProperty( p ) ) continue;
                // other properties were tested using x.constructor === y.constructor

                if ( ! y.hasOwnProperty( p ) ) return false;
                // allows to compare x[ p ] and y[ p ] when set to undefined

                if ( x[ p ] === y[ p ] ) continue;
                // if they have the same strict value or identity then they are equal

                if ( typeof( x[ p ] ) !== "object" ) return false;
                // Numbers, Strings, Functions, Booleans must be strictly equal

                if ( ! this.equals( x[ p ],  y[ p ] ) ) return false;
                // Objects and Arrays must be tested recursively
            }

            for ( p in y ) {
                if ( y.hasOwnProperty( p ) && ! x.hasOwnProperty( p ) ) return false;
                // allows x[ p ] to be set to undefined
            }
            return true;
        }
    });
});