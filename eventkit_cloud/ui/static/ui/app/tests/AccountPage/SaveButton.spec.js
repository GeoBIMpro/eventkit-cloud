import PropTypes from 'prop-types';
import React from 'react';
import { mount } from 'enzyme';
import sinon from 'sinon';
import NavigationCheck from '@material-ui/icons/Check';
import RaisedButton from 'material-ui/RaisedButton';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import SaveButton from '../../components/AccountPage/SaveButton';

describe('SaveButton component', () => {
    const muiTheme = getMuiTheme();

    const getProps = () => ({
        saved: false,
        saveDisabled: true,
        handleSubmit: () => {},
    });

    const getMountedWrapper = props => mount(<SaveButton {...props} />, {
        context: { muiTheme },
        childContextTypes: { muiTheme: PropTypes.object },
    });

    it('should render a disabled save button', () => {
        const props = getProps();
        const wrapper = getMountedWrapper(props);
        expect(wrapper.find(RaisedButton)).toHaveLength(1);
        expect(wrapper.find(RaisedButton).props().disabled).toBe(true);
        expect(wrapper.find(RaisedButton).text()).toEqual('Save Changes');
    });

    it('should render a not disabled save button', () => {
        const props = getProps();
        props.saveDisabled = false;
        const wrapper = getMountedWrapper(props);
        expect(wrapper.find(RaisedButton)).toHaveLength(1);
        expect(wrapper.find(RaisedButton).props().disabled).toBe(false);
    });

    it('should render the "saved" button', () => {
        const props = getProps();
        props.saved = true;
        const wrapper = getMountedWrapper(props);
        expect(wrapper.find(RaisedButton)).toHaveLength(1);
        expect(wrapper.find(NavigationCheck)).toHaveLength(1);
        expect(wrapper.find(RaisedButton).text()).toEqual('Saved');
    });

    it('should switch to the "saved" button when props are updated', () => {
        const props = getProps();
        const wrapper = getMountedWrapper(props);
        expect(wrapper.find(RaisedButton).text()).toEqual('Save Changes');
        const nextProps = getProps();
        nextProps.saved = true;
        wrapper.setProps(nextProps);
        expect(wrapper.find(RaisedButton).text()).toEqual('Saved');
    });

    it('should call handleSubmit', () => {
        const props = getProps();
        props.saveDisabled = false;
        props.handleSubmit = sinon.spy();
        const wrapper = getMountedWrapper(props);
        expect(props.handleSubmit.notCalled).toBe(true);
        wrapper.find(RaisedButton).find('button').simulate('click');
        expect(props.handleSubmit.calledOnce).toBe(true);
    });

    it('should not call handleSubmit when disabled', () => {
        const props = getProps();
        props.handleSubmit = sinon.spy();
        const wrapper = getMountedWrapper(props);
        expect(props.handleSubmit.notCalled).toBe(true);
        wrapper.find(RaisedButton).find('button').simulate('click');
        expect(props.handleSubmit.notCalled).toBe(true);
    });
});
