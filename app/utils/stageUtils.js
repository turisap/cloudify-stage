/**
 * Created by pawelposel on 09/11/2016.
 */

import md5 from 'blueimp-md5';
import Const from './consts';
import {getToolbox} from './Toolbox';
import _ from 'lodash';

export default class StageUtils {

    static makeCancelable(promise) {
        let hasCanceled_ = false;

        const wrappedPromise = new Promise((resolve, reject) => {
            promise.then((val) =>
                hasCanceled_ ? reject({isCanceled: true}) : resolve(val)
            );
            promise.catch((error) =>
                hasCanceled_ ? reject({isCanceled: true}) : reject(error)
            );
        });

        return {
            promise: wrappedPromise,
            cancel() {
                hasCanceled_ = true;
            },
        };
    };

    static formatTimestamp(timestamp, outputPattern='DD-MM-YYYY HH:mm', inputPattern='YYYY-MM-DD HH:mm:ss') {
        return moment.utc(timestamp, inputPattern).local().format(outputPattern);
    }

    static formatLocalTimestamp(timestamp, outputPattern='DD-MM-YYYY HH:mm', inputPattern=undefined) {
        return moment(timestamp, inputPattern).format(outputPattern);
    }

    /**
     * Replace all occurrences of <Tag attr1="value1" attr1="value2" ...> to "tag value1 value2 ..."
     * @param message
     * @returns {*}
     */
    static resolveMessage(message) {
        var tagPattern = /<(\w+)[^<]*>/;
        var attrPattern = /(\w+)=[',",`]([^',^",^`]+)[',",`]/g;

        var matchedTag, matchedAttr, sentence = '';
        while (matchedTag = tagPattern.exec(message)) {
            var tag = matchedTag[0];
            var sentence = matchedTag[1].toLowerCase();

            var attributes = [];
            while (matchedAttr = attrPattern.exec(tag)) {
                attributes.push({key: matchedAttr[1], value: matchedAttr[2]});
            }

            if (attributes.length > 0) {
                if (attributes.length > 1) {
                    sentence += ' with';
                    _.each(attributes,(item, index)=> {
                        sentence += `  ${item.key}=${item.value} ${(index < attributes.length - 1) ? ' and' : ''}`;
                    })
                } else {
                    sentence += `  ${attributes[0].value}`;
                }
            }

            message = message.replace(tag, sentence);
        }

        return message;
    }

    static getMD5(str) {
        return md5(str);
    }

    static url(path) {
        if (path === '/') {
            return Const.CONTEXT_PATH;
        }

        return Const.CONTEXT_PATH + (_.startsWith(path, '/') ? '' : '/') + path;
    }

    static buildConfig(widgetDefinition) {
        var configs = {};

        _.each(widgetDefinition.initialConfiguration,(config)=>{
            if (!config.id) {
                console.log('Cannot process config for widget :"'+widgetDefinition.name+'" , because it missing an Id ',config);
                return;
            }

            var value = config.default && !config.value ? config.default : (_.isUndefined(config.value) ? null : config.value );

            configs[config.id] = Stage.Basic.GenericField.formatValue(config.type, value);
        });

        return configs;
    };

    static getToolbox(onRefresh, onLoading, widgetId) {
        return getToolbox(onRefresh, onLoading, widgetId);
    }

    static isUserAuthorized(permission, managerData) {
        var authorizedRoles = managerData.permissions[permission];

        var systemRole = managerData.auth.role;
        var groupSystemRoles = _.keys(managerData.auth.groupSystemRoles);
        var currentTenantRoles = managerData.auth.tenantsRoles[managerData.tenants.selected];
        var tenantRoles = currentTenantRoles ? currentTenantRoles.roles : [];
        var userRoles = _.uniq(tenantRoles.concat(systemRole, groupSystemRoles));
        return _.intersection(authorizedRoles, userRoles).length > 0;
    }
}