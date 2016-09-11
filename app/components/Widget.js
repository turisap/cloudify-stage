/**
 * Created by kinneretzin on 30/08/2016.
 */

/**
 * Created by kinneretzin on 29/08/2016.
 */


import React, { Component, PropTypes } from 'react';


export default class Widget extends Component {
    static propTypes = {
        widget: PropTypes.object.isRequired
    };

    toggleEditMode() {
        this.setState({isInEditMode: !this.state.isInEditMode});
    }

    constructor(props, context) {
        super(props, context);

        this.state = {
            isInEditMode: false
        };
    };
    render() {
        return (
            <div id={this.props.widget.id}
                 className='grid-stack-item widget'
                 data-gs-auto-position='true' data-gs-width="3" data-gs-height="2">
                    {/*
                    <Flipcard type="vertical">
                        <div className='ui segment red widgetContent' >
                            <h5 className='ui header dividing'>{widget.name}</h5>
                        </div>
                        <div className='ui segment red widgetContent'>
                            <h5 className='ui header dividing'>{widget.name} edit mode</h5>
                        </div>
                    </Flipcard>
                    */}
                    {
                        this.state.isInEditMode ?
                        <div className='ui segment red grid-stack-item-content'>
                            <h5 className='ui header dividing'>{this.props.widget.name} edit mode</h5>

                            <div className='widgetSaveButtons ui segment center aligned basic'>

                                <div className="ui mini form">
                                    <div className="field">
                                        <input placeholder="Widget Name" type="text"/>
                                    </div>

                                    <div className="ui buttons mini">
                                        <button className="ui button" onClick={this.toggleEditMode.bind(this)}>Cancel</button>
                                        <div className="or"></div>
                                        <button className="ui primary button" onClick={this.toggleEditMode.bind(this)}>Save</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        :
                        <div className='ui segment red grid-stack-item-content'>
                            <h5 className='ui header dividing'>{this.props.widget.name}</h5>
                            <div className='widgetEditButtons'>
                                <i className="write link icon small" onClick={this.toggleEditMode.bind(this)}></i>
                                <i className="remove link icon small"></i>
                            </div>

                            Widget content
                        </div>
                    }
            </div>
        );
    }
}

