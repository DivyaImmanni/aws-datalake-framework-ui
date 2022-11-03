import React, { useEffect, useState } from "react";
import { Link, useLocation } from 'react-router-dom';
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import CssBaseline from "@material-ui/core/CssBaseline";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ListItem from "@material-ui/core/ListItem";
import LineStyleIcon from '@material-ui/icons/LineStyle';
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import StorageIcon from '@material-ui/icons/Storage';
import CollectionsIcon from '@material-ui/icons/Collections';
import HomeIcon from '@material-ui/icons/Home';
import GavelIcon from '@material-ui/icons/Gavel';
import DataUsageIcon from '@material-ui/icons/DataUsage';
import ReportIcon from '@material-ui/icons/Report';
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer';
import LayersIcon from '@material-ui/icons/Layers';
import DomainIcon from '@material-ui/icons/Domain';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import SnackbarComponent from 'components/Notifications/SnackBarComponent';
import Main from 'routes/Main';
import { makeStyles, Tooltip } from "@material-ui/core";
import logo from 'images/logo white.png';
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { setAuthentication } from './../actions/authenticationAction';
import SideBarComponent from './../components/Notifications/SideBarComponent';


const drawerWidth = 220;

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        '&$selected': {
            backgroundColor: 'none',
            color: 'rgb(247, 144, 29)',
            "& .MuiListItemIcon-root": {
                color: "rgb(247, 144, 29)",
            },
            '&:hover': {
                backgroundColor: 'none',
                color: 'rgb(247, 144, 29)',
                "& .MuiListItemIcon-root": {
                    color: "rgb(247, 144, 29)"
                }
            }
        },
    },
    navLink: {
        textDecoration: "none",
        color: "gray",
        fontSize: "13px",
        margin: theme.spacing(2),
        "&:hover": {
            color: "#fffc"
        },
    },
    selected: {},
    appBar: {
        zIndex: theme.zIndex.drawer + 1
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
    logo: {
        display: 'flex',
        fontSize: '23px',
        cursor: "pointer",
        marginRight: theme.spacing(5),
        textDecoration: "none",
        color: "white",
        alignItems: 'flex-start',
        padding: '20px',
        flexGrow: 1
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen
        })
    },
    menuButton: {
        marginLeft: 12,
        marginRight: 36
    },
    menuButtonIconClosed: {
        transition: theme.transitions.create(["transform"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        }),
        transform: "rotate(0deg)"
    },
    menuButtonIconOpen: {
        transition: theme.transitions.create(["transform"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        }),
        transform: "rotate(180deg)"
    },
    hide: {
        display: "none"
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: "nowrap"
    },
    drawerOpen: {
        width: drawerWidth,
        transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen
        })
    },
    drawerClose: {
        transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        }),
        overflowX: "hidden",
        width: theme.spacing.unit * 7 + 1,
        [theme.breakpoints.up("sm")]: {
            width: theme.spacing.unit * 9 + 1
        }
    },
    toolbar: {
        display: "flex",
        alignItems: "center",
        marginTop: theme.spacing.unit,
        justifyContent: "flex-end",
        padding: "0 8px",
        ...theme.mixins.toolbar
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing.unit * 3
    },
    grow: {
        flexGrow: 1
    },
    imgResponsive: {
        maxWidth: '80%',
    },
    text: {
        flexGrow: 1,
        textAlign: "center",
    },
    link: {
        textDecoration: "none",
        color: "inherit"
    }
}));

const Layout = (props) => {
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const [hideLayout, setHideLayout] = useState(false);    
    const [activeSideBarIndex, setActiveSideBarIndex] = useState(1);
    const [appBarId, setAppBarId] = useState(1);

    const location = useLocation();

    const handleDrawerOpen = () => {
        setOpen(!open);
    };

    const listOfSideBar = [
        {id: 1, appId: 2, name: 'Source Systems', icon: <LayersIcon></LayersIcon>, url: '/source-systems' },
        {id: 2, appId: 2, name: 'Data Assets', icon: <StorageIcon></StorageIcon>, url: '/data-assets' },
        {id: 3, appId: 2, name: 'Lake Destinations', icon: <DomainIcon></DomainIcon>, url: '/lake-destinations' },
        {id: 4, appId: 2, name: 'Collections', icon: <CollectionsIcon></CollectionsIcon>, url: '/collections' },
        {id: 5, appId: 2, name: 'ASIM Rules', icon: <GavelIcon></GavelIcon>, url: '/asim-rules' },
        {id: 6, appId: 2, name: 'DB Connectors', icon: <DataUsageIcon></DataUsageIcon>, url: '/db-connectors' },
        {id: 7, appId: 3, name: 'Pipelines', icon: <LineStyleIcon></LineStyleIcon>, url: '/pipelines/pipelines' },
        {id: 8, appId: 3, name: 'Pipelines Execution', icon: <DataUsageIcon></DataUsageIcon>, url: '/pipelines/execution' },
        {id: 9, appId: 4, name: 'DQ Results', icon: <QuestionAnswerIcon></QuestionAnswerIcon>, url: '/audit/dq-results' },
        {id: 10, appId: 4, name: 'Reports and Dashboard', icon: <ReportIcon></ReportIcon>, url: '/audit/reports' },
        
    ];

    const listOfAppBar = [
        { id: 1, name: 'Home', icon: <HomeIcon></HomeIcon>, url: '/' },
        { id: 2, name: 'Data Ingestion', icon: <LayersIcon></LayersIcon>, url: '/source-systems' },
        { id: 3, name: 'Pipelines', icon: <StorageIcon></StorageIcon>, url: '/pipelines/pipelines' },
        { id: 4, name: 'Audit', icon: <StorageIcon></StorageIcon>, url: '/audit/dq-results' },
        { id: 5, name: 'Deployment', icon: <DomainIcon></DomainIcon>, url: '/deployment' }
    ];

    useEffect(() => {
        listOfSideBar.forEach((nav, i) => {
            console.log("sidebar", location?.pathname, nav.url)
            if (location?.pathname == (nav.url)) {
                setActiveSideBarIndex(nav.id);
                setAppBarId(nav.appId)
                console.info("True", location?.pathname)
            }
        })
        // listOfAppBar.forEach((nav, i) => {
        //      console.log("appbar", location?.pathname, nav.url)
        //     if (location?.pathname.includes(nav.url)) {
        //         setAppBarId(nav.id)
        //     }
        // })
        setHideLayout(location?.pathname == '/')
    }, [location?.pathname]);


    return (
        <div className={classes.root}>
                <CssBaseline />

            {!hideLayout && <>
                <AppBar
                    position="fixed"
                    className={classes.appBar}
                    foojon={classNames(classes.appBar, {
                        [classes.appBarShift]: open
                    })}
                >
                    <Toolbar style={{ position: 'relative' }} disableGutters={true}>
                        <IconButton
                            color="inherit"
                            aria-label="Open drawer"
                            onClick={handleDrawerOpen}
                        >
                            <MenuIcon
                                classes={{
                                    root: open
                                        ? classes.menuButtonIconOpen
                                        : classes.menuButtonIconClosed
                                }}
                            />
                        </IconButton>
                        <Link to="/" className={classes.logo}>
                            <img src={logo} style={{ maxWidth: '120px' }} />
                            <span className={classes.pipe}></span>
                            <span style={{ margin: '0 7px' }}>AWS </span> DATA LAKE
                        </Link>
                        <div style={{display: 'flex', justifyContent: 'space-between', minWidth: '40%', paddingRight: '33px',paddingTop:'26px'}}>
                            <div>
                                {listOfAppBar.map((item, index) => {
                                    return <Link key={index} onClick={() => {console.log('clickec', item.id); setAppBarId(item.id)}} to={item.url} className={classes.navLink} style={item.id === appBarId ? { 'paddingBottom': 8, 'borderBottom': '4px solid #F7901D', color: 'white' } : {}} >{item.name} </Link>
                                })}
                            </div>
                            <span  style={{ padding:'0px 0px 20px 10px',color: '#F7901D', cursor:'pointer'}}>
                            <Tooltip title="log out" placement='top'>
                                <PowerSettingsNewIcon onClick={() => props.setAuthentication(false)} />
                            </Tooltip></span>
                        </div>
                    </Toolbar>
                </AppBar>
                <Drawer
                    variant="permanent"
                    className={classNames(classes.drawer, {
                        [classes.drawerOpen]: open,
                        [classes.drawerClose]: !open
                    })}
                    classes={{
                        paper: classNames({
                            [classes.drawerOpen]: open,
                            [classes.drawerClose]: !open
                        })
                    }}
                    open={open}
                >
                    <div className={classes.toolbar} />
                    <List className={classes.list}>
                        {listOfSideBar.filter(item => item.appId == appBarId).map((list, index) => (
                            <Link to={list.url} className={classes.link} onClick={() => setOpen(false)}>
                                <Tooltip title={open ? '' : list.name}>
                                    <ListItem button classes={{ root: classes.root, selected: classes.selected }}
                                        selected={list.id == activeSideBarIndex} key={index}>
                                        <ListItemIcon className={classes.root}>{list.icon}</ListItemIcon>
                                        <ListItemText primary={list.name} />
                                    </ListItem>
                                </Tooltip>
                            </Link>
                        ))}
                    </List>
                </Drawer>
            </>}

            <main className={hideLayout ? '' : classes.content}>
                {/* {!hideLayout && <Toolbar />} */}
                <div style={location?.pathname == "/" ? {display: 'flex'} : {display: 'flex', marginTop: '50px'}}>
                    <Main style={{width: props.openSideBar ? 'calc(100% - 170px)' : '100%'}}/>
                    <SideBarComponent />
                </div>                
            </main>
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
