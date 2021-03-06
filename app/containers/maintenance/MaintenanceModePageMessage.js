/**
 * Created by pposel on 16/02/2017.
 */
import MaintenanceModePageMessage from '../../components/maintenance/MaintenanceModePageMessage';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import stageUtils from '../../utils/stageUtils';
import Consts from '../../utils/consts';

const mapStateToProps = (state, ownProps) => {
    var canMaintenanceMode = stageUtils.isUserAuthorized(Consts.permissions.STAGE_MAINTENANCE_MODE, state.manager);
    return {
        manager: state.manager,
        canMaintenanceMode
    }
};
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        navigateToHome: () => {
            return dispatch(push('/'));
        }
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MaintenanceModePageMessage);