/**
 * Created by pposel on 31/01/2017.
 */

import Actions from './actions';

export default class CreateModal extends React.Component {

    constructor(props,context) {
        super(props,context);

        this.state = {...CreateModal.initialState, open: false}
    }

    static initialState = {
        open: false,
        loading: false,
        username: '',
        password: '',
        confirmPassword: '',
        isAdmin: false,
        errors: {}
    }

    onApprove () {
        this._submitCreate();
        return false;
    }

    onCancel () {
        this.setState({open: false});
        return true;
    }

    componentWillUpdate(prevProps, prevState) {
        if (!prevState.open && this.state.open) {
            this.setState(CreateModal.initialState);
        }
    }

    _submitCreate() {
        let errors = {};

        if (_.isEmpty(this.state.username)) {
            errors['username']='Please provide username';
        }

        if (_.isEmpty(this.state.password)) {
            errors['password']='Please provide user password';
        }

        if (_.isEmpty(this.state.confirmPassword)) {
            errors['confirmPassword']='Please provide password confirmation';
        }

        if (!_.isEmpty(this.state.password) && !_.isEmpty(this.state.confirmPassword) &&
            this.state.password !== this.state.confirmPassword) {
            errors['confirmPassword']='Passwords do not match';
        }

        if (!_.isEmpty(errors)) {
            this.setState({errors});
            return false;
        }

        // Disable the form
        this.setState({loading: true});

        var actions = new Actions(this.props.toolbox);
        actions.doCreate(this.state.username,
                         this.state.password,
                         Stage.Common.RolesUtil.getSystemRole(this.state.isAdmin)
        ).then(()=>{
            this.setState({errors: {}, loading: false, open: false});
            this.props.toolbox.refresh();
        }).catch((err)=>{
            this.setState({errors: {error: err.message}, loading: false});
        });
    }

    _handleInputChange(proxy, field) {
        this.setState(Stage.Basic.Form.fieldNameValue(field));
    }

    render() {
        var {Modal, Button, Icon, Form, ApproveButton, CancelButton} = Stage.Basic;

        const addButton = <Button content='Add' icon='add user' labelPosition='left' className='addUserButton' />;

        return (
            <Modal trigger={addButton} open={this.state.open} onOpen={()=>this.setState({open:true})}
                   onClose={()=>this.setState({open:false})} className="addUserModal">
                <Modal.Header>
                    <Icon name="add user"/> Add user
                </Modal.Header>

                <Modal.Content>
                    <Form loading={this.state.loading} errors={this.state.errors}
                          onErrorsDismiss={() => this.setState({errors: {}})}>
                        <Form.Field error={this.state.errors.username}>
                            <Form.Input name='username' placeholder="Username"
                                        value={this.state.username} onChange={this._handleInputChange.bind(this)}/>
                        </Form.Field>

                        <Form.Field error={this.state.errors.password}>
                            <Form.Input name='password' placeholder="Password" type="password"
                                        value={this.state.password} onChange={this._handleInputChange.bind(this)}/>
                        </Form.Field>

                        <Form.Field error={this.state.errors.confirmPassword}>
                            <Form.Input name='confirmPassword' placeholder="Confirm password" type="password"
                                        value={this.state.confirmPassword} onChange={this._handleInputChange.bind(this)}/>
                        </Form.Field>

                        <Form.Field error={this.state.errors.isAdmin}>
                            <Form.Checkbox label="Admin" name="isAdmin" checked={this.state.isAdmin}
                                           onChange={this._handleInputChange.bind(this)} />
                        </Form.Field>

                    </Form>
                </Modal.Content>

                <Modal.Actions>
                    <CancelButton onClick={this.onCancel.bind(this)} disabled={this.state.loading} />
                    <ApproveButton onClick={this.onApprove.bind(this)} disabled={this.state.loading} content="Add" icon="add user" color="green"/>

                </Modal.Actions>
            </Modal>
        );
    }
};
