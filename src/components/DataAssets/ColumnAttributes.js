import { Button, Divider, TextField, Tooltip } from '@material-ui/core';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import { FormControlLabel, FormGroup, FormLabel, Checkbox, Box } from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {
    closeDataAssetDialogue, columnFieldValue, columnAttributeError, assetFieldValue,
    dataAssetFieldValue, resetDataAssetValues, updateAllDataAssetValues, updateDataFlag, updateMode
} from 'actions/dataAssetActions';
import { openSnackbar } from 'actions/notificationAction';
import { BOOLEAN_VALUES, DATA_CLASSIFICATION, DATE_TIME_FORMATS, TARGET_DATA_TYPE } from 'components/Constants/DataAssetsConstants';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { bindActionCreators } from 'redux';

const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: '100%',
        '& .MuiAccordionSummary-content': {
            width: '100%'
        }
    },
    link: {
        cursor: 'pointer',
        display: 'flex',
        color: 'black',
        textDecoration: "none",
        fontSize: "12px",
        marginLeft: 0,
    },
    editableForm: {
        '& div.MuiInputBase-formControl': {
            backgroundColor: 'white'
        },
        '& .MuiSelect-select:focus': {
            backgroundColor: 'white'
        }
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 250,
        margin: '0px 3% 2% 0px',
        fontSize: 13,
        wordBreak: 'break-word',
        maxWidth: 250,
    },
    formControlLabel:{
      
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
        }
    },
}));

const ColumnAttributes = (props) => {
    const classes = useStyles();
    const navigate = useNavigate();
    const [expanded, setExpanded] = React.useState(-1);
    const [disableButton, setDisableButton] = useState(false);
    const [dateTimeFormatField, setDateTimeFormatField] = useState({});
    const [customDateTimeFormatField, setCustomDateTimeFormatField] = useState({});
    const [targetDateTimeFormatField, setTargetDateTimeFormatField] = useState({});
    const [customTargetDateTimeFormatField, setCustomTargetDateTimeFormatField] = useState({});
    const [checkDisable, setCheckDisable] = useState(false);

    const handleChangeBox = () => {
        setCheckDisable(!props.assetFieldValues.derive_schema)
        props.assetFieldValue("derive_schema", !props.assetFieldValues.derive_schema)
        console.log(checkDisable);
    }

    useEffect(() => {
        if (props.mode === 'view' || props.mode === 'delete') {
            setDisableButton(true);
        }
        var dateTimeFormat = {};
        var targetDateTimeFormat = {};
        var customDateTimeFormat = {};
        var customTargetDateTimeFormat = {};

        props.columnAttributesData?.forEach(row => {
            if (DATE_TIME_FORMATS.find(d => d.value == row.datetime_format)) {
                dateTimeFormat[row.col_id + ""] = row.datetime_format;
            } else if (row.datetime_format) {
                dateTimeFormat[row.col_id + ""] = "custom";
                customDateTimeFormat[row.col_id + ""] = row.datetime_format
            }

            if (DATE_TIME_FORMATS.find(d => d.value == row.tgt_datetime_format)) {
                targetDateTimeFormat[row.col_id + ""] = row.tgt_datetime_format;
            } else if (row.tgt_datetime_format) {
                targetDateTimeFormat[row.col_id + ""] = "custom";
                customTargetDateTimeFormat[row.col_id + ""] = row.tgt_datetime_format
            }
        })
        setDateTimeFormatField(dateTimeFormat)
        setTargetDateTimeFormatField(targetDateTimeFormat)
        setCustomDateTimeFormatField(customDateTimeFormat)
        setCustomTargetDateTimeFormatField(customTargetDateTimeFormat)
        setExpanded(0)
        setCheckDisable(props.assetFieldValues.derive_schema)
    }, []);

    // useEffect(() => {
    //     props.saveForm && validate();
    // }, [props.saveForm]);

    const handleDateTimeFormatChange = (row, value) => {
        setDateTimeFormatField({ ...dateTimeFormatField, [row.col_id + ""]: value })
        handleValueChange(row, "datetime_format", value == "custom" ? "" : value, { required: value != "custom" });
    }

    const handleCustomDateTimeFormatChange = (row, value) => {
        setCustomDateTimeFormatField({ ...customDateTimeFormatField, [row.col_id]: value })
        handleValueChange(row, "datetime_format", value, { required: false });
        var errorMessage = (value || "").toString().trim().length > 0 ? "" : "Required Field";
        props.columnAttributeError({ ...props.error, [row.col_id]: { ...props.error[`${row.col_id}`], customdatetime_format: errorMessage } })
    }

    const handleTargetDateTimeFormatChange = (row, value) => {
        setTargetDateTimeFormatField({ ...targetDateTimeFormatField, [row.col_id]: value })
        handleValueChange(row, "tgt_datetime_format", value == "custom" ? "" : value);
    }

    const handleCustomTargetDateTimeFormatChange = (row, value) => {
        setCustomTargetDateTimeFormatField({ ...customTargetDateTimeFormatField, [row.col_id]: value })
        handleValueChange(row, "tgt_datetime_format", value, { required: false });
        var errorMessage = (value || "").toString().trim().length > 0 ? "" : "Required Field";
        props.columnAttributeError({ ...props.error, [row.col_id]: { ...props.error[`${row.col_id}`], customtargetdatetime_format: errorMessage } })
    }

    const handleChange = (row, id) => (_, isExpanded) => {
        setExpanded(isExpanded ? id : false)
    };

    const findIndexofObject = (row) => {
        let indexValue = null;
        let info = props.columnAttributesData;
        info.map((item, index) => {
            if (_.isEqual(item, row)) {
                indexValue = index;
            }
        })
        return indexValue;
    }

    const handleValueChange = (row, field, value, validator = { required: true }) => {
        let info = props.columnAttributesData;
        let indexValue = findIndexofObject(row);
        info.splice(indexValue, 1, { ...row, [field]: value })
        props.columnFieldValue([...info]);
        var errorMessage = "";
        if (validator?.required) {
            errorMessage = (value || "").toString().trim().length > 0 ? "" : "Required Field";
            props.columnAttributeError({ ...props.error, [row.col_id]: { ...props.error[`${row.col_id}`], [field]: errorMessage } })
        } else {
            props.columnAttributeError({ ...props.error, [row.col_id]: { ...props.error[`${row.col_id}`], [field]: "" } })
        }

        if (validator?.maxLength > 0) {
            errorMessage = (value.trim().length <= validator?.maxLength)
                ? errorMessage : `Reached maximum limit of ${validator?.maxLength} characters`;
            props.columnAttributeError({ ...props.error, [row.col_id]: { ...props.error[`${row.col_id}`], [field]: errorMessage } })
        }
    }

    const handleReset = () => {
        props.resetDataAssetValues();
        setDisableButton(false);
        props.columnAttributeError({})
    }

    const handleCancel = () => {
        props.updateMode('');
        props.resetDataAssetValues();
        props.closeDataAssetDialogue();
        navigate("/data-assets");
    }

    const validate = () => {
        var fieldsToValidate = ["col_nm", "col_desc", "data_classification", "data_type",
            "tgt_col_nm", "tgt_data_type", "datetime_format", "tgt_datetime_format", "col_length", "req_tokenization", "pk_ind", "null_ind"];
        var newErrorObj = {};
        props.columnAttributesData?.forEach(row => {
            fieldsToValidate.forEach(field => {
                if ((field == "datetime_format" && row['data_type'] != "Datetime")
                    || (field == "tgt_datetime_format" && row['tgt_data_type'] != "Datetime")) {
                    return;
                }

                var errorMessage = "";
                errorMessage = row[`${field}`]?.toString().trim().length > 0
                    ? ((props.error[`${row.col_id}`] && props.error[`${row.col_id}`][`${field}`]) || "")
                    : "Required Field";

                if (field == "datetime_format" && customDateTimeFormatField[`${row.col_id}`]?.toString().trim().length > 0) {
                    errorMessage = "";
                }
                newErrorObj = { ...newErrorObj, [row.col_id]: { ...newErrorObj[`${row.col_id}`], [field]: errorMessage } }
                //console.log("newErrorObj", newErrorObj)
                //handleValueChange(row, field, row[`${field}`], {required: true})                    
            })
        })

        var isError = false;
        newErrorObj = { ...props.error, ...newErrorObj }
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
        props.columnAttributeError({ ...newErrorObj })
    }

    const handleAddNew = () => {
        props.columnFieldValue([...props.columnAttributesData, {
            "col_id": props.columnAttributesData.length + 1,
            "col_nm": "",
            "tgt_col_nm": "",
            "tgt_data_type": "",
            "datetime_format": "",
            "tgt_datetime_format": "",
            "col_desc": "",
            "data_classification": "",
            "col_length": 0,
            "req_tokenization": false,
            "pk_ind": false,
            "null_ind": false,
            "data_type": "",
            // "modified_ts": ""
        }]);
        setExpanded(props.columnAttributesData.length)
    }

    const handleDelete = (row) => {
        let info = props.columnAttributesData;
        let indexValue = findIndexofObject(row);
        info.splice(indexValue, 1);
        let data = info.map((item, index) => { return { ...item, col_id: index + 1 } })
        props.columnFieldValue([...data]);

        const newCustomDateTime = { ...customDateTimeFormatField }
        delete newCustomDateTime["" + row.col_id];
        setCustomDateTimeFormatField(newCustomDateTime)

        const newDateTime = { ...dateTimeFormatField }
        delete newDateTime["" + row.col_id];
        setDateTimeFormatField(newDateTime)

        const newTargetCustomDateTime = { ...customTargetDateTimeFormatField }
        delete newTargetCustomDateTime["" + row.col_id];
        setCustomTargetDateTimeFormatField(newTargetCustomDateTime)

        const newTargetDateTime = { ...targetDateTimeFormatField }
        delete newTargetDateTime["" + row.col_id];
        setTargetDateTimeFormatField(newTargetDateTime)

        const newFormError = { ...props.error }
        delete newFormError[row.col_id];
        props.columnAttributeError(newFormError)
    }

    return (
        <>
            {!disableButton &&
                <div style={{ position: 'absolute', top: '1%', right: '5%' }}>
                    <Button variant="contained" className={classes.button} onClick={handleAddNew}>Add New +</Button>
                </div>}
                <div style={{position: 'absolute',top: '1%', right: '18%', paddingTop: "13px"}}>
                <Box className={classes.formControlLabel}>
                        <Box>
                            <FormControlLabel label=" Derive Schema"
                                control={<Checkbox checked={checkDisable} onChange={handleChangeBox} />}
                            />
                        </Box>
                    </Box>
                </div>
            <div className={classes.root}>
                {props.columnAttributesData.map((row, index) => {
                    return <Accordion
                        style={{ margin: "1% 0", width: '100%', backgroundColor: '#e2e2e278', minWidth: '85vw' }}
                        key={index}
                        onChange={handleChange(row, index)}
                        expanded={expanded === index}
                        TransitionProps={{ unmountOnExit: true }}
                    >
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls={`panel${index}a-content`}
                            id={`panel${index}a-header`}
                            style={{
                                backgroundColor: '#0000000f',
                                padding: "0 30px",
                                width: '100%'
                            }}
                        >
                            <div style={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Typography style={{ width: '100%', textOverflow: "ellipsis", overflow: "hidden", whiteSpace: 'nowrap' }}>
                                    <span style={{ width: '30%' }}>
                                        {`${row.col_nm}`}
                                    </span>
                                    <span style={{ padding: '0 30px', width: '10%', color: '#aaa' }}>|</span>
                                    <span style={{ width: '60%', textOverflow: "ellipsis", overflow: "hidden", whiteSpace: 'nowrap' }}>
                                        {`${row.col_desc}`}
                                    </span>
                                </Typography>
                                {!disableButton && <Tooltip title="Delete"><span style={{ marginLeft: '30px' }}><DeleteOutlineOutlinedIcon onClick={() => handleDelete(row)} /></span></Tooltip>}
                            </div>

                        </AccordionSummary>
                        <AccordionDetails>
                            <div style={{ padding: "1%" }} className={disableButton || classes.editableForm}>
                                <FormControl className={classes.formControl}>
                                    <div >Name*</div>
                                    <TextField
                                        error={Boolean(props.error[`${row.col_id}`]?.col_nm)}
                                        disabled={disableButton || checkDisable}
                                        margin='dense'
                                        variant='outlined'
                                        helperText={props.error[`${row.col_id}`]?.col_nm}
                                        value={row.col_nm}
                                        id="col_nm"
                                        onChange={(event) => handleValueChange(row, 'col_nm', event.target.value, { required: true, maxLength: 30 })}
                                    />
                                </FormControl>
                                <FormControl className={classes.formControl} style={{ minWidth: '535px' }}>
                                    <div > Description* </div>
                                    <TextField
                                        error={Boolean(props.error[`${row.col_id}`]?.col_desc)}
                                        disabled={disableButton  || checkDisable}
                                        margin='dense'
                                        variant='outlined'
                                        helperText={props.error[`${row.col_id}`]?.col_desc}
                                        value={row.col_desc}
                                        id="col_desc"
                                        onChange={(event) => handleValueChange(row, 'col_desc', event.target.value, { required: true, maxLength: 400 })}
                                    />
                                </FormControl>
                                <FormControl className={classes.formControl}>
                                    <div style={{ marginBottom: '3%' }}>Data Type*</div>
                                    <Select
                                        error={Boolean(props.error[`${row.col_id}`]?.data_type)}
                                        disabled={disableButton || checkDisable }
                                        margin="dense"
                                        variant="outlined"
                                        helperText={props.error[`${row.col_id}`]?.data_type}
                                        id="data_type"
                                        value={row.data_type}
                                        onChange={(event) => handleValueChange(row, 'data_type', event.target.value)}
                                    >
                                        <MenuItem value="">
                                            <em>Select data type</em>
                                        </MenuItem>
                                        {TARGET_DATA_TYPE.map(item => {
                                            return <MenuItem key={item.value} value={item.value}>{item.name}</MenuItem>
                                        })}
                                    </Select>
                                </FormControl>
                                {row.data_type === "Datetime" &&
                                    <FormControl className={classes.formControl}>
                                        <div style={{ marginBottom: '3%' }}>Datetime Format*</div>
                                        <Select
                                            error={Boolean(props.error[`${row.col_id}`]?.datetime_format)}
                                            disabled={disableButton || checkDisable }
                                            margin="dense"
                                            variant="outlined"
                                            id="datetime_format"
                                            helperText={props.error[`${row.col_id}`]?.datetime_format}
                                            value={dateTimeFormatField[`${row.col_id}`]}
                                            onChange={(event) => handleDateTimeFormatChange(row, event.target.value)}
                                        >
                                            <MenuItem value="">
                                                <em>Select datetime format</em>
                                            </MenuItem>
                                            {DATE_TIME_FORMATS.map(item => {
                                                return <MenuItem key={item.value} value={item.value}>{item.name}</MenuItem>
                                            })}
                                        </Select>
                                    </FormControl>}
                                {row.data_type === "Datetime" && dateTimeFormatField[`${row.col_id}`] == "custom" &&
                                    <FormControl className={classes.formControl}>
                                        <div>Custom Datetime Format*</div>
                                        <TextField
                                            type={"text"}
                                            error={Boolean(props.error[`${row.col_id}`]?.customdatetime_format)}
                                            disabled={disableButton || checkDisable}
                                            margin="dense"
                                            variant="outlined"
                                            helperText={props.error[`${row.col_id}`]?.customdatetime_format}
                                            id="customdatetime_format"
                                            value={customDateTimeFormatField[`${row.col_id}`]}
                                            onChange={(event) => handleCustomDateTimeFormatChange(row, event.target.value)}
                                        />
                                    </FormControl>}
                                <FormControl className={classes.formControl}>
                                    <div >Column Length</div>
                                    <TextField
                                        type={"number"}
                                        error={Boolean(props.error[`${row.col_id}`]?.col_length)}
                                        disabled={disableButton || checkDisable}
                                        margin='dense'
                                        variant='outlined'
                                        helperText={props.error[`${row.col_id}`]?.col_length}
                                        value={row.col_length}
                                        id="col_length"
                                        onChange={(event) => handleValueChange(row, 'col_length', event.target.value)}
                                    />
                                </FormControl>
                                <FormControl className={classes.formControl}>
                                    <div style={{ marginBottom: '3%' }}>Primary key Indicator*</div>
                                    <Select
                                        error={Boolean(props.error[`${row.col_id}`]?.pk_ind)}
                                        disabled={disableButton || checkDisable}
                                        margin="dense"
                                        variant="outlined"
                                        helperText={props.error[`${row.col_id}`]?.pk_ind}
                                        id="pk_ind"
                                        value={row.pk_ind}
                                        onChange={(event) => handleValueChange(row, 'pk_ind', event.target.value)}
                                    >
                                        {BOOLEAN_VALUES.map(item => {
                                            return <MenuItem key={item.value} value={item.value} >{item.name}</MenuItem>
                                        })}
                                    </Select>
                                </FormControl>
                                <FormControl className={classes.formControl}>
                                    <div style={{ marginBottom: '3%' }}>Data Classification*</div>
                                    <Select
                                        error={Boolean(props.error[`${row.col_id}`]?.data_classification)}
                                        disabled={disableButton || checkDisable}
                                        margin="dense"
                                        variant="outlined"
                                        helperText={props.error[`${row.col_id}`]?.data_classification}
                                        id="data_classification"
                                        value={row.data_classification}
                                        onChange={(event) => handleValueChange(row, 'data_classification', event.target.value)}
                                    >
                                        {DATA_CLASSIFICATION.map(item => {
                                            return <MenuItem key={item.value} value={item.value} >{item.name}</MenuItem>
                                        })}
                                    </Select>
                                </FormControl>
                                <FormControl className={classes.formControl}>
                                    <div style={{ marginBottom: '3%' }}> Enable Tokenization*</div>
                                    <Select
                                        error={Boolean(props.error[`${row.col_id}`]?.req_tokenization)}
                                        disabled={disableButton || checkDisable}
                                        margin="dense"
                                        variant="outlined"
                                        helperText={props.error[`${row.col_id}`]?.req_tokenization}
                                        id=""
                                        value={row.req_tokenization}
                                        onChange={(event) => handleValueChange(row, 'req_tokenization', event.target.value)}
                                    >
                                        {BOOLEAN_VALUES.map(item => {
                                            return <MenuItem key={item.value} value={item.value} >{item.name}</MenuItem>
                                        })}
                                    </Select>
                                </FormControl>
                                <Divider style={{ margin: '1% 7% 2% 1%' }} />
                                <FormControl className={classes.formControl}>
                                    <div >Target column name</div>
                                    <TextField
                                        // error={Boolean(props.error[`${row.col_id}`]?.tgt_col_nm)}
                                        disabled={disableButton || checkDisable}
                                        margin='dense'
                                        variant='outlined'
                                        // helperText={props.error[`${row.col_id}`]?.tgt_col_nm}
                                        value={row.tgt_col_nm}
                                        id="tgt_col_nm"
                                        onChange={(event) => handleValueChange(row, 'tgt_col_nm', event.target.value, { required: false})}
                                    />
                                </FormControl>
                                <FormControl className={classes.formControl}>
                                    <div style={{ marginBottom: '3%' }}>Target Data Type</div>
                                    <Select
                                        // error={Boolean(props.error[`${row.col_id}`]?.tgt_data_type)}
                                        disabled={disableButton || checkDisable}
                                        margin="dense"
                                        variant="outlined"
                                        // helperText={props.error[`${row.col_id}`]?.tgt_data_type}
                                        id="tgt_data_type"
                                        value={row.tgt_data_type}
                                        onChange={(event) => handleValueChange(row, 'tgt_data_type', event.target.value,{ required: false})}
                                    >
                                        <MenuItem value="">
                                            <em>Select target data type</em>
                                        </MenuItem>
                                        {TARGET_DATA_TYPE.map(item => {
                                            return <MenuItem key={item.value} value={item.value}>{item.name}</MenuItem>
                                        })}
                                    </Select>
                                </FormControl>
                                {row.tgt_data_type === "Datetime" &&
                                    <FormControl className={classes.formControl}>
                                        <div style={{ marginBottom: '3%' }}>Target Datetime Format*</div>
                                        <Select
                                            // error={Boolean(props.error[`${row.col_id}`]?.tgt_datetime_format)}
                                            disabled={disableButton || checkDisable}
                                            margin="dense"
                                            variant="outlined"
                                            // helperText={props.error[`${row.col_id}`]?.tgt_datetime_format}
                                            id="tgt_datetime_format"
                                            value={targetDateTimeFormatField[`${row.col_id}`]}
                                            onChange={(event) => handleTargetDateTimeFormatChange(row, event.target.value)}
                                        >
                                            <MenuItem value="">
                                                <em>Select target datetime format</em>
                                            </MenuItem>
                                            {DATE_TIME_FORMATS.map(item => {
                                                return <MenuItem key={item.value} value={item.value}>{item.name}</MenuItem>
                                            })}
                                        </Select>
                                    </FormControl>}

                                {row.tgt_data_type === "Datetime" &&
                                    targetDateTimeFormatField[`${row.col_id}`] === "custom" &&
                                    <FormControl className={classes.formControl}>
                                        <div>Custom Target Datetime Format*</div>
                                        <TextField
                                            type={"text"}
                                            error={Boolean(props.error[`${row.col_id}`]?.customtargetdatetime_format)}
                                            disabled={disableButton || checkDisable}
                                            margin="dense"
                                            variant="outlined"
                                            helperText={props.error[`${row.col_id}`]?.customtargetdatetime_format}
                                            id="customtargetdatetime_format"
                                            value={customTargetDateTimeFormatField[`${row.col_id}`]}
                                            onChange={(event) => handleCustomTargetDateTimeFormatChange(row, event.target.value)}
                                        />
                                    </FormControl>}
                            </div>
                        </AccordionDetails>
                    </Accordion>
                })}
            </div>
        </>
    );
}

const mapStateToProps = state => ({
    open: state.dataAssetState.dialogue.flag,
    columnAttributesData: state.dataAssetState.dataAssetValues.asset_attributes,
    mode: state.dataAssetState.updateMode.mode,
    dataFlag: state.dataAssetState.updateDataFlag.dataFlag,
    error: state.dataAssetState.columnAttributeError.data,
    assetFieldValues: state.dataAssetState.dataAssetValues.asset_info,
})

const mapDispatchToProps = dispatch => bindActionCreators({
    openSnackbar,
    updateMode,
    updateDataFlag,
    dataAssetFieldValue,
    closeDataAssetDialogue,
    resetDataAssetValues,
    updateAllDataAssetValues,
    columnFieldValue,
    columnAttributeError,
    assetFieldValue,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(ColumnAttributes);