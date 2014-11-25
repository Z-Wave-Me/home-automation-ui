define([], function () {
    'use strict';

    return {
        getCollection: function (collectionName) {
            var ctx = this.getMoreartyContext(),
                dataBinding = ctx.getBinding().sub('data.' + collectionName);

            return dataBinding;
        },
        getModelFromCollection: function (id, collectionName) {
            var ctx = this.getMoreartyContext(),
                dataBinding;

            id = id || ctx.getBinding().sub('preferences').get('leftPanelItemSelectedId');

            dataBinding = this.getCollection(collectionName);

            if (id) {
                var item = dataBinding.get().find(function (data) {
                        return data.get('id') === id;
                    }),
                    index = dataBinding.get().indexOf(item);

                return dataBinding.sub(index);
            } else {
                return null;
            }
        },
        addModelToCollection: function (collection, model) {
            collection.update(function (collection) {
                collection.push(Immutable.Map(model.get().toJS()));
            });
        },
        getItem: function (serviceId, itemId) {
            var ctx = this.getMoreartyContext(),
                preferences = ctx.getBinding().sub('preferences'),
                filterObject = ctx.getBinding().get('services.collections').toArray().filter(function (service) {
                    return serviceId === service.get('id');
                }),
                service = Array.isArray(filterObject) && filterObject.length > 0 ? filterObject[0].toJS() : null,
                default_model_options = service ? service.model.defaults : null;

            if (preferences.get('activeNodeTreeStatus') === 'add') {
                preferences.set('temp', Immutable.Map(default_model_options));
                return preferences.sub('temp');
            } else {
                return this.getModelFromCollection(itemId || null, serviceId);
            }
        },
        getActiveProfile: function () {
            var ctx = this.getMoreartyContext(),
                activeId = localStorage.getItem('defaultProfileId'),
                profiles = ctx.getBinding().get('data.profiles'),
                size = profiles.size,
                index = profiles.findIndex(function (profile) {
                    return String(profile.get('id')) === String(activeId);
                });

            if (size > 0 && index !== -1) {
                return ctx.getBinding().sub('data.profiles.' + index);
            } else if (size > 0 && index === -1) {
                return ctx.getBinding().sub('data.profiles.' + 0);
            } else {
                return null;
            }
        },
        getOriginalModule: function (moduleId) {
            var ctx = this.getMoreartyContext(),
                modules_original = ctx.getBinding().sub('data.modules_original').get().toJS();

            var filter = modules_original.filter(function (module) {
                    return module.id === moduleId;
                });

            if (filter.length > 0) {
                return filter[0];
            } else {
                return null;
            }
        },
        showInDashBoard: function (deviceId) {
            var profile = this.getActiveProfile();
            if (profile) {
                return profile.get('positions').indexOf(deviceId) !== -1;
            } else {
                return false;
            }
        },
        isUsedSingletonModule: function (moduleId) {
            var ctx = this.getMoreartyContext(),
                instances_binding = ctx.getBinding().sub('data.instances'),
                _module = this.getModelFromCollection(moduleId, 'modules'),
                is_singleton = _module.get('singleton');

            if (is_singleton) {
                return instances_binding.get().some(function (instance) {
                    return instance.get('moduleId') === moduleId;
                });
            } else {
                return false;
            }
        },
        updateObjectAsNamespace: function (model) {
            var that = this,
                default_options = {
                    focus: true,
                    type: 'object',
                    validate: true,
                    disabled: false,
                    showMessages: false,
                    collapsible: true,
                    legendStyle: 'button',
                    toolbarSticky: true,
                    renderForm: false
                };

            Object.keys(default_options).forEach(function (key) {
                if (!model.options.hasOwnProperty(key)) {
                    model.options[key] = default_options[key];
                }
            });

            return that._r(model);

        },
        _getNamespace: function (path, key) {
            var ctx = this.getMoreartyContext(),
                namespaces_binding = ctx.getBinding().sub('data.namespaces'),
                index = namespaces_binding.get().findIndex(function (namespace) {
                    return namespace.get('id') === path;
                });

            if (index !== -1) {
                return namespaces_binding.sub(index).get('params').map(function (param) {
                    return param.get(key);
                }).toJS();
            } else {
                return [];
            }
        },
        _r: function (obj) {
            var namespace, that = this, key, arr = [];

            if (obj) {
                for (key in obj) {
                    if (typeof obj[key] === 'object' && obj[key] !== null) {
                        if (obj[key].type === 'array' || obj[key].type === 'object') {
                            if (!obj[key].hasOwnProperty('toolbarSticky')) {
                                obj[key].toolbarSticky = true;
                            }

                            if (!obj[key].hasOwnProperty('helper')) {
                                obj[key].helper = '';
                            }
                        }
                        that._r(obj[key]);
                    } else if (typeof obj[key] === 'string') {
                        if (obj[key].indexOf('namespaces') !== -1 && obj[key].split(':').length > 1) {
                            obj[key].split(',').forEach(function (val) {
                                namespace = that._getNamespace(val.split(':')[1], val.split(':')[2]) || [];
                                if (namespace) {
                                    arr = arr.concat(namespace);
                                }
                            });

                            obj[key] = arr || [];
                            arr = [];
                        }
                    }
                }
            }
            return obj;
        }
    };
});
