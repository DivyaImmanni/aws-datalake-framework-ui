import Box from '@material-ui/core/Box';
import React from 'react';
import { makeStyles, } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import Radio from '@material-ui/core/Radio';
import { useState, useEffect } from 'react';
import Select from '@material-ui/core/Select';
import { Button, FormHelperText, TextField, Tooltip } from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import FileCopyTwoToneIcon from '@material-ui/icons/FileCopyTwoTone';
import StorageTwoToneIcon from '@material-ui/icons/StorageTwoTone';
import { MECHANISM } from './../Constants/SourceSystemConstants';
import defaultInstance from 'routes/defaultInstance';
import {
    columnAttributeError, assetFieldValue, dataAssetFieldValue, dqRulesFieldValue, ingestionFieldValue, resetDataAssetValues, updateAllDataAssetValues, updateDataFlag, updateMode
} from 'actions/dataAssetActions';
import { connect } from 'react-redux';
import { BOOLEAN_VALUES, FILE_TYPE } from 'components/Constants/DataAssetsConstants';
import { bindActionCreators } from 'redux';
import axios from 'axios';
import cron from 'cron-validate';
import Chip from '@material-ui/core/Chip';
import Autocomplete from '@material-ui/lab/Autocomplete';
import PageTitle from 'components/Common/PageTitle';
import { openSideBar } from 'actions/notificationAction';

const useStyles = makeStyles((theme) => ({
    box: {
        width: '300px',
        padding: "3px 10px",
        boxSizing: "border-box",
        cursor: 'pointer',
        borderRadius: "6px",
        '& > h2': {
            fontSize: '1rem',
            margin: '0',
            fontWeight: 'normal'
        },
        '& > p': {
            marginTop: '5px'
        }
    },
    boxBorder: {
        border: "1px solid #ccc"
    },
    root: {
        width: 500,
        '& > * + *': {
            marginTop: theme.spacing(3),
        },
    },
    selectedBox: {
        border: '1px solid #F7901D',
        '& > h2': {
            fontWeight: 'normal',
            fontSize:"17px"
        },
    },
    panel: {
        boxShadow: '-3px 5px 7px -1px #bbb'
    },
    boxContainer: {
        display: 'flex',
        padding: '20px',
        margin: '0',
        marginBottom: '20px',
        background: 'white',
    },
    boxHeader: {
        background: '#f1f1f1',
        padding: '20px',
        margin: '0'
    },
    formControl: {
        minWidth: 270,
        margin: '8px',
        fontSize: 13,
        wordBreak: 'break-word',
        maxWidth: 270
    },
    schemaTable: {
        margin: '20px'
    },
    schemaTableRow: {
        display: 'flex',
        '& > div': {
            padding: '10px',
            width: '50%'
        }
    },
    schemaTableHead: {
        display: 'flex',
        '& > div': {
            padding: '10px',
            fontWeight: 'bold',
            background: '#ededed',
            width: '50%'
        }
    },
    button: {
        backgroundColor: 'black',
        color: '#F7901D',
        '&:hover': {
            fontWeight: '600',
            backgroundColor: 'black',
        },
        '&:disabled': {
            background: '#A3A3A390',
        },
    },
    formControlRow: {
        display: 'flex',
        flexFlow: 'wrap',
        padding: '20px',
        margin: '0',
        background: 'white',
    },
    space: {
        marginTop: "25px"
    }
}));

const CreateDataAssetNew = (props) => {
    const classes = useStyles();
    const [ingestionType, setIngestionType] = useState('easy');
    const [srcIngestionValue, setSrcIngestionValue] = useState('');
    const [fileType, setFileType] = useState('file');
    const [dbType, setDbType] = useState('db');
    const [sourceSysData, setSourceSysData] = useState([]);
    const [disableButton, setDisableButton] = useState(false);
    const [targetSysData, setTargetSysData] = useState([]);
    const [displayField, setDisplayField] = useState(false);
    const [dbConfig, setDbConfig] = useState([]);
    const [error, setError] = useState({});
    const [fileError, setFileError] = useState("");
    const [cronValue, setCronValue] = useState('');
    const [srcSystemId, setSrcSystemId] = useState('');
    const [file, setFile] = useState(null);
    const [errorValue, setErrorValue] = useState('');
    const [schema, setSchema] = useState([]);

    useEffect(() => {
        getSourceSystemData();
        getTargetSystemData();

    }, [])

    function handleFileUploadChange(event) {
        const allowedExtension = "csv,orc,xml,parquet".split(",");
        const extension = event.target.files[0]?.name?.split('.').pop();
        
        if(!allowedExtension.includes(extension.toLowerCase())) {
            setFile(null);
            setFileError("File type now allowed. Please choose either of these csv, orc, xml, parquet")
        }
        else {
            setFileError("")
            setFile(event.target.files[0])        
        }
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

    const generateSchema = () => {
        let payload = {
            "schema": [
                {
                    "col_nm": "institution",
                    "data_type": "String"
                },
                {
                    "col_nm": "country",
                    "data_type": "String"
                },
                {
                    "col_nm": "national_rank",
                    "data_type": "Integer"
                },
                {
                    "col_nm": "institution",
                    "data_type": "String"
                },
                {
                    "col_nm": "country",
                    "data_type": "String"
                },
                {
                    "col_nm": "national_rank",
                    "data_type": "Integer"
                },
                {
                    "col_nm": "institution",
                    "data_type": "String"
                },
                {
                    "col_nm": "country",
                    "data_type": "String"
                },
                {
                    "col_nm": "national_rank",
                    "data_type": "Integer"
                },
                {
                    "col_nm": "institution",
                    "data_type": "String"
                },
                {
                    "col_nm": "country",
                    "data_type": "String"
                },
                {
                    "col_nm": "national_rank",
                    "data_type": "Integer"
                },
                {
                    "col_nm": "institution",
                    "data_type": "String"
                },
                {
                    "col_nm": "country",
                    "data_type": "String"
                } 
            ]
        };

        setSchema(payload.schema);
    }


    function handleSubmit(event) {
        event.preventDefault()
        const url = 'http://localhost:3000/uploadFile';
        const formData = new FormData();
        formData.append('file', file);
        formData.append('fileName', file.name);
        const config = {
            headers: {
                'content-type': 'multipart/form-data',
            },
        };
        axios.post(url, formData, config).then((response) => {
            console.log(response.data);
        });

    }

    const handleMaxCharacter = (type, field, errorField, value, number) => {
        if (value.length <= number) {
            type(field, value);
        }
        setError({
            ...error,
            [errorField]: value.trim().length > 0 && value.trim().length <= number ? false : true
        })
    }
    const getSourceSystemData = () => {
        return defaultInstance.post('/source_system/read?tasktype=read', { "fetch_limit": 'all', "src_config": { "src_sys_id": null } })
            .then(response => {
                if (response.data.responseStatus) {
                    setSourceSysData(response.data.responseBody);
                    return response.data.responseBody;
                } else {
                    setSourceSysData([]);
                    return [];
                }
            })
            .catch(error => {
                setSourceSysData([]);
                console.log("error", error)
            })
    }
    const top100Films = [
        { title: 'institution', dataType: 1994 },
        { title: 'country', year: 1972 },
        { title: 'national_rank', year: 1974 },
        { title: 'The Dark Knight', year: 2008 },
        { title: '12 Angry Men', year: 1957 },
        { title: "Schindler's List", year: 1993 },
        { title: 'Pulp Fiction', year: 1994 },
        { title: 'The Lord of the Rings: The Return of the King', year: 2003 },
        { title: 'The Good, the Bad and the Ugly', year: 1966 },
        { title: 'Fight Club', year: 1999 },
        { title: 'The Lord of the Rings: The Fellowship of the Ring', year: 2001 },
        { title: 'Star Wars: Episode V - The Empire Strikes Back', year: 1980 },
        { title: 'Forrest Gump', year: 1994 },
        { title: 'Inception', year: 2010 },
        { title: 'The Lord of the Rings: The Two Towers', year: 2002 },
        { title: "One Flew Over the Cuckoo's Nest", year: 1975 },
        { title: 'Goodfellas', year: 1990 },
        { title: 'The Matrix', year: 1999 },
        { title: 'Seven Samurai', year: 1954 },
        { title: 'Star Wars: Episode IV - A New Hope', year: 1977 },
        { title: 'City of God', year: 2002 },
        { title: 'Se7en', year: 1995 },
        { title: 'The Silence of the Lambs', year: 1991 },
        { title: "It's a Wonderful Life", year: 1946 },
        { title: 'Life Is Beautiful', year: 1997 },
        { title: 'The Usual Suspects', year: 1995 },
        { title: 'Léon: The Professional', year: 1994 },
        { title: 'Spirited Away', year: 2001 },
        { title: 'Saving Private Ryan', year: 1998 },
        { title: 'Once Upon a Time in the West', year: 1968 },
        { title: 'American History X', year: 1998 },
        { title: 'Interstellar', year: 2014 },
        { title: 'Casablanca', year: 1942 },
        { title: 'City Lights', year: 1931 },
        { title: 'Psycho', year: 1960 },
        { title: 'The Green Mile', year: 1999 },
        { title: 'The Intouchables', year: 2011 },
        { title: 'Modern Times', year: 1936 },
        { title: 'Raiders of the Lost Ark', year: 1981 },
        { title: 'Rear Window', year: 1954 },
        { title: 'The Pianist', year: 2002 },
        { title: 'The Departed', year: 2006 },
        { title: 'Terminator 2: Judgment Day', year: 1991 },
        { title: 'Back to the Future', year: 1985 },
        { title: 'Whiplash', year: 2014 },
        { title: 'Gladiator', year: 2000 },
        { title: 'Memento', year: 2000 },
        { title: 'The Prestige', year: 2006 },
        { title: 'The Lion King', year: 1994 },
        { title: 'Apocalypse Now', year: 1979 },
        { title: 'Alien', year: 1979 },
        { title: 'Sunset Boulevard', year: 1950 },
        { title: 'Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb', year: 1964 },
        { title: 'The Great Dictator', year: 1940 },
        { title: 'Cinema Paradiso', year: 1988 },
        { title: 'The Lives of Others', year: 2006 },
        { title: 'Grave of the Fireflies', year: 1988 },
        { title: 'Paths of Glory', year: 1957 },
        { title: 'Django Unchained', year: 2012 },
        { title: 'The Shining', year: 1980 },
        { title: 'WALL·E', year: 2008 },
        { title: 'American Beauty', year: 1999 },
        { title: 'The Dark Knight Rises', year: 2012 },
        { title: 'Princess Mononoke', year: 1997 },
        { title: 'Aliens', year: 1986 },
        { title: 'Oldboy', year: 2003 },
        { title: 'Once Upon a Time in America', year: 1984 },
        { title: 'Witness for the Prosecution', year: 1957 },
        { title: 'Das Boot', year: 1981 },
        { title: 'Citizen Kane', year: 1941 },
        { title: 'North by Northwest', year: 1959 },
        { title: 'Vertigo', year: 1958 },
        { title: 'Star Wars: Episode VI - Return of the Jedi', year: 1983 },
        { title: 'Reservoir Dogs', year: 1992 },
        { title: 'Braveheart', year: 1995 },
        { title: 'M', year: 1931 },
        { title: 'Requiem for a Dream', year: 2000 },
        { title: 'Amélie', year: 2001 },
        { title: 'A Clockwork Orange', year: 1971 },
        { title: 'Like Stars on Earth', year: 2007 },
        { title: 'Taxi Driver', year: 1976 },
        { title: 'Lawrence of Arabia', year: 1962 },
        { title: 'Double Indemnity', year: 1944 },
        { title: 'Eternal Sunshine of the Spotless Mind', year: 2004 },
        { title: 'Amadeus', year: 1984 },
        { title: 'To Kill a Mockingbird', year: 1962 },
        { title: 'Toy Story 3', year: 2010 },
        { title: 'Logan', year: 2017 },
        { title: 'Full Metal Jacket', year: 1987 },
        { title: 'Dangal', year: 2016 },
    ];
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

    return (
        <>
            <PageTitle style={{ marginTop: '30px' }} showInfo={() => props.openSideBar({ heading: 'Data Asset', content: 'Data Assets are the entries within the framework which holds the properties of individual files coming from the various sources. In other words, they are the metadata of source files. The metadata includes column names, datatypes, security classifications, DQ rules, data obfuscation properties etc.' })}>
                New Data Asset
            </PageTitle>
            <div style={{ display: 'flex' }}>
                <div style={{ width: "50%", marginTop: '30px' }}>
                    {/* Choose Database Panel */}
                    <div className={classes.panel} style={{ marginTop: '20px' }}>
                        <h2 className={classes.boxHeader}>Choose database creation type</h2>
                        <Box className={classes.boxContainer}>
                            <Box className={`${classes.box} ${classes.boxBorder} ${ingestionType === 'easy' ? classes.selectedBox : ''}`}
                                m={1} onClick={() => setIngestionType('easy')}>
                                <h2>
                                    <Radio
                                        checked={ingestionType === 'easy'}
                                        value="easy"
                                        name="radio-button-demo"
                                        inputProps={{ 'aria-label': 'A' }} >
                                    </Radio>
                                    Easy ingestion
                                </h2>
                            </Box>

                            <Box className={`${classes.box} ${classes.boxBorder} ${ingestionType === 'custom' ? classes.selectedBox : ''}`}
                                m={1} onClick={() => setIngestionType('custom')}>
                                <h2>
                                    <Radio
                                        checked={ingestionType === 'custom'}
                                        value="custom"
                                        name="radio-button-demo"
                                        inputProps={{ 'aria-label': 'B' }} />
                                    Custom ingestion
                                </h2>
                            </Box>
                        </Box>
                    </div>

                    {/* Choose File Type panel */}
                    <div className={classes.panel} >
                        <h2 className={classes.boxHeader}>Choose file type</h2>
                        <Box className={classes.boxContainer}>
                            <Box className={`${classes.box} ${classes.boxBorder} ${fileType === 'file' ? classes.selectedBox : ''}`}
                                m={1} onClick={() => {setFileType('file'); setSchema([])}}>
                                <h2>
                                    <Radio
                                        checked={fileType === 'file'}
                                        value="file"
                                        name="radio-button-demo"
                                        inputProps={{ 'aria-label': 'C' }} />
                                    File
                                </h2>
                                {/* <FileCopyTwoToneIcon></FileCopyTwoToneIcon> */}
                            </Box>
                            <Box className={`${classes.box} ${classes.boxBorder} ${fileType === 'database' ? classes.selectedBox : ''}`}
                                m={1} onClick={() => {setFileType('database'); setSchema([])}}>
                                <h2>
                                    <Radio
                                        checked={fileType === 'database'}
                                        value="database"
                                        name="radio-button-demo"
                                        inputProps={{ 'aria-label': 'D' }} />
                                    Database
                                </h2>
                                {/* <StorageTwoToneIcon></StorageTwoToneIcon> */}
                            </Box>
                        </Box>
                    </div>

                    {fileType === 'file' &&
                        <div className={classes.panel}>
                            <Box className={`${classes.formControlRow}`}>
                                <FormControl className={classes.formControl}>
                                    <div style={{ marginBottom: '3%' }}>Source system ID*</div>
                                    <Select
                                        // error={error.sourceSysIDError}
                                        // disabled={props.mode === 'edit'}
                                        margin="dense"
                                        variant="outlined"
                                        id="src_sys_id"
                                        value={srcSystemId}
                                        onChange={(event) => setSrcSystemId(event.target.value)}
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
                                    <div style={{ marginBottom: '3%' }}>Target system ID*</div>
                                    <Select
                                        // error={error.targetIDError}
                                        // disabled={props.mode === 'edit'}
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

                                <FormControl className={classes.formControl}>
                                    <div style={{ marginBottom: '3%' }}>Trigger mechanism*</div>
                                    <Select
                                        margin="dense"
                                        variant="outlined"
                                        id="mechanism"
                                        name="mechanism"
                                        onChange={(event) => handleValueChange(props.ingestionFieldValue, 'trigger_mechanism', 'triggerMechanismError', event.target.value)}
                                    >
                                        <MenuItem value="">
                                            <em>Select mechanism</em>
                                        </MenuItem>
                                        <MenuItem key={'time_driven'} value={'time_driven'} >Time Driven</MenuItem>
                                        {fileType !== 'database' &&
                                            <MenuItem key={'event_driven'} value={'event_driven'} >Event Driven</MenuItem>
                                        }
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
                                    </Tooltip>
                                }
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

                                {/* <FormControl className={classes.formControl}>
                                    <div style={{ marginBottom: '3%' }}>Load type*</div>
                                    <Select
                                        margin="dense"
                                        variant="outlined"
                                        id="type"
                                        name="type"
                                        onChange={(event) => handleValueChange(props.ingestionFieldValue, 'ext_method', 'extMethodError', event.target.value)}
                                    >
                                        <MenuItem value="">
                                            <em> Select Load Type</em>
                                        </MenuItem>
                                        <MenuItem key={'insert'} value={'insert'} >Insert</MenuItem>
                                        <MenuItem key={'upsert'} value={'upsert'} >Upsert</MenuItem>
                                    </Select>
                                </FormControl> */}

                            </Box>
                            <Box className={classes.formControlRow} style={{ paddingTop: '0' }}>
                                <div style={{textAlign: 'center', width: '100%'}}>
                                    <Button className={classes.button} style={{ width: '120px', marginRight: '20px' }} disabled={disableButton}>
                                        <label style={{ width: '100%' }} for="fileUpload">Choose file</label>
                                        <input type="file" id="fileUpload" accept=".csv,.orc,.xml,.parquet" onChange={handleFileUploadChange} style={{ display: 'none' }} />
                                    </Button>
                                    <Button className={classes.button} style={{ width: '170px' }} disabled={file == null}
                                        onClick={generateSchema}>Generate schema</Button>
                                </div>                                
                                <Box style={{textAlign: 'center', marginTop: '15px', width: '100%'}}>{file?.name}</Box>
                                <Box style={{textAlign: 'center', color: 'red', marginTop: '15px', width: '100%'}}>{fileError}</Box>                                
                            </Box>
                        </div>
                    }

                    {fileType === 'database' &&
                        <div className={classes.space}>
                            <div className={classes.panel}>
                                <Box className={`${classes.formControlRow}`}>
                                    <FormControl className={classes.formControl}>
                                        <div style={{ marginBottom: '3%' }}>Source system ID*</div>
                                        <Select
                                            // error={error.sourceSysIDError}
                                            // disabled={props.mode === 'edit'}
                                            margin="dense"
                                            variant="outlined"
                                            id="src_sys_id"
                                            value={srcSystemId}
                                            onChange={(event) => setSrcSystemId(event.target.value)}
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
                                        <div style={{ marginBottom: '3%' }}>Target system ID*</div>
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

                                    <FormControl className={classes.formControl}>
                                        <div style={{ marginBottom: '3%' }}>Extraction type*</div>
                                        <Select
                                            margin="dense"
                                            variant="outlined"
                                            id="type"
                                            name="type"
                                            onChange={(event) => handleValueChange(props.ingestionFieldValue, 'ext_method', 'extMethodError', event.target.value)}
                                        >
                                            <MenuItem value="">
                                                <em>Select Extraction Type</em>
                                            </MenuItem>
                                            <MenuItem key={'full'} value={'full'} >Full</MenuItem>
                                            <MenuItem key={'cdc'} value={'cdc'} >Cdc</MenuItem>
                                            {dbType !== 'database' &&
                                                <MenuItem key={'incremental'} value={'incremental'} >Incremental</MenuItem>
                                            }
                                        </Select>
                                    </FormControl>
                                    <FormControl className={classes.formControl}>
                                        <div style={{ marginBottom: '3%' }}>Table name*</div>
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
                                                <em>Select table</em>
                                            </MenuItem>
                                            {/* {FILE_TYPE.map(item => {
                                            return <MenuItem key={item.value} value={item.value} >{item.name}</MenuItem>
                                        })} */}
                                        </Select>
                                    </FormControl>

                                    <FormControl className={classes.formControl}>
                                        <Button className={classes.button} style={{ width: "170px" }} onClick={generateSchema}>Generate schema</Button>
                                    </FormControl>
                                </Box>
                            </div>
                        </div>
                    }
                    { schema?.length > 0 && <div className={classes.space}>
                        <div className={classes.panel}>
                            <Box className={`${classes.formControlRow}`}>
                                <FormControl className={classes.formControl}>
                                    <div style={{ marginBottom: '3%' }}>Partition column*</div>
                                    <Select
                                        margin="dense"
                                        variant="outlined"
                                        id="partition_column"
                                    >
                                        <MenuItem value="">
                                            <em>Select column</em>
                                        </MenuItem>
                                        {["institution", "country", "national_rank"].map(item => {
                                            return <MenuItem key={item} value={item}>{item}</MenuItem>
                                        })}
                                    </Select>
                                </FormControl>

                                <FormControl className={classes.formControl}>
                                    <div style={{ marginBottom: '3%' }}>Load type*</div>
                                    <Select
                                        margin="dense"
                                        variant="outlined"
                                        id="type"
                                        name="type"
                                        onChange={(event) => handleValueChange(props.ingestionFieldValue, 'ext_method', 'extMethodError', event.target.value)}
                                    >
                                        <MenuItem value="">
                                            <em> Select Load Type</em>
                                        </MenuItem>
                                        <MenuItem key={'insert'} value={'insert'} >Insert</MenuItem>
                                        <MenuItem key={'upsert'} value={'upsert'} >Upsert</MenuItem>
                                    </Select>
                                </FormControl>
                                <FormControl className={classes.formControl}>
                                    <div className={classes.root} style={{marginTop:"15px"}}>
                                    <Autocomplete
                                        multiple
                                        id="tags-outlined"
                                        options={top100Films}
                                        // size="small"
                                        getOptionLabel={(option) => option.title}
                                        defaultValue={[top100Films[13]]}
                                        filterSelectedOptions
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                variant="outlined"
                                                label="Update Keys*"
                                                placeholder="Keys"
                                            />
                                        )}
                                    />
                                    </div>
                                   
                                </FormControl>
                            </Box>
                        </div>
                    </div>
                    }                    
                </div>
                {schema?.length > 0 && <div style={{ width: "50%", marginTop: '50px', marginLeft: '30px', background: 'white' }} className={classes.panel}>
                    <h2 className={classes.boxHeader}>Schema Type</h2>
                    <div className={classes.schemaTable}>
                        {/* <div className={classes.schemaTableHead}>
                            <div>
                                <TextField
                                    label="Column Name"
                                    defaultValue="Hello World"
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    variant="outlined"
                                />
                            </div>
                            <div>
                                <TextField
                                    id="outlined-read-only-input"
                                    label="Data Type"
                                    defaultValue="Hello World"
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    variant="outlined"
                                />
                            </div>
                        </div> */}

                        {schema.map(s => {
                            return <div className={classes.schemaTableRow}>
                                <div>
                                    <TextField
                                        label="Column Name"
                                        defaultValue={s.col_nm}
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                        variant="outlined"
                                    />
                                </div>
                                <div>
                                    <TextField
                                        id="outlined-read-only-input"
                                        label="Data Type"
                                        defaultValue={s.data_type}
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                        variant="outlined"
                                    />
                                </div>
                            </div>
                        })}
                    </div>
                </div>
                }
            </div>
        </>
    )
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
    updateMode,
    updateDataFlag,
    dataAssetFieldValue,
    resetDataAssetValues,
    updateAllDataAssetValues,
    assetFieldValue,
    ingestionFieldValue,
    openSideBar,
    dqRulesFieldValue,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(CreateDataAssetNew);