define(function () {
    "use strict";

    return {
        getActiveProfile: function () {
            var root_binding = this.getMoreartyContext().getBinding(),
                profiles_binding = root_binding.sub('data.profiles'),
                local_profile_id = localStorage.getItem('defaultProfileId');

            if (profiles_binding.get().size > 0) {
                if (!!local_profile_id) {
                    var index = profiles_binding.get().findIndex(function (profile) {
                        return profile.get('id') === local_profile_id;
                    });

                    if (index !== -1) {
                        profiles_binding.sub(index);
                    } else {
                        return profiles_binding.sub(0);
                    }
                } else {
                    return profiles_binding.sub(0);
                }
            } else {
                new Error('Application error: profiles_binding is empty');
                return null;
            }
        },
        isExistDeviceInPositions: function (device_id) {
            var active_profile = this.getActiveProfile();

            if (active_profile !== null) {
                var index = active_profile.get('positions').findIndex(function (pos) {
                    return pos === device_id;
                });

                return index !== -1;
            } else {
                return false;
            }
        },
        addDeviceToPositions: function (device_id) {
            var active_profile = this.getActiveProfile();

            if (active_profile !== null) {
                active_profile.update('positions', function (positions) {
                    if (positions.indexOf(device_id) === -1) {
                        return positions.push(device_id);
                    } else {
                        return positions;
                    }
                });
            }
        },
        removeDeviceFromPositions: function (device_id) {
            var active_profile = this.getActiveProfile();

            if (active_profile !== null) {
                active_profile.update('positions', function (positions) {
                    return positions.filter(function (pos) {
                        return pos !== device_id;
                    });
                });
            }
        }
    }
});