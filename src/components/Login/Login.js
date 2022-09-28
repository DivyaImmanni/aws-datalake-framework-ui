import { AppBar, Toolbar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import backgroundImage from 'images/background.png';
import loginImage from 'images/loginImage.png';
import logo from 'images/logo white.png';
import { default as React} from 'react';
import { Link } from 'react-router-dom';
import LoginForm from './LoginForm';

const useStyles = makeStyles((theme) => ({
    loginContainer: {
        width: 700,
        height: '100vh'
    },
    logo: {
        display: 'flex',
        fontSize: '23px',
        cursor: "pointer",
        marginRight: theme.spacing(5),
        textDecoration: "none",
        color: "white",
        alignItems: 'flex-start',
        padding: '20px'
    },
    pipe: {
        position: "relative",
        margin: "0 20px",
        "&::after": {
            "content": "''",
            "position": "absolute",
            "height": "40px",
            "display": "block",
            "width": "1px",
            "top": "0px",
            "background": "#f7901d",
            "left": "0px"
        }
    },
    container: {
        backgroundImage: 'url(' + backgroundImage + ')',
        "color": "white",
        "margin": "auto",
        "textAlign": "center",
        "fontFamily": 'POPPINS',
        //backgroundRepeat: 'repeat',
        // backgroundSize: '100%',
        ['@media (min-width:1920px)']: { // eslint-disable-line no-useless-computed-key
            height: '90vh'
        }
    },
}));

const Login = (props) => {
    const classes = useStyles();
    return (
        <div className={classes.container}>
            <AppBar position="fixed">
                <Toolbar style={{ padding: '15px 5px'}}>
                    <Link to="/" className={classes.logo}>
                        <img src={logo} style={{ maxWidth: '120px' }} /> <span className={classes.pipe}></span>
                        <span style={{ margin: '0 7px' }}>AWS </span> DATA LAKE
                    </Link>
                </Toolbar>
            </AppBar>
            <div className={classes.loginContainer}>
                <LoginForm />
            </div>
        </div>
    )
}

export default Login;
