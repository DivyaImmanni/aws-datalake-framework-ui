import { makeStyles } from '@material-ui/core';
import React from 'react';

const PageTitle = (props) => {
    const firstChar = props.children.charAt(0);
    const remainingChar = props.children.slice(1);

    const useStyles = makeStyles((theme) => ({
        heading:
        {
            fontSize: '25px',
            lineHeight: '30px',
            margin: 0,
            color:'#646262eb'
        },
        headerContainer: {
            display: 'flex',
            flexFlow: 'row',
            marginBottom: '8px',
            alignItems: 'flex-end',
            '& .info':
            {
                "color": "#00B1E8",
                "fontSize": "12px",
                "fontWeight": "bold",
                "cursor": "pointer",
                "lineHeight": "24px",
                "marginLeft": "6px"
            }
        }
    }));
    const classes = useStyles();

    return (
        <div className={classes.headerContainer} style={props.style}>
            <h2 className={classes.heading}>
                <span style={{ fontSize: '25px'}}>{firstChar}</span>
                {remainingChar}
            </h2>
            <span className="info" onClick={props.showInfo}>Info</span>
        </div>
    );
}

export default PageTitle; 