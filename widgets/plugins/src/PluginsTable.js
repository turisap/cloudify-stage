/**
 * Created by kinneretzin on 02/10/2016.
 */

import Actions from './actions';
import UploadModal from './UploadPluginModal';

export default class extends React.Component {

    constructor(props,context) {
        super(props,context);

        this.state = {
            error: null,
            confirmDelete: false
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !_.isEqual(this.props.widget, nextProps.widget)
            || !_.isEqual(this.state, nextState)
            || !_.isEqual(this.props.data, nextProps.data);
    }

    _selectPlugin (item){
        var oldSelectedPluginId = this.props.toolbox.getContext().getValue('pluginId');
        this.props.toolbox.getContext().setValue('pluginId',item.id === oldSelectedPluginId ? null : item.id);
    }

    _deletePluginConfirm(item,event){
        event.stopPropagation();

        this.setState({
            confirmDelete: true,
            item: item
        });
    }

    _downloadPlugin(item,event) {
        event.stopPropagation();

        let actions = new Actions(this.props.toolbox);
        actions.doDownload(item)
               .then(() => {this.setState({error: null})})
               .catch((err) => {this.setState({error: err.message})});
    }

    _deletePlugin() {
        if (!this.state.item) {
            this.setState({error: 'Something went wrong, no plugin was selected for delete'});
            return;
        }

        var actions = new Actions(this.props.toolbox);
        actions.doDelete(this.state.item)
            .then(()=> {
                this.setState({confirmDelete: false, error: null});
                this.props.toolbox.getEventBus().trigger('plugins:refresh');
            })
            .catch(err=>{
                this.setState({confirmDelete: false, error: err.message});
            });
    }

    _setPluginAvailability(pluginId, availability) {
        var actions = new Actions(this.props.toolbox);
        this.props.toolbox.loading(true);
        actions.doSetAvailability(pluginId, availability)
            .then(()=> {
                this.props.toolbox.loading(false);
                this.props.toolbox.refresh();
            })
            .catch((err)=>{
                this.props.toolbox.loading(false);
                this.setState({error: err.message});
            });
    }

    _refreshData() {
        this.props.toolbox.refresh();
    }

    componentDidMount() {
        this.props.toolbox.getEventBus().on('plugins:refresh',this._refreshData,this);
    }

    componentWillUnmount() {
        this.props.toolbox.getEventBus().off('plugins:refresh',this._refreshData);
    }

    fetchGridData(fetchParams) {
        return this.props.toolbox.refresh(fetchParams);
    }

    render() {
        var {Confirm, ErrorMessage, DataTable, ResourceAvailability} = Stage.Basic;

        return (
            <div>
                <ErrorMessage error={this.state.error} onDismiss={() => this.setState({error: null})} autoHide={true}/>

                <DataTable fetchData={this.fetchGridData.bind(this)}
                           totalSize={this.props.data.total}
                           pageSize={this.props.widget.configuration.pageSize}
                           sortColumn={this.props.widget.configuration.sortColumn}
                           sortAscending={this.props.widget.configuration.sortAscending}
                           selectable={true}
                           className="pluginsTable">

                    <DataTable.Column label="Id" name="id" width="20%"/>
                    <DataTable.Column label="Package name" name="package_name" width="10%"/>
                    <DataTable.Column label="Package version" name="package_version" width="10%"/>
                    <DataTable.Column label="Supported platform" name="supported_platform" width="10%"/>
                    <DataTable.Column label="Distribution" name="distribution" width="10%"/>
                    <DataTable.Column label="Distribute release" name="distribution_release" width="10%"/>
                    <DataTable.Column label="Uploaded at" name="uploaded_at" width="10%"/>
                    <DataTable.Column label="Creator" name='created_by' width="10%"/>
                    <DataTable.Column width="10%"/>

                    {
                        this.props.data.items.map((item)=>{
                            return (
                                <DataTable.Row key={item.id} selected={item.isSelected} onClick={this._selectPlugin.bind(this, item)}>
                                    <DataTable.Data>
                                        {item.id}
                                        <ResourceAvailability availability={item.resource_availability} onSetAvailability={(availability) => this._setPluginAvailability(item.id, availability)} allowedSettingTo={['tenant', 'global']} className="rightFloated"/>
                                    </DataTable.Data>
                                    <DataTable.Data>{item.package_name}</DataTable.Data>
                                    <DataTable.Data>{item.package_version}</DataTable.Data>
                                    <DataTable.Data>{item.supported_platform}</DataTable.Data>
                                    <DataTable.Data>{item.distribution}</DataTable.Data>
                                    <DataTable.Data>{item.distribution_release}</DataTable.Data>
                                    <DataTable.Data>{item.uploaded_at}</DataTable.Data>
                                    <DataTable.Data>{item.created_by}</DataTable.Data>
                                    <DataTable.Data className="center aligned rowActions">
                                        <i className="download icon link bordered" title="Download" onClick={this._downloadPlugin.bind(this,item)}></i>
                                        <i className="trash icon link bordered" title="Delete" onClick={this._deletePluginConfirm.bind(this,item)}></i>
                                    </DataTable.Data>
                                </DataTable.Row>
                            );
                        })
                    }

                    <DataTable.Action>
                        <UploadModal widget={this.props.widget} data={this.props.data} toolbox={this.props.toolbox}/>
                    </DataTable.Action>

                </DataTable>

                <Confirm content='Are you sure you want to remove this plugin?'
                         open={this.state.confirmDelete}
                         onConfirm={this._deletePlugin.bind(this)}
                         onCancel={()=>this.setState({confirmDelete : false})} />
            </div>

        );
    }
};
