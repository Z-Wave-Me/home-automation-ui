define([], function () {
    'use strict';

    return {
        searchTree: function (element, matchingId, parent) {
            if (element.id === matchingId){
                return [element, parent || null];
            } else if (element.children !== null){
                var result = null;

                for (var i = 0; result === null && i < element.children.length; i += 1) {
                    result = this.searchTree(element.children[i], matchingId, element);
                }

                return result;
            }
            return null;
        },
        setActiveNode: function (nodeId) {
            var binding = this.getMoreartyContext().getBinding().sub('preferences');

            binding.set('activeNodeTreeId', nodeId);
            if (nodeId === 1) {
                binding.set('backButtonEnabled', false);
            } else {
                binding.set('backButtonEnabled', true);
            }
        },
        getActiveNodeTree: function () {
            var binding = this.getMoreartyContext().getBinding().sub('preferences'),
                activeNodeTreeId = binding.get('activeNodeTreeId'),
                activeNode = this.searchTree(binding.sub('tree').toJS(), activeNodeTreeId);

            return activeNode;
        },
        setActiveNodeTreeStatus: function (status) {
            this.getMoreartyContext().getBinding().sub('preferences').set('activeNodeTreeStatus', status);
        },
        setLeftPanelItemSelectedId: function (id) {
            this.getMoreartyContext().getBinding().sub('preferences').set('leftPanelItemSelectedId', id);
        },
        clearTemporaryData:function () {
            this.setActiveNodeTreeStatus('normal');
            this.getMoreartyContext().getBinding().sub('preferences').set('searchString', '');
            this.getMoreartyContext().getBinding().sub('preferences').set('searchStringLeftPanel', '');
            this.setLeftPanelItemSelectedId(null);
            this.setLeftPanelItemSelectedId('');
        }
    }
});
