define(function () {
    "use strict";

    return {
        getModuleById: function (moduleId) {
            var root_binding = this.getMoreartyContext().getBinding(),
                modules_binding = root_binding.sub('data.modules');

            if (moduleId) {
                var index = modules_binding.get().findIndex(function (_module) {
                    return _module.get('id') === moduleId;
                });
                if (index !== -1) {
                    return modules_binding.sub(index);
                } else {
                    return null;
                }
            } else {
                return null;
            }
        },
        getInstanceById: function (instanceId) {
            var root_binding = this.getMoreartyContext().getBinding(),
                insatnces_binding = root_binding.sub('data.instances');

            if (instanceId) {
                var index = insatnces_binding.get().findIndex(function (_module) {
                    return _module.get('id') === instanceId;
                });
                if (index !== -1) {
                    return insatnces_binding.sub(index);
                } else {
                    return null;
                }
            } else {
                return null;
            }
        }
    };
});