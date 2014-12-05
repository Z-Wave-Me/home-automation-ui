define([
    './xhr',
    './autosync'
], function (
    Xhr,
    AutoSync
    ) {
    "use strict";

    return {
        // interfaces
        autoSync: AutoSync,
        xhr: Xhr,
        // public
        getService: function (_serviceId) {
            var serviceId = _serviceId || this._serviceId,
                binding = this.getMoreartyContext().getBinding().sub('services').sub('collections'),
                service = binding.get().toArray().filter(function (service) {
                    return serviceId === service.toObject().id;
                });

            return service.length > 0 ? service[0].toObject() : null;
        },
        fetch: function (options, command) {
            var service = this.getService(options.serviceId || null),
                url;

            options = options || {};

            if (service) {
                if (options.hasOwnProperty('model')) {
                    if (options.model) {
                        url = service.url + '/' + this.getDefaultBinding().get('id');
                    } else {
                        url = service.url;
                    }
                } else {
                    url = this.isModel() ? service.url + '/' + this.getDefaultBinding().get('id') : service.url;
                }

                if (Boolean(command)) {
                    url += '/command/' + command;
                }

                this._read(url, options);
            } else {
                console.debug('incorrect _serviceId');
            }

            return false;
        },
        getLangFile: function (lang, callback) {
            var binding = this.getMoreartyContext().getBinding(),
                path_lang_file = binding.sub('default.system.path_lang_file').get();

            this._read(path_lang_file + '/language.' + lang + '.json', {
                success: callback,
                local_url: true
            });

        },
        save: function (options) {
            options = options || {};

            var that = this,
                model = options.model,
                collection = options.collection,
                serviceId =  options.serviceId,
                service = that.getService(serviceId),
                modelId = model.get('id'),
                url;

            if (!Boolean(serviceId)) {
                console.error('serviceId is not defined');
                return false;
            }

            if (Boolean(model)) {
                url = modelId ? service.url + '/' + modelId : service.url;
            } else if (collection) {
                url = service.url;
            }

            that.xhr.request({
                url: url,
                success: function (response) {
                    if (model && options.updateAfterSync) {
                        model.update(function (modelData) {
                            Object.keys(response.data).forEach(function (key) {
                                modelData.set('key', response.data[key]);
                            });

                            return modelData;
                        });
                    }

                    if (typeof options.success === 'function') {
                        options.success(model || collection, response.data);
                    }
                },
                params: options.params || {},
                method: model && modelId ? 'PUT' : 'POST',
                data: JSON.stringify(model.toJS())
            });
        },
        remove: function (options) {
            var that = this,
                model = options.model,
                collection = options.collection,
                serviceId = options.serviceId,
                service = that.getService(serviceId),
                url;

            if (Boolean(model)) {
                url = model.get('id') ? service.url + '/' + model.get('id') : service.url;
            } else if (collection) {
                url = service.url;
            }

            that.xhr.request({
                url: url,
                success: function (response) {
                    if (typeof options.success === 'function') {
                        options.success(model || collection, response.data)
                    }
                },
                params: options.params || {},
                method: 'DELETE'
            });
        },
        // private
        _read: function (url, _options) {
            this.xhr.request({
                url: url,
                success: _options.success,
                params: _options.params,
                cache: _options.cache || true,
                local_url: _options.local_url || null,
                method: 'GET',
                data: null
            });
        },
        _destroy: function (url, callback, _options) {
            this.xhr.request({
                url: url,
                success: callback,
                params: _options.params,
                method: 'DELETE'
            });
        },
        isModel: function () {
            return this.getDefaultBinding().get('id') || this._isModel;
        },
        enableAutoSync: function () {
            this.autoSync.init.call(this);
            this.autoSync.pull.call(this);
        },
        _compat: function (o) {
            Object.keys(o).forEach(function(k) {
                if (o[k] === undefined) {
                    delete o[k];
                }
            });
            return o;
        },
        _addModel: function (model, collection_name) {
            var that = this,
                ctx = that.getMoreartyContext(),
                dataBinding = ctx.getBinding().sub('data'),
                collection_binding = dataBinding.sub(collection_name);

            collection_binding.update(function (collection) {
                return collection.push(Immutable.fromJS(model));
            });
        },
        _updateModel: function (model, collection_name) {
            var that = this,
                ctx = that.getMoreartyContext(),
                dataBinding = ctx.getBinding().sub('data'),
                collection_binding = dataBinding.sub(collection_name),
                index = collection_binding.get().findIndex(function (device) {
                    return model.id === device.get('id');
                });

            collection_binding.sub(index).set(Immutable.fromJS(model));
        },
        _removeModel: function (ids, collection_name) {
            var that = this,
                ctx = that.getMoreartyContext(),
                dataBinding = ctx.getBinding().sub('data'),
                collection_binding = dataBinding.sub(collection_name);

            ids = Array.isArray(ids) ? ids : [ids];
            ids.forEach(function (id) {
                var index = collection_binding.get().findIndex(function (device) {
                    return id === device.get('id');
                });
                collection_binding.sub(index).delete();
            });
        },
        _getIndexModelFromCollection: function (modelId, collection_name) {
            var that = this,
                ctx = that.getMoreartyContext(),
                dataBinding = ctx.getBinding().sub('data'),
                collection_binding = dataBinding.sub(collection_name);

            return collection_binding.get().findIndex(function (device) {
                return modelId === device.get('id');
            });
        }
    };
});