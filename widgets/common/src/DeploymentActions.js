/**
 * Created by kinneretzin on 19/10/2016.
 */

class DeploymentActions {
    constructor(toolbox) {
        this.toolbox = toolbox;
    }

    doGet(deployment) {
        return this.toolbox.getManager().doGet(`/deployments/${deployment.id}`);
    }

    doDelete(deployment) {
        return this.toolbox.getManager().doDelete(`/deployments/${deployment.id}`);
    }

    doForceDelete(deployment) {
        return this.toolbox.getManager().doDelete(`/deployments/${deployment.id}`, {ignore_live_nodes: 'true'});
    }

    doCancel(execution,action) {
        return this.toolbox.getManager().doPost(`/executions/${execution.id}`, null, {
            'deployment_id': execution.deployment_id,
            'action': action
        });
    }

    doExecute(deployment, workflow, params, force) {
        return this.toolbox.getManager().doPost('/executions',null,{
            'deployment_id': deployment.id,
            'workflow_id' : workflow.name,
            force,
            parameters: params
        });
    }

    doUpdate(deploymentName, blueprintName, deploymentInputs={},
             shouldRunInstallWorkflow=true, shouldRunUninstallWorkflow=true, forceUpdate=false) {
        let data = {};

        if (!_.isEmpty(blueprintName)) {
            data['blueprint_id'] = blueprintName;
        }

        data['skip_install'] = !shouldRunInstallWorkflow;
        data['skip_uninstall'] = !shouldRunUninstallWorkflow;
        data['force'] = forceUpdate;

        if (!_.isEmpty(deploymentInputs)) {
            data['inputs'] = deploymentInputs;
        }

        return this.toolbox.getManager().doPut(`/deployment-updates/${deploymentName}/update/initiate`, null, data);
    }

    doSetVisibility(deploymentId, visibility){
        return this.toolbox.getManager().doPatch(`/deployments/${deploymentId}/set-visibility`, null, {visibility: visibility});
    }

}

Stage.defineCommon({
    name: 'DeploymentActions',
    common: DeploymentActions
});