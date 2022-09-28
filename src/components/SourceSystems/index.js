import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { openSideBar, openSnackbar } from 'actions/notificationAction';
import { closeSourceSystemDialog, openSourceSystemDialog, resetSourceSystemValues, updateAllSourceSystemValues, updateDataFlag, updateMode, updateSourceSysTableData } from 'actions/sourceSystemsAction';
import PageTitle from 'components/Common/PageTitle';
import SearchBar from 'components/Common/SearchBar';
import tableIcons from "components/MetaData/MaterialTableIcons";
import ViewSourceSystem from 'components/SourceSystems/ViewSourceSystem';
import clone from 'images/clone.png';
import edit from 'images/edit.png';
import remove from 'images/Remove.png';
import show from 'images/Show.png';
import MaterialTable from "material-table";
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import defaultInstance from 'routes/defaultInstance';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  customWidth: {
    maxWidth: '1060px'
  },
  table: {
    margin: '2% 3%',
    "& .MuiBox-root+div": {
      width: '100%',
    },
    "& .MuiInput-underline:before": {
      borderBottom: 'none'
    },
    "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
      borderBottom: 'none'
    },
    "& .MuiInput-underline:after": {
      borderBottom: 'none'
    },
  },
  idHeader:{
    color: '#00B1E8',
    cursor: 'pointer',
    paddingLeft: '5%',
    '&:hover': {
      color: '#ff8700',
    },
  },
  toolbar: {
    "display": "flex",
    "width": "100%",
    "justifyContent": "space-between",
    "alignItems": "center",
    "padding": "15px 30px 7px"
  },
  button: {
    float: 'right',
    margin: '2vh',
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

const SourceSystems = (props) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [selectedRow, setSelectedRow] = ([]);
  const [filteredList, setFilteredList] = useState(props.data);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (props.dataFlag) {
      setLoading(true);
      // axios.post('http://localhost:8000/source_system', { "fetch_limit": 'all', "src_config": { "src_sys_id": null } })
      defaultInstance.post('/source_system/read?tasktype=read', { "fetch_limit": 'all', "src_config": { "src_sys_id": null } })
        .then(response => {
          if (response.data.responseStatus) {
            props.updateSourceSysTableData(response.data.responseBody);
            // props.openSnackbar({ variant: 'success', message: `${response.data.responseMessage}` });
          } else {
            //  props.openSnackbar({ variant: 'error', message: `${response.data.responseMessage}` });
          }
          setLoading(false);
        })
        .catch(error => {
          setLoading(false);
          console.log("error", error);
          props.updateSourceSysTableData([]);
          //  props.openSnackbar({ variant: 'error', message: `Failed to load the source system data!` });
        })
    }
  }, [props.dataFlag])

  const columns = [
    {
      title: "Source System ID", field: "src_sys_id", render: (rowData) => {
        return <span className={classes.idHeader} onClick={() => handleAction('view', rowData)}>{rowData.src_sys_id}</span>
      }
    },
    { title: "Source System Name", field: "src_sys_nm", },
    { title: "Bucket Name", field: "bucket_name", },
  ];

  const handleCreate = () => {
    props.updateDataFlag(false);
    props.updateMode('create');
    props.resetSourceSystemValues();
  }

  const handleEdit = (selectedRow) => {
    props.updateDataFlag(false);
    props.updateMode('edit');
    props.updateAllSourceSystemValues({ ...selectedRow })
    navigate("./edit")
  }

  const handleClone = (selectedRow) => {
    props.updateDataFlag(false);
    props.updateMode('clone');
    props.updateAllSourceSystemValues({ ...selectedRow })
    navigate("./create")
  }

  const handleAction = (mode, selectedRow) => {
    props.updateDataFlag(false);
    props.updateMode(mode);
    props.openSourceSystemDialog();
    props.updateAllSourceSystemValues({ ...selectedRow })
  }

  return (
    <>
      <ViewSourceSystem selectedRow={selectedRow} />
      <div className={classes.table}>
        <PageTitle showInfo={() => props.openSideBar({heading: 'Source System', content: 'Source Systems are individual entities which are registered with the framework aligned with systems which owns one or more data assets. It could be a database, a vendor, social media websites, streaming sources etc.'})}>Source System</PageTitle>
        {/* <LinearProgress hidden={!loading} color="secondary" />  */}
        <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '25px'}}>
          <SearchBar data={props.data} onChange={(d) => { setFilteredList(d) }}></SearchBar>
          <Link to="./create" >
              <Button variant="contained" className={classes.button}  style={{marginTop: '7px'}} onClick={() => handleCreate()}>Add New +</Button>
          </Link>
        </div>

        <MaterialTable
          icons={tableIcons}
          title="Source Systems"
          columns={columns}
          data={filteredList}
          actions={[
            {
              icon: () => <img src={show} alt="view" style={{ maxWidth: '70%' }} />,
              tooltip: 'View',
              position: 'row', // 'auto' | 'toolbar' | 'toolbarOnSelect' | 'row'
              onClick: (event, rowData) => {
                handleAction('view', rowData)
              }
            },
            {
              icon: () => <img src={edit} alt="edit" style={{ maxWidth: '70%' }} />,
              tooltip: 'Edit',
              position: 'row',
              onClick: (event, rowData) => {
                handleEdit(rowData);
              }
            },
            {
              icon: () => <img src={clone} alt="clone" style={{ maxWidth: '70%' }} />,
              tooltip: 'Clone',
              position: 'row',
              onClick: (event, rowData) => {
                handleClone(rowData);
              }
            },
            {
              icon: () => <img src={remove} alt="delete" style={{ maxWidth: '70%' }} />,
              tooltip: 'Delete',
              position: 'row',
              onClick: (event, rowData) => {
                handleAction('delete', rowData)
              }
            }
          ]}
          isLoading={loading}
          options={{
            //selection: true,
            // showTextRowsSelected: false,
            toolbar: false,
            paging: false,
            search: false,
            searchFieldAlignment: 'left',
            showTitle: false,
            draggable: false,
            actionsColumnIndex: -1,
            // toolbarButtonAlignment: "left",
            searchFieldStyle: {
              backgroundColor: '#FFF',
              color: 'black',
              padding: '0.3rem 0.75rem',
              margin: '1.25rem 0',
              boxShadow: '2px 2px 4px 1px #ccc',
              "& svg.MuiSvgIconRoot": {
                fontSize: '1.75rem',
                color: '#707070'
              }
            },
            sorting: true,
            headerStyle: {
              position: 'sticky',
              top: 0,
              backgroundColor: '#F5F5F5',
              fontWeight: 'bold',
              // padding: '0',
              textAlign: 'left'
            },
            // cellStyle: { padding: '5px 0' },
            actionsCellStyle: {
              minWidth: '200px',
              textAlign: 'left'
            }
          }}
        />
      </div>
    </>
  );
}

const mapStateToProps = state => ({
  open: state.sourceSystemState.dialog.dialogFlag,
  fieldValues: state.sourceSystemState.sourceSystemValues,
  mode: state.sourceSystemState.updateMode.mode,
  data: state.sourceSystemState.updateSourceSysTableData.data,
  dataFlag: state.sourceSystemState.updateDataFlag.dataFlag

})
const mapDispatchToProps = dispatch => bindActionCreators({
  openSourceSystemDialog,
  closeSourceSystemDialog,
  updateMode,
  updateDataFlag,
  updateAllSourceSystemValues,
  resetSourceSystemValues,
  updateSourceSysTableData,
  openSnackbar,
  openSideBar
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(SourceSystems);