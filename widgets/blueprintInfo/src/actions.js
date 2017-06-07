/**
 * Created by pposel on 24/05/2017.
 */

export default class Actions {

    constructor(toolbox) {
        this.toolbox = toolbox;
    }

    doGetBlueprintId(deploymentId) {
        return this.toolbox.getManager().doGet(`/deployments/${deploymentId}?_include=id,blueprint_id`);
    }

    doGetBlueprintDetails(blueprintId) {
        return this.toolbox.getManager().doGet(`/blueprints/${blueprintId}?_include=id,updated_at,created_at,description,created_by,private_resource`);
    }

}