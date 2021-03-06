/**
 * Created by kinneretzin on 29/11/2016.
 */

class BlueprintActions {
    constructor(toolbox) {
        this.toolbox = toolbox;
    }

    doGetBlueprints() {
        return this.toolbox.getManager().doGet('/blueprints?_include=id');
    }

    doGetFullBlueprintData(blueprint) {
        return this.toolbox.getManager().doGet(`/blueprints/${blueprint.id}`);
    }

    doDelete(blueprint) {
        return this.toolbox.getManager().doDelete(`/blueprints/${blueprint.id}`)
            .then(()=>this.doDeleteImage(blueprint.id));
    }

    doDeploy(blueprint, deploymentId, inputs, visibility, skipPluginsValidation=false) {
        return this.toolbox.getManager().doPut(`/deployments/${deploymentId}`, null, {
            'blueprint_id': blueprint.id,
            inputs,
            visibility,
            skip_plugins_validation:skipPluginsValidation
        });
    }

    doUpload(blueprintName, blueprintFileName, blueprintUrl, file, imageUrl, image, visibility) {
        var params = {visibility: visibility};

        if (!_.isEmpty(blueprintFileName)) {
            params['application_file_name'] = blueprintFileName;
        }
        if (!_.isEmpty(blueprintUrl)) {
            params['blueprint_archive_url'] = blueprintUrl;
        }

        var promise;
        if (file) {
            promise = this.toolbox.getManager().doUpload(`/blueprints/${blueprintName}`, params, file);
        } else {
            promise = this.toolbox.getManager().doPut(`/blueprints/${blueprintName}`, params);
        }

        return promise.then(()=> this.doUploadImage(blueprintName, imageUrl, image));
    }

    doSetVisibility(blueprintId, visibility) {
        return this.toolbox.getManager().doPatch(`/blueprints/${blueprintId}/set-visibility`, null, {visibility: visibility});
    }

    doListYamlFiles(blueprintUrl, file) {
        if (file) {
            return this.toolbox.getInternal().doUpload('/source/list/yaml', null, {archive: file});
        } else {
            return this.toolbox.getInternal().doPut('/source/list/yaml', {url: blueprintUrl});
        }
    }

    doUploadImage(blueprintId, imageUrl, image) {
        if (_.isEmpty(imageUrl) && !image) {
            return Promise.resolve();
        }

        var params = {imageUrl};
        if (image) {
            return this.toolbox.getInternal().doUpload(`/ba/image/${blueprintId}`, params, image, 'post');
        } else {
            return this.toolbox.getInternal().doPost(`/ba/image/${blueprintId}`, params);
        }
    }

    doDeleteImage(blueprintId) {
        return this.toolbox.getInternal().doDelete(`/ba/image/${blueprintId}`);
    }

}

Stage.defineCommon({
    name: 'BlueprintActions',
    common: BlueprintActions
});