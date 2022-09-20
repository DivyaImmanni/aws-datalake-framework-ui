import React from 'react';
import Layout from 'layout/Layout';
import Login from 'components/Login/Login';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {setAuthentication} from 'actions/authenticationAction';

const Application = (props) => {
	console.log("user to authenticate",props.user)
	return (
		<>
		{props.user.email_verified === true ? <Layout setAuthentication={props.setAuthentication}/> : <Login /> }
		</>
	)
}

const mapStateToProps = state => ({
  user: state.authenticationState.authentication
})
const mapDispatchToProps = dispatch => bindActionCreators({
	setAuthentication,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Application);