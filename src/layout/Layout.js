import { CssBaseline, Tooltip } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import { bindActionCreators } from 'redux';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from "@material-ui/core/Toolbar";
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import { setAuthentication } from 'actions/authenticationAction';
import SideBarComponent from "components/Notifications/SideBarComponent";
import SnackbarComponent from 'components/Notifications/SnackBarComponent';
import logo from 'images/logo white.png';
import React, { useEffect, useState } from "react";
import { connect } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import Main from 'routes/Main';

const useStyles = makeStyles((theme) => ({
    logo: {
        display:'flex',
        fontSize: '23px',
        cursor: "pointer",
        marginRight: theme.spacing(5),
        textDecoration: "none",
        color: "white",
        alignItems: 'flex-start',
        padding:'20px',
        flexGrow:1
    },
    link: {
        textDecoration: "none",
        color: "gray",
        fontSize: "13px",
        margin: theme.spacing(2),
        "&:hover": {
            color: "#fffc"
        },
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
    }
}));

const Layout = (props) => {
    const classes = useStyles();
    const [activePageIndex, setActivePageIndex] = useState(0);
    
    const location = useLocation();
    const { pathname } = location;
    const handleOnclick = (index) => {
        setActivePageIndex(index);
    }
    const listOfNavItems = [
        { name: 'Home', icon: <i class="fas fa-layer-group fa-lg"></i>, url: '/' },
        { name: 'Source Systems', icon: <i class="fas fa-layer-group fa-lg"></i>, url: '/source-systems' },
        { name: 'Data Assets', icon: <i class="fas fa-database fa-lg"></i>, url: '/data-assets' },
        { name: 'Lake Destinations', icon: <i class="fas fa-warehouse fa-lg"></i>, url: '/lake-destinations' }
    ]
    
    useEffect(() => {
        listOfNavItems.forEach((nav, i) => {
            if(pathname.includes(nav.url)){
                setActivePageIndex(i);
            }
        })
    });

    return (
        <div className={classes.root}>
            <CssBaseline />
            {activePageIndex !== 0 ? 
            <AppBar position="sticky" style={{padding: '15px 5px'}}>
                <CssBaseline />
                {/* <Toolbar style={{ backgroundImage: `url("${HeaderBackground}")` }}> */}
                <Toolbar style={{ backgroundColor: 'black',display:'flex', justifyContent:'space-between' }}>
                    {/* <div>
                            <img src={logo}  style={{maxWidth: '5%'}}/>
                        </div> */}
                    <Link to="/" className={classes.logo}>
                        <img src={logo}  style={{maxWidth: '120px'}}/> <span className={classes.pipe}></span>  
                        <span style={{ margin: '0 7px'}}>AWS </span> DATA LAKE
                    </Link>
                    <div >
                        {listOfNavItems.map((item,index) => {
                            return <Link key={index} to={item.url} className={classes.link} style={index === activePageIndex ? {'paddingBottom': 8, 'borderBottom':'4px solid #F7901D', color: 'white'}:{}} onClick={()=>handleOnclick(index)}>{item.name} </Link>
                        })}
                    </div>
                    <span style={{padding:'25px 0px 20px 10px', color: '#F7901D', cursor:'pointer'}}> <Tooltip title="log out" placement='top'>
                        <PowerSettingsNewIcon onClick={() => props.setAuthentication({})} />
                    </Tooltip></span>
                </Toolbar>
            </AppBar>: ''}
            <main className={classes.content} style={{marginBottom:20, display: "flex"}}>
                {/* <Toolbar /> */}
                <div style={props.openSideBar ? {width: 'calc(100% - 200px)'} : {width: '100%'}}>
                    <Main/>
                </div>
                <SideBarComponent />
                <SnackbarComponent />
            </main>
            {/* <AppBar position="static">
                <CssBaseline />
                <Toolbar>
                    <div style={{ margin: 'auto'}}>
                    Copyright © 2022, Tiger Analytics Inc. All rights reserved.
                    </div>
                </Toolbar>
            </AppBar> */}
        </div>
    );
}
const mapStateToProps = state => ({
    openSideBar: state.notificationState.openSideBar.open
})
const mapDispatchToProps = dispatch => bindActionCreators({
    setAuthentication,
}, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(Layout);
