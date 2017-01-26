/**
 * Created by kinneretzin on 19/10/2016.
 */


export default class {
    constructor(toolbox) {
        this.toolbox = toolbox;
    }

    doDelete(blueprint) {
        return this.toolbox.getManager().doDelete(`/deployments/${blueprint.id}`);
    }

    doExecute(deployment,workflow,params) {
        return this.toolbox.getManager().doPost('/executions',null,{
            'deployment_id': deployment.id,
            'workflow_id' : workflow.name,
            parameters: params
        });
    }

    doUpdate(deploymentName, applicationFileName, blueprintArchiveUrl, defaultWorkflow,
             installWorkflow, uninstallWorkflow, workflowId, blueprintArchive, inputs) {
        var params = {};
        if (!_.isEmpty(applicationFileName)) {
            params['application_file_name'] = applicationFileName + ".yaml";
        }
        if (!_.isEmpty(blueprintArchiveUrl)) {
            params['blueprint_archive_url'] = blueprintArchiveUrl;
        }
        if (defaultWorkflow) {
            params['skip_install'] = !installWorkflow;
            params['skip_uninstall'] = !uninstallWorkflow;
        } else {
            params['workflow_id'] = workflowId;
        }

        var files = {};
        if (blueprintArchive) {
            files['blueprint_archive'] = blueprintArchive;
        }
        if (inputs) {
            files['inputs'] = inputs;
        }

        return this.toolbox.getManager().doUpload(`/deployment-updates/${deploymentName}/update/initiate`, params, files, 'post');
    }

}