/**
 * Created by kinneretzin on 10/11/2016.
 */

import StageUtils from './stageUtils';
import External from './External';
import Internal from './Internal';
import Cookies from 'js-cookie';

export default class Auth {

    static login(username,password) {
        var external = new External({basicAuth: btoa(`${username}:${password}`)});
        return external.doPost(StageUtils.url('/auth/login'), null, null, true, null, true);
    }

    static getUserData(managerData){
        var internal = new Internal(managerData);
        return internal.doGet('/auth/user', null, true);
    }

    static logout(managerData) {
        var internal = new Internal(managerData);
        return internal.doPost('/auth/logout', null, null, true, null, true);
    }

    static isLoggedIn(){
        return !!Cookies.get('XSRF-TOKEN');
    }

    static getRBACConfig(managerData){
        var internal = new Internal(managerData);
        return internal.doGet('/auth/RBAC', null, true);
    }
}
