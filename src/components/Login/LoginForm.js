import { setAuthentication } from 'actions/authenticationAction';
import jwt_decode from "jwt-decode";
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

const LoginForm = (props) => {
    const [user, setUser] = useState({});

    function handleCallbackResponse(response) {
        var userObject = jwt_decode(response.credential);
        setUser(userObject)
        props.setAuthentication(userObject)
        document.getElementById("SignInDiv").hidden = true;
    }

    useEffect(() => {
        /* global google */
        google.accounts.id.initialize({
            client_id: process.env.REACT_APP_SSO_ID,
            callback: handleCallbackResponse
        });
        google.accounts.id.renderButton(
            document.getElementById("SignInDiv"),
            { theme: "outline", size: "large" }
        );
        google.accounts.id.prompt();
    }, []);

    return (<div style={{position: 'fixed',top: '48%',left: '40%'}}>
        <div id="SignInDiv" >
        </div>
    </div>
    )
}

const mapStateToProps = state => ({

})
const mapDispatchToProps = dispatch => bindActionCreators({
    setAuthentication,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);