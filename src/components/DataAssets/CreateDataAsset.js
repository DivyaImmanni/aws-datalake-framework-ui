import { Backdrop, Button, CircularProgress, TextField, Tooltip } from '@material-ui/core';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import CssBaseline from "@material-ui/core/CssBaseline";
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ReplayIcon from '@material-ui/icons/Replay';
import {
    columnAttributeError, assetFieldValue, dataAssetFieldValue, dqRulesFieldValue, ingestionFieldValue, resetDataAssetValues, updateAllDataAssetValues, updateDataFlag, updateMode
} from 'actions/dataAssetActions';
import { openSideBar, openSnackbar } from 'actions/notificationAction';
import PageTitle from 'components/Common/PageTitle';
import { BOOLEAN_VALUES, FILE_TYPE } from 'components/Constants/DataAssetsConstants';
import ColumnAttributes from 'components/DataAssets/ColumnAttributes';
import cron from 'cron-validate';
import React, { useEffect, useState } from 'react';
import Editor from "react-prism-editor";
import { connect } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import defaultInstance from 'routes/defaultInstance';

const useStyles = makeStyles((theme) => ({
    root: {
        margin: theme.spacing(7),
        marginTop: theme.spacing(2)
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: "bold",
    },
    link: {
        cursor: 'pointer',
        display: 'flex',
        color: 'black',
        textDecoration: "none",
        fontSize: "12px",
        marginLeft: 0,
        '&:hover': {
            fontWeight: 'bold',
        },
    },
    formControl: {
        // margin: theme.spacing(1),
        minWidth: 250,
        margin: '0px 3% 2% 0px',
        fontSize: 13,
        wordBreak: 'break-word',
        maxWidth: 250
    },
    backdrop: {
        backdropFilter: 'blur(1px)',
        zIndex: theme.zIndex.drawer + 1,
        color: 'black',
    },
    button: {
        float: 'right',
        margin: '1vh',
        backgroundColor: 'black',
        color: '#F7901D',
        minWidth: '7%',
        marginTop: '12px',
        '&:hover': {
            fontWeight: '600',
            backgroundColor: 'black',
        },
        '&:disabled': {
            background: '#A3A3A390',
        },
    },
}));

const ThemeSwitch = withStyles({
    switchBase: {
        color: 'black',
        '&$checked': {
            color: '#F7901D',
        },
        '&$checked + $track': {
            backgroundColor: '#F7901D',
        },
    },
    checked: {},
    track: {},
})(Switch);

const CreateDataAsset = (props) => {
    const classes = useStyles();
    const navigate = useNavigate();
    const [expanded, setExpanded] = useState(1);
    const [sourceSysData, setSourceSysData] = useState([]);
    const [targetSysData, setTargetSysData] = useState([]);
    const [displayField, setDisplayField] = useState(false);
    const [srcIngestionValue, setSrcIngestionValue] = useState('');
    const [disableButton, setDisableButton] = useState(false);
    const [backdrop, setBackdrop] = useState(false);
    const [cronValue, setCronValue] = useState('');
    const [errorValue, setErrorValue] = useState('');
    const [error, setError] = useState({})

    useEffect(() => {
        if (props.mode !== 'create') {
            fetchDataAssetDetails();
        }
        getSourceSystemData();
        getTargetSystemData();
    }, [])

    useEffect(() => {
        if (sourceSysData.length > 0) {
            let obj = sourceSysData.find(element => element.src_sys_id === props.assetFieldValues.src_sys_id)
            if (obj && obj['ingstn_pattern'] === 'file') {
                setDisplayField(true);
                setSrcIngestionValue('file');
                const updateObj = props.mode === 'create' ? { ...props.fieldValues, "asset_info": { ...props.assetFieldValues, "file_type": "", "file_header": "", "multipartition": false, "file_delim": "" }} : {...props.fieldValues};
                props.updateAllDataAssetValues(updateObj)
            } else {
                setDisplayField(false);
                setSrcIngestionValue(obj ? obj['ingstn_pattern'] : "")
                const updateObj = props.mode === 'create' ? { ...props.fieldValues, "asset_info": { ...props.assetFieldValues, "file_type": "parquet", "file_header": "", "multipartition": "", "file_delim": "" } } : {...props.fieldValues};
                props.updateAllDataAssetValues(updateObj)
            }
        }
    }, [props.assetFieldValues.src_sys_id])

    useEffect(() => {
        if (srcIngestionValue === 'file') {
            if (props.assetFieldValues.file_type === 'csv') {
                props.updateAllDataAssetValues({ ...props.fieldValues, "asset_info": { ...props.assetFieldValues, "file_header": true, "file_delim": "," } })
            } else {
                props.updateAllDataAssetValues({ ...props.fieldValues, "asset_info": { ...props.assetFieldValues, "file_header": "", "file_delim": "" } })
            }
        }
    }, [props.assetFieldValues.file_type])

    const getSourceSystemData = () => {
        defaultInstance.post('/source_system/read?tasktype=read', { "fetch_limit": 'all', "src_config": { "src_sys_id": null } })
            .then(response => {
                if (response.data.responseStatus) {
                    setSourceSysData(response.data.responseBody);
                } else {
                    setSourceSysData([]);
                }
            })
            .catch(error => {
                setSourceSysData([]);
                console.log("error", error)
            })
    }

    const getTargetSystemData = () => {
        defaultInstance.post('/target_system/read', { "fetch_limit": 'all', "target_config": { "target_id": null } })
            .then(response => {
                if (response.data.responseStatus) {
                    setTargetSysData(response.data.responseBody);
                } else {
                    setTargetSysData([]);
                }
            })
            .catch(error => {
                setTargetSysData([]);
                console.log("error", error)
            })
    }

    const fetchDataAssetDetails = () => {
        let assetID = props.selectedRow.asset_id ? props.selectedRow.asset_id : null
        let srcSysID = props.selectedRow.src_sys_id ? props.selectedRow.src_sys_id : null
        setBackdrop(true);
        defaultInstance.post('/data_asset/read', { "asset_id": assetID, "src_sys_id": srcSysID })
            .then(response => {
                if (response.data.responseStatus) {
                    props.updateAllDataAssetValues({ ...response.data.responseBody });
                } else {
                    props.resetDataAssetValues();
                    navigate("/data-assets");
                }
            })
            .catch(error => {
                handleCancel();
                props.openSnackbar({ variant: 'error', message: `Failed to load the data asset details!` });
                navigate('/data-assets');
                console.log("error", error)
            }).finally(() => {
                setBackdrop(false);
            })
    }

    const handleChange = id => (_, isExpanded) => {
        setExpanded(isExpanded ? id : false)
    };

    const handleMaxCharacter = (type, field, errorField, value, number) => {
        if (value.length <= number) {
            type(field, value);
        }
        setError({
            ...error,
            [errorField]: value.trim().length > 0 && value.trim().length <= number ? false : true
        })
    }

    const handleLoadChange = (event) => {
        let { id, value, checked } = event.target;
        if (event.target.type === 'checkbox') {
            value = checked;
        }
        props.assetFieldValue(id, value)
    }

    const handleValueChange = (type, field, errorField, value) => {
        console.log(type)
        if (field === 'frequency') {
            setCronValue(value)
            if (cron(value).isValid()) {
                setError({ ...error, [errorField]: false });
                setErrorValue('');
                type(field, value);
            } else {
                type(field, value)
                setError({
                    ...error,
                    [errorField]: true
                })
                setErrorValue(cron(value).getError());
            }
        } else {
            type(field, value);
            setError({
                ...error,
                [errorField]: value.toString().trim().length > 0 ? false : true
            })
            if (field === 'trigger_mechanism' && value === "event_driven") {
                type('frequency', "")
                setCronValue("")
                setErrorValue('');
                setError({ ...error, crontabError: false })
            }
        }
    }

    const handleReset = () => {
        props.resetDataAssetValues();
        setDisableButton(false);
        setError({})
    }

    const handleCancel = () => {
        props.updateMode('');
        props.resetDataAssetValues();
        navigate("/data-assets");
    }


    const isColumnAttributeValid = () => {
        var fieldsToValidate = ["col_nm", "col_desc", "data_classification", "data_type",
            "tgt_col_nm", "datetime_format","customdatetime_format",
            "customtargetdatetime_format", "col_length", "req_tokenization", "pk_ind", "null_ind"];
        var newErrorObj = props.columnAttributeError;
        props.columnAttributesData?.forEach(row => {
            fieldsToValidate.forEach(field => {
                // if data type is not Date time, no need to check datetime format field
                if ((field == "datetime_format" && row['data_type'] != "Datetime")) {
                    return;
                }
                
                // if data time format is not custom, no need to check custom datetime format field
                if ((field == "customdatetime_format" && row['datetime_format'] != "custom")
                    || (field == "customtargetdatetime_format" && row['tgt_datetime_format'] != "custom")) {
                    return;
                }
                
                var errorMessage = "";
                errorMessage = row[`${field}`]?.toString().trim().length > 0
                    ? ((props.columnAttributeError[`${row.col_id}`] && props.columnAttributeError[`${row.col_id}`][`${field}`]) || "")
                    : "Required Field";

                newErrorObj = { ...newErrorObj, [row.col_id]: { ...newErrorObj[`${row.col_id}`], [field]: errorMessage } }
            })
        })
        props.setColumnAttributeError({ ...newErrorObj })

        var isError = false;
        for (var id in newErrorObj) {
            for (var col in newErrorObj[`${id}`]) {
                if (newErrorObj[`${id}`][`${col}`]) {
                    isError = true;
                    break;
                }
            }
            if (isError) {
                break;
            }
        }
        return !isError;
    }

    const validate = () => {
        let errorObj = {}
        errorObj = {
            ...error,
            sourceSysIDError: props.assetFieldValues.src_sys_id ? false : true,
            targetIDError: props.assetFieldValues.target_id ? false : true,
            fileTypeError: displayField ? (props.assetFieldValues.file_type.length > 0 ? false : true) : false,
            assetNameError: error.assetNameError ? true : props.assetFieldValues.asset_nm.trim() ? false : true,
            // triggerFilePtrnError: (props.assetFieldValues.trigger_file_pattern && props.assetFieldValues.trigger_file_pattern.trim() && error.triggerFilePtrnError) ? true : false,
            fileDelimiterError: props.assetFieldValues.file_type === 'csv' ? (props.assetFieldValues.file_delim.trim() ? false : true) : false,
            assetOwnerError: props.assetFieldValues.asset_owner.trim() ? false : true,
            supportContactError: props.assetFieldValues.support_cntct.trim() ? false : true,
            sourceTableNameError: srcIngestionValue === 'database' ? (props.ingestionFieldValues.src_table_name.trim() ? false : true) : false,
            //sourceSqlQueryError: srcIngestionValue === 'database' ? (props.ingestionFieldValues.src_sql_query.trim() ? false : true) : false,
            // ingestionSourcePathError: props.mode !== 'create' ? (props.ingestionFieldValues.ingstn_src_path && props.ingestionFieldValues.ingstn_src_path.trim() ? false : true) : false,
            triggerMechanismError: props.ingestionFieldValues.trigger_mechanism.trim() ? false : true,
            crontabError: props.ingestionFieldValues.trigger_mechanism === 'time_driven' ? (props.ingestionFieldValues.frequency.trim() ? error.crontabError : true) : false,
            extColumnError: false,
        }
        setError(errorObj);
        console.log("error obj", errorObj)
        return Object.values(errorObj).filter(item => item === true).length;
    }

    const handleSave = async () => {
        //console.log("field values", { ...props.fieldValues })
        let errorLength = validate();
        let errorInColumnAttribute = !props.assetFieldValues.derive_schema && !isColumnAttributeValid()
        if (errorLength || errorInColumnAttribute) {
            props.openSnackbar({ variant: 'error', message: 'Enter all mandatory fields with valid data!' });
        } else {
            setDisableButton(true);
            let payload = props.mode === 'edit' ? { ...props.fieldValues, asset_id: props.assetFieldValues.asset_id, src_sys_id: props.assetFieldValues.src_sys_id } : { ...props.fieldValues }
            if(props.assetFieldValues.derive_schema){
                payload.asset_attributes = [];
                props.assetFieldValues.derive_schema = true;
            } else{
                props.assetFieldValues.derive_schema = false;
                payload.asset_attributes = payload.asset_attributes?.map(row => {
                    if(row.datetime_format == 'custom'){                        
                        row = { ...row, datetime_format: row.customdatetime_format }
                    }
                    if(row.tgt_datetime_format == 'custom'){                        
                        row = { ...row, tgt_datetime_format: row.customtargetdatetime_format }
                    }
                    delete row.customdatetime_format;                                                
                    delete row.customtargetdatetime_format;                        
                    return row;
                })
            }
            // let payload = { ...props.fieldValues }
            let url = props.mode === 'edit' ? '/data_asset/update' : 'data_asset/create'
            try {
                const response = await defaultInstance.post(url, payload)
                if (response.data.responseStatus) {
                    props.openSnackbar({ variant: 'success', message: `${response.data.responseMessage}` });
                    // props.updateDataFlag(true);
                } else {
                    props.openSnackbar({ variant: 'error', message: `${response.data.responseMessage}` });
                }
                props.updateMode('');
                props.resetDataAssetValues();
                navigate("/data-assets");
            }
            catch (error) {
                props.openSnackbar({ variant: 'error', message: `Failed to create Data Asset ID!` });
                setDisableButton(false);
                console.log(error);
            }
        }
    }

    return (
        <div className={classes.root}>
            <CssBaseline />
            <PageTitle showInfo={() => props.openSideBar({ heading: 'Data Asset', content: 'Data Assets are the entries within the framework which holds the properties of individual files coming from the various sources. In other words, they are the metadata of source files. The metadata includes column names, datatypes, security classifications, DQ rules, data obfuscation properties etc.' })}>
                {props.mode === 'edit' ? 'Edit Data Asset ' : 'New Data Asset'}
            </PageTitle>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1%' }}>
                <Link to="/data-assets" className={classes.link}>
                    <ArrowBackIosIcon fontSize='small' />
                    <span>Back</span>
                </Link>
                <div className={classes.link} onClick={handleReset}>
                    <ReplayIcon fontSize='small' />
                    <span>Reset</span>
                </div>
            </div>
            <div >
                <Accordion style={{ margin: "1% 0" }}
                    key={1}
                    onChange={handleChange(1)}
                    expanded={expanded === 1}
                    TransitionProps={{ unmountOnExit: true }}
                >
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <Typography className={classes.heading}>Asset Attributes</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <div style={{ padding: "0 2%" }}>
                            {props.mode === 'edit' &&
                                <FormControl className={classes.formControl}>
                                    <div > ID* </div>
                                    <TextField
                                        disabled={props.mode === 'edit'}
                                        margin='dense'
                                        variant='outlined'
                                        value={props.assetFieldValues.asset_id}
                                        id="id_label"
                                        onChange={(event) => handleValueChange(props.assetFieldValue, 'asset_id', 'assetIDError', event.target.value)}
                                    />
                                </FormControl>}
                            <FormControl className={classes.formControl}>
                                <div >Name*</div>
                                <TextField
                                    error={error.assetNameError}
                                    disabled={disableButton}
                                    margin='dense'
                                    variant='outlined'
                                    value={props.assetFieldValues.asset_nm}
                                    id="asset_nm"
                                    onChange={(event) => handleMaxCharacter(props.assetFieldValue, 'asset_nm', 'assetNameError', event.target.value, 25)}
                                />
                                <FormHelperText>{error.assetNameError ? (props.assetFieldValues.asset_nm.length > 0 ? <span style={{ color: 'red' }}>Reached maximum limit of 25 characters</span> : '') : ''}</FormHelperText>
                            </FormControl>
                            <FormControl className={classes.formControl}>
                                <div style={{ marginBottom: '3%' }}>Source system ID*</div>
                                <Select
                                    error={error.sourceSysIDError}
                                    disabled={props.mode === 'edit'}
                                    margin="dense"
                                    variant="outlined"
                                    id="src_sys_id"
                                    value={props.assetFieldValues.src_sys_id}
                                    onChange={(event) => handleValueChange(props.assetFieldValue, 'src_sys_id', 'sourceSysIDError', event.target.value)}
                                >
                                    <MenuItem value="">
                                        <em>Select source system ID</em>
                                    </MenuItem>
                                    {sourceSysData.map(item => {
                                        return <MenuItem key={item.src_sys_id} value={item.src_sys_id}>{item.src_sys_id}</MenuItem>
                                    })}
                                </Select>
                            </FormControl>
                            <FormControl className={classes.formControl}>
                                <div style={{ marginBottom: '3%' }}>Target ID*</div>
                                <Select
                                    error={error.targetIDError}
                                    disabled={props.mode === 'edit'}
                                    margin="dense"
                                    variant="outlined"
                                    id="target_id"
                                    value={props.assetFieldValues.target_id}
                                    onChange={(event) => handleValueChange(props.assetFieldValue, 'target_id', 'targetIDError', event.target.value)}
                                >
                                    <MenuItem value="">
                                        <em>Select target ID</em>
                                    </MenuItem>
                                    {targetSysData.map(item => {
                                        return <MenuItem key={item.target_id} value={item.target_id}>{item.target_id}</MenuItem>
                                    })}
                                </Select>
                            </FormControl>
                            {displayField &&
                                <>
                                    <FormControl className={classes.formControl}>
                                        <div style={{ marginBottom: '3%' }}>Multi-part file*</div>
                                        <Select
                                            error={error.targetError}
                                            disabled={disableButton}
                                            margin="dense"
                                            variant="outlined"
                                            id="multipartition"
                                            value={props.assetFieldValues.multipartition}
                                            onChange={(event) => handleValueChange(props.assetFieldValue, 'multipartition', 'multiPartitionError', event.target.value)}
                                        >
                                            {BOOLEAN_VALUES.map(item => {
                                                return <MenuItem key={item.value} value={item.value} >{item.name}</MenuItem>
                                            })}
                                        </Select>
                                    </FormControl>
                                    <FormControl className={classes.formControl}>
                                        <div style={{ marginBottom: '3%' }}>File type*</div>
                                        <Select
                                            error={error.fileTypeError}
                                            disabled={disableButton}
                                            margin="dense"
                                            variant="outlined"
                                            id="file_type"
                                            value={props.assetFieldValues.file_type}
                                            onChange={(event) => handleValueChange(props.assetFieldValue, 'file_type', 'fileTypeError', event.target.value)}
                                        >
                                            <MenuItem value="">
                                                <em>Select file type</em>
                                            </MenuItem>
                                            {FILE_TYPE.map(item => {
                                                return <MenuItem key={item.value} value={item.value} >{item.name}</MenuItem>
                                            })}
                                        </Select>
                                    </FormControl>
                                    {/* <FormControl className={classes.formControl}>
                                        <div > Trigger file pattern</div>
                                        <TextField
                                            error={error.triggerFilePtrnError}
                                            disabled={disableButton}
                                            margin='dense'
                                            variant='outlined'
                                            value={props.assetFieldValues.trigger_file_pattern}
                                            id="trigger_file_pattern"
                                            onChange={(event) => handleMaxCharacter(props.assetFieldValue, 'trigger_file_pattern', 'triggerFilePtrnError', event.target.value, 10)}
                                        />
                                        <FormHelperText>{error.triggerFilePtrnError ? (props.assetFieldValues.trigger_file_pattern.length > 0 ? <span style={{ color: 'red' }}>Reached maximum limit of 10 characters</span> : '') : ''}</FormHelperText>
                                    </FormControl> */}

                                </>}
                            {displayField && props.assetFieldValues.file_type === 'csv' &&
                                <>

                                    <FormControl className={classes.formControl}>
                                        <div style={{ marginBottom: '3%' }}>Header*</div>
                                        <Select
                                            error={error.fileHeaderError}
                                            disabled={disableButton}
                                            margin="dense"
                                            variant="outlined"
                                            id="file_header"
                                            value={props.assetFieldValues.file_header}
                                            onChange={(event) => handleValueChange(props.assetFieldValue, 'file_header', 'fileHeaderError', event.target.value)}
                                        >
                                            {BOOLEAN_VALUES.map(item => {
                                                return <MenuItem key={item.value} value={item.value} >{item.name}</MenuItem>
                                            })}
                                        </Select>
                                    </FormControl>
                                    <FormControl className={classes.formControl}>
                                        <div > Delimiter*</div>
                                        <TextField
                                            error={error.fileDelimiterError}
                                            disabled={disableButton}
                                            margin='dense'
                                            variant='outlined'
                                            value={props.assetFieldValues.file_delim}
                                            id="file_delim"
                                            onChange={(event) => handleMaxCharacter(props.assetFieldValue, 'file_delim', 'fileDelimiterError', event.target.value, 1)}
                                        />
                                        <FormHelperText>{error.fileDelimiterError ? <span style={{ color: 'red' }}>Only a single character is allowed</span> : ''}</FormHelperText>
                                    </FormControl>
                                </>}
                            <FormControl className={classes.formControl}>
                                <div style={{ marginBottom: '3%' }}> Enable file encryption*</div>
                                <Select
                                    error={error.fileEncryptIndError}
                                    disabled={disableButton}
                                    margin="dense"
                                    variant="outlined"
                                    id="file_encryption_ind"
                                    value={props.assetFieldValues.file_encryption_ind}
                                    onChange={(event) => handleValueChange(props.assetFieldValue, 'file_encryption_ind', 'fileEncryptIndError', event.target.value)}
                                >
                                    {BOOLEAN_VALUES.map(item => {
                                        return <MenuItem key={item.value} value={item.value} >{item.name}</MenuItem>
                                    })}
                                </Select>
                            </FormControl>
                            <FormControl className={classes.formControl}>
                                <div > Asset Owner* </div>
                                <TextField
                                    error={error.assetOwnerError}
                                    disabled={disableButton}
                                    margin='dense'
                                    variant='outlined'
                                    value={props.assetFieldValues.asset_owner}
                                    id="asset_owner"
                                    onChange={(event) => handleValueChange(props.assetFieldValue, 'asset_owner', 'assetOwnerError', event.target.value)}
                                />
                            </FormControl>
                            <FormControl className={classes.formControl} style={{ minWidth: '350px' }}>
                                <div >Support contact*</div>
                                <TextField
                                    error={error.supportContactError}
                                    disabled={disableButton}
                                    margin='dense'
                                    variant='outlined'
                                    value={props.assetFieldValues.support_cntct}
                                    id="support_cntct"
                                    onChange={(event) => handleValueChange(props.assetFieldValue, 'support_cntct', 'supportContactError', event.target.value)}
                                />
                            </FormControl>
                            <FormControl className={classes.formControl}>
                                <div> Enable Redshift stage Load </div>
                                <ThemeSwitch
                                    name="rs_load_ind"
                                    inputProps={{ 'aria-label': 'primary checkbox' }}
                                    margin='dense'
                                    variant='outlined'
                                    checked={Boolean(props.assetFieldValues.rs_load_ind)}
                                    id="rs_load_ind"
                                    onChange={handleLoadChange}
                                />
                            </FormControl>
                            {/* <FormControl className={classes.formControl}>
                                <div style={{ marginBottom: '3%' }}>Enable Redshift stage load*</div>
                                <Select
                                    error={error.rsLoadError}
                                    disabled={disableButton}
                                    margin="dense"
                                    variant="outlined"
                                    id="rs_load_ind"
                                    value={props.assetFieldValues.rs_load_ind}
                                    onChange={(event) => handleValueChange(props.assetFieldValue, 'rs_load_ind', 'rsLoadError', event.target.value)}
                                >
                                    {BOOLEAN_VALUES.map(item => {
                                        return <MenuItem key={item.value} value={item.value} >{item.name}</MenuItem>
                                    })}
                                </Select>
                            </FormControl> */}
                        </div>
                    </AccordionDetails>
                </Accordion>
                <Accordion style={{ margin: "1% 0" }}
                    key={2}
                    onChange={handleChange(2)}
                    expanded={expanded === 2}
                    TransitionProps={{ unmountOnExit: true }}
                >
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel2a-content"
                        id="panel2a-header"
                    >
                        <Typography className={classes.heading}>Column Attributes</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <ColumnAttributes />
                    </AccordionDetails>
                </Accordion>
                <Accordion style={{ margin: "1% 0" }}
                    key={3}
                    onChange={handleChange(3)}
                    expanded={expanded === 3}
                    TransitionProps={{ unmountOnExit: true }}
                >
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel3a-content"
                        id="panel3a-header"
                    >
                        <Typography className={classes.heading}>Ingestion Attributes</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <div style={{ padding: "0 2%", width: '100%' }}>
                            {srcIngestionValue === 'database' &&
                                <FormControl className={classes.formControl}>
                                    <div > Source Table Name*</div>
                                    <TextField
                                        error={error.sourceTableNameError}
                                        disabled={disableButton}
                                        margin='dense'
                                        variant='outlined'
                                        value={props.ingestionFieldValues.src_table_name}
                                        id="src_table_name"
                                        onChange={(event) => handleValueChange(props.ingestionFieldValue, 'src_table_name', 'sourceTableNameError', event.target.value)}
                                    />
                                </FormControl>}
                            {srcIngestionValue === 'database' &&
                                <FormControl className={classes.formControl}>
                                    <div style={{ marginBottom: '3%' }}>Extraction Method*</div>
                                    <Select
                                        error={error.extMethodError}
                                        disabled={props.mode === 'edit' || disableButton}
                                        margin="dense"
                                        variant="outlined"
                                        id="ext_method"
                                        value={props.ingestionFieldValues.ext_method}
                                        onChange={(event) => handleValueChange(props.ingestionFieldValue, 'ext_method', 'extMethodError', event.target.value)}
                                    >
                                        <MenuItem value="">
                                            <em>Select extraction method</em>
                                        </MenuItem>
                                        <MenuItem key="full" value="full">Full</MenuItem>
                                        <MenuItem key="incremental" value="incremental">Incremental</MenuItem>
                                    </Select>
                                </FormControl>}
                            {srcIngestionValue === 'database' && props.ingestionFieldValues.ext_method === 'incremental' &&
                                <FormControl className={classes.formControl}>
                                    <div style={{ marginBottom: '3%' }}>Extraction Column*</div>
                                    <Select
                                        error={error.extColumnError}
                                        disabled={disableButton}
                                        margin="dense"
                                        variant="outlined"
                                        id="ext_col"
                                        value={props.ingestionFieldValues.ext_col}
                                        onChange={(event) => handleValueChange(props.ingestionFieldValue, 'ext_col', 'extColumnError', event.target.value)}
                                    >
                                        <MenuItem value="">
                                            <em>Select extraction Column</em>
                                        </MenuItem>
                                        {props.columnAttributesData.map(row => {
                                            if (row.data_type === 'Datetime') {
                                                return <MenuItem key={row.col_nm} value={row.col_nm}>{row.col_nm}</MenuItem>
                                            }
                                        })

                                        }
                                    </Select>
                                </FormControl>}
                            {/* {srcIngestionValue === 'database' &&
                                <FormControl className={classes.formControl}>
                                    <div > Source SQL Query* </div>
                                    <TextField
                                        error={error.sourceSqlQueryError}
                                        disabled={disableButton}
                                        margin='dense'
                                        variant='outlined'
                                        value={props.ingestionFieldValues.src_sql_query}
                                        id="src_sql_query"
                                        onChange={(event) => handleValueChange(props.ingestionFieldValue, 'src_sql_query', 'sourceSqlQueryError', event.target.value)}
                                    />
                                </FormControl>} */}
                            {props.mode !== 'create' && props.mode !== 'clone' && srcIngestionValue !== 'database' &&
                                <FormControl className={classes.formControl}>
                                    <div> Ingestion Source Path* </div>
                                    <TextField
                                        error={error.ingestionSourcePathError}
                                        disabled={disableButton || props.mode === 'edit'}
                                        margin='dense'
                                        variant='outlined'
                                        value={props.ingestionFieldValues.ingstn_src_path}
                                        id="ingstn_src_path"
                                        onChange={(event) => handleValueChange(props.ingestionFieldValue, 'ingstn_src_path', 'ingestionSourcePathError', event.target.value)}
                                    />
                                </FormControl>}
                            <FormControl className={classes.formControl}>
                                <div style={{ marginBottom: '3%' }}>Trigger Mechanism*</div>
                                <Select
                                    error={error.triggerMechanismError}
                                    disabled={disableButton}
                                    margin="dense"
                                    variant="outlined"
                                    id="trigger_mechanism"
                                    value={props.ingestionFieldValues.trigger_mechanism}
                                    onChange={(event) => handleValueChange(props.ingestionFieldValue, 'trigger_mechanism', 'triggerMechanismError', event.target.value)}
                                >
                                    <MenuItem value="">
                                        <em>Select trigger mechanism</em>
                                    </MenuItem>
                                    <MenuItem key={'time_driven'} value={'time_driven'} >Time Driven</MenuItem>
                                    {srcIngestionValue !== 'database' &&
                                        <MenuItem key={'event_driven'} value={'event_driven'} >Event Driven</MenuItem>}
                                    {/* {TRIGGER_MECHANISM.map(item => {
                                        return <MenuItem key={item.value} value={item.value} >{item.name}</MenuItem>
                                    })} */}
                                </Select>
                            </FormControl>
                            {props.ingestionFieldValues.trigger_mechanism === 'time_driven' &&
                                <Tooltip title="This is a cron tab. Enter digits separated by space. Example: * * * * *" placement='top'>
                                    <FormControl className={classes.formControl}>
                                        <div>Frequency*</div>
                                        <TextField
                                            error={error.crontabError}
                                            disabled={disableButton}
                                            margin='dense'
                                            variant='outlined'
                                            helperText={error.crontabError ? <span style={{ color: 'red' }}>{errorValue}</span> : ''}
                                            value={props.mode === 'create' ? cronValue : props.ingestionFieldValues.frequency}
                                            id="frequency"
                                            onChange={(event) => handleValueChange(props.ingestionFieldValue, 'frequency', 'crontabError', event.target.value)}
                                        />
                                    </FormControl>
                                </Tooltip>}

                        </div>
                    </AccordionDetails>
                </Accordion>
                <Accordion style={{ margin: "1% 0" }}
                    key={4}
                    onChange={handleChange(4)}
                    expanded={expanded === 4}
                    TransitionProps={{ unmountOnExit: true }}
                >
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel4a-content"
                        id="panel4a-header"
                    >
                        <Typography className={classes.heading}>DQ Rules Attributes</Typography>
                    </AccordionSummary>
                    <AccordionDetails style={{ flexDirection: 'column' }}>
                        <div style={{ marginBottom: '10px' }}>DQ Rules</div>
                        <Editor
                            language={'jsx'}
                            theme={'default'}
                            code={props.dqRulesFieldValues?.join('\n') || ""}
                            lineNumber={true}
                            readOnly={false}
                            clipboard={true}
                            showLanguage={true}
                            changeCode={code => {
                                props.dqRulesFieldValue(code?.split('\n').filter(c => c?.trim().length > 0) || [])
                                //console.log(code)
                            }}
                        />
                    </AccordionDetails>
                </Accordion>
            </div>
            <Button disabled={disableButton} className={classes.button} onClick={handleSave} >
                {disableButton && <>Saving <CircularProgress size={16} style={{ marginLeft: '10px', color: 'white' }} /></>}
                {!disableButton && 'Save'}
            </Button>
            <Button className={classes.button} disabled={disableButton} style={{ backgroundColor: '#A3A3A390' }} onClick={handleCancel}>Cancel</Button>
            <Backdrop className={classes.backdrop} open={backdrop} >
                <CircularProgress color="inherit" />
            </Backdrop>
        </div>
    );
}

const mapStateToProps = state => ({
    open: state.dataAssetState.dialogue.flag,
    fieldValues: state.dataAssetState.dataAssetValues,
    assetFieldValues: state.dataAssetState.dataAssetValues.asset_info,
    ingestionFieldValues: state.dataAssetState.dataAssetValues.ingestion_attributes,
    columnAttributesData: state.dataAssetState.dataAssetValues.asset_attributes,
    dqRulesFieldValues: state.dataAssetState.dataAssetValues.adv_dq_rules,
    mode: state.dataAssetState.updateMode.mode,
    dataFlag: state.dataAssetState.updateDataFlag.dataFlag,
    selectedRow: state.dataAssetState.updateSelectedRow,
    columnAttributeError: state.dataAssetState.columnAttributeError.data
})
const mapDispatchToProps = dispatch => bindActionCreators({
    openSnackbar,
    updateMode,
    updateDataFlag,
    dataAssetFieldValue,
    resetDataAssetValues,
    updateAllDataAssetValues,
    assetFieldValue,
    ingestionFieldValue,
    dqRulesFieldValue,
    openSideBar,
    setColumnAttributeError: columnAttributeError
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(CreateDataAsset);