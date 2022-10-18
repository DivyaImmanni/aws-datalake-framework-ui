import React from "react";
import { Link } from 'react-router-dom';
import PropTypes from "prop-types";
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
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import StorageIcon from '@material-ui/icons/Storage';
import HomeIcon from '@material-ui/icons/Home';
import LayersIcon from '@material-ui/icons/Layers';
import DomainIcon from '@material-ui/icons/Domain';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import SnackbarComponent from 'components/Notifications/SnackBarComponent';
import Main from 'routes/Main';
import { Tooltip } from "@material-ui/core";
import logo from 'images/logo white.png';


const drawerWidth = 220;

const styles = theme => ({
    root: {
        display: 'flex',
        '&$selected': {
            backgroundColor: 'white',
            "& .MuiListItemIcon-root": {
                color: "black",
            },
            '&:hover': {
                backgroundColor: '#f59e0b',
                color: 'white',
                "& .MuiListItemIcon-root": {
                    color: "white"
                }
            }
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
});

class Layout extends React.Component {
    state = {
        open: true,
        anchorEl: null
    };

    handleDrawerOpen = () => {
        this.setState({ open: !this.state.open });
    };

    handleDrawerClose = () => {
        this.setState({ open: false });
    };

    handleMenu = event => {
        this.setState({ anchorEl: event.currentTarget });
    };
    handleClose = () => {
        this.setState({ anchorEl: null });
    };

    render() {
        const { classes, theme } = this.props;
        const { anchorEl } = this.state;
        const open = Boolean(anchorEl);
        const listOfOptions = [
            { name: 'Home', icon: <HomeIcon></HomeIcon>, url: '/' },
            { name: 'Source Systems', icon: <LayersIcon></LayersIcon>, url: '/source-systems' },
            { name: 'Data Assets', icon: <StorageIcon></StorageIcon>, url: '/data-assets' },
            { name: 'Lake Destinations', icon: <DomainIcon></DomainIcon>, url: '/lake-destinations' }
    ];

        return (
            <div className={classes.root}>
                <CssBaseline />
                <AppBar
                    position="fixed"
                    className={classes.appBar}
                    foojon={classNames(classes.appBar, {
                        [classes.appBarShift]: this.state.open
                    })}
                >
                    <Toolbar style={{ position: 'relative' }} disableGutters={true}>
                        <IconButton
                            color="inherit"
                            aria-label="Open drawer"
                            onClick={this.handleDrawerOpen}
                        >
                            <MenuIcon
                                classes={{
                                    root: this.state.open
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
                        <div style={{ position: 'absolute', marginTop: '5px', right: '75px',cursor: 'pointer' }}>
                            <Tooltip title="log out">
                                <PowerSettingsNewIcon onClick={() => this.props.setAuthentication(false)} />
                            </Tooltip>
                        </div>
                    </Toolbar>
                </AppBar>
                <Drawer
                    variant="permanent"
                    className={classNames(classes.drawer, {
                        [classes.drawerOpen]: this.state.open,
                        [classes.drawerClose]: !this.state.open
                    })}
                    classes={{
                        paper: classNames({
                            [classes.drawerOpen]: this.state.open,
                            [classes.drawerClose]: !this.state.open
                        })
                    }}
                    open={this.state.open}
                >
                    <div className={classes.toolbar} />
                    <List className={classes.list}>
                        {listOfOptions.map((list, index) => (
                            <Link to={list.url} className={classes.link}>
                                <Tooltip title={this.state.open ? '' : list.name}>
                                    <ListItem button classes={{ root: classes.root, selected: classes.selected }}
                                        selected key={index}>
                                        <ListItemIcon className={classes.root}>{list.icon}</ListItemIcon>
                                        <ListItemText primary={list.name} />
                                    </ListItem>
                                </Tooltip>
                            </Link>
                        ))}
                    </List>
                </Drawer>
                <main className={classes.content}>
                    <Toolbar />
                    <Main />
                    <SnackbarComponent />
                </main>
            </div>
        );
    }
}

Layout.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(Layout);