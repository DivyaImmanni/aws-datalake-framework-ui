/* eslint-disable no-useless-computed-key */
/* eslint-disable jsx-a11y/alt-text */

import { Tooltip } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from "@material-ui/core/Toolbar";
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import { setAuthentication } from 'actions/authenticationAction';
import awsLogo from 'images/AWS logo.png';
import backgroundImage from 'images/background.png';
import dataAssetIcon from 'images/dataAssetIcon.png';
import lakeDestinationIcon from 'images/lakeDestinationIcon.png';
import logo from 'images/logo white.png';
import sourceSystemIcon from 'images/sourceSystemIcon.png';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { bindActionCreators } from 'redux';

const useStyles = makeStyles((theme) => ({
    logo: {
        display: 'flex',
        fontSize: '23px',
        cursor: "pointer",
        marginRight: theme.spacing(5),
        textDecoration: "none",
        color: "white",
        alignItems: 'flex-start',
        padding: '20px',
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
    },
    container: {
        backgroundImage: 'url(' + backgroundImage + ')',
        //  "padding": "0px 20px",
        "color": "white",
        "margin": "auto",
        // "fontSize": "35px",
        "textAlign": "center",
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100%',
        ['@media (min-width:1920px)']: { // eslint-disable-line no-useless-computed-key
            height: '90vh'
        }
    },
    pageHeader: {
        //fontSize: '35px',
        margin: 0,
        //padding: '20px 20px 10px',
        padding: '4% 0 2%',
        fontSize: '30px',        
        //fontWeight: 100,
        '& img': {
            // "width": "auto",
            "verticalAlign": "-webkit-baseline-middle",
            "padding": "0 14px 0 5px",
            "width": "92px"
        },
        ['@media (min-width:1920px)']: {
            fontSize: '46px',
            '& img':{
                width: '125px',
                margin:'11px 4px 4px'
            }
        }
    },
    pageDesc: {
        "fontSize": "14px",
        'color': '#C9C9C9',
        "width": "75%",
        "margin": "auto",
        // "marginTop": "10px",
        maxWidth: '41%',
        ['@media (min-width:1920px)']: { // eslint-disable-line no-useless-computed-key
            fontSize: '20px'
        }
    },
    boxContainer: {
        display: 'flex',
        justifyContent: 'center',
        // marginTop: '30px',
        marginTop: '5%',
        '& > a:nth-child(2)': {
            "background": "linear-gradient(to bottom, #959595 50%, #000 50%)",
            'color': 'white'
        },
    },
    box: {
        "width": "15%",
        // "maxWidth": "245px",
        "background": "linear-gradient(to bottom, #fff 50%, #000 50%)",
        "color": "black",
        "fontSize": "20px",
        "padding": "25px 20px 15px",
        "borderRadius": "20px",
        "textAlign": "center",
        //"height": "100%",
        //"minHeight": "330px",
        "display": "flex",
        "flexDirection": "column",
        "margin": "0 20px",
        "position": 'relative',
        textDecoration: 'none',
        '&:hover': {
            boxShadow: '0px 10px 7px 0px #555'
        },
        '&:hover div::after': {
            display: 'block'
        },
        '&:hover img': {
            transform: 'scale(1.1)'
        },
        ['@media (min-width:1920px)']: {
            "width": "18%",
            "padding": "50px 25px 50px",
        }
    },
    boxTop: {
        '& h3': {
            margin: '5px 0px 15px',
            padding: '12px 0 20px',
            textDecoration: 'none',
            fontSize: '18px'
        },
        '& img': {
            transition: 'transform .2s',
            width: '50px'
        },
        ['@media (min-width:1920px)']: {
            '& img': {
                width: '70px'
            },
            '& h3': {
                padding: '20px 0 70px',
                fontSize: '30px'
            },
        }
    },
    boxBottom: {
        color: 'white',
        fontSize: '14px',
        minHeight: '110px',
        position: 'relative',
        '&::after': {
            display: 'none',
            position: 'absolute',
            bottom: '-5px',
            content: '""',
            left: 'calc(50% - 10px)',
            width: '20px',
            backgroundColor: 'white',
            height: '2px'
        },
        ['@media (min-width:1920px)']: {
            fontSize: '21px',
            minHeight: '150px'
        }
    },
    footer: {
        marginTop: '70px',
        color: 'black',
        padding: '10px 30px 20px 30px',
        fontSize: '12px',
        ['@media (min-width:1920px)']: {
            fontSize: '18px',
            minHeight: '50px'
        }

    },

}));

const Dashboard = (props) => {
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
            if (pathname.includes(nav.url)) {
                setActivePageIndex(i);
            }
        })
    });

    return (
        <div className={classes.container}>
            <div style={{ padding: '15px 5px' }}>
                <Toolbar style={{ display: 'flex'}}>
                    <Link to="/" className={classes.logo}>
                        <img src={logo}  style={{maxWidth: '120px'}}/> <span className={classes.pipe}></span>  
                        <span style={{ margin: '0 7px'}}>AWS </span> DATA LAKE
                    </Link>
                    <div className="font-link">
                        {listOfNavItems.map((item, index) => {
                            return <Link key={index} to={item.url} className={classes.link} style={index === activePageIndex ? { 'paddingBottom': 8, 'borderBottom': '4px solid #F7901D', color: 'white' } : {}} onClick={() => handleOnclick(index)}>{item.name} </Link>
                        })}
                    </div>
                    <span style={{padding:'20px 0px 20px 10px', color: '#F7901D', cursor:'pointer'}}> <Tooltip title="log out" placement='top'>
                        <PowerSettingsNewIcon onClick={() => props.setAuthentication({})} />
                    </Tooltip></span>
                </Toolbar>
            </div>
            <h1 className={classes.pageHeader}>
                Welcome to Tiger Analytics <img src={awsLogo} />DataLake!
            </h1>
            <p className={classes.pageDesc}>
                Framework powered by AWS services and self-service portal to ingest, cleanse and mask data. Build your datalake without a fuss and let the Tiger Analytics AWS Data Lake take care of the complexities in the background.
            </p>
            <div className={classes.boxContainer}>
                <Link className={classes.box} to={"/source-systems"}>
                    <div className={classes.boxTop}>
                        <img src={sourceSystemIcon} />
                        <h3>Source Systems</h3>
                    </div>
                    <div className={classes.boxBottom}>
                        Connect with multiple sources including databases and kinesis data streams
                    </div>
                </Link>
                <Link className={classes.box} to={"/data-assets"}>
                    <div className={classes.boxTop}>
                        <img src={dataAssetIcon} />
                        <h3 style={{fontWeight : 100}}>Data Assets</h3>
                    </div>
                    <div className={classes.boxBottom}>
                        Define the data asset properties, sensitive data properties and data quality rules
                    </div>
                </Link>
                <Link className={classes.box} to={"/lake-destinations"}>
                    <div className={classes.boxTop}>
                        <img src={lakeDestinationIcon} />
                        <h3>Lake Destinations</h3>
                    </div>
                    <div className={classes.boxBottom}>
                        Organize data in the lake to better control accesses & permissions
                    </div>
                </Link>
            </div>
            <div className={classes.footer}>
                Copyright © 2022, Tiger Analytics Inc. All rights reserved.
            </div>
        </div>
    )
}

const mapStateToProps = state => ({
    openSideBar: state.notificationState.openSideBar.open
})
const mapDispatchToProps = dispatch => bindActionCreators({
    setAuthentication,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);