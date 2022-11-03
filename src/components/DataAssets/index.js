import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import LaunchIcon from '@material-ui/icons/Launch';
import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined';
import { closeDataAssetDialogue, openDataAssetDialogue, resetDataAssetValues, updateAllDataAssetValues, updateDataAssetTableData, updateMode, updateSelectedRow } from 'actions/dataAssetActions';
import { openSideBar, openSnackbar } from 'actions/notificationAction';
import Fab from '@material-ui/core/Fab';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import VisibilityIcon from '@material-ui/icons/Visibility';
import PageTitle from 'components/Common/PageTitle';
import SearchBar from 'components/Common/SearchBar';
import tableIcons from "components/MetaData/MaterialTableIcons";
import MaterialTable from "material-table";
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import defaultInstance from 'routes/defaultInstance';

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
    margin: '15px',
    backgroundColor: 'black',
    color: '#F7901D',
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

const DataAssets = (props) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [backdrop, setBackdrop] = useState(false);
  const [filteredList, setFilteredList] = useState(props.data);
  const [data, setData] = useState([]);

  useEffect(() => {
    setBackdrop(true);
    defaultInstance.post('/data_asset_info/read', { "src_sys_id": null })
      .then(response => {
        setData(response.data.responseBody);
        setBackdrop(false);
      })
      .catch(error => {
        console.log("error", error)
        setData([]);
        setBackdrop(false);
      })
  }, [])


  const columns = [
    {
      title: "Data Asset ID", field: "asset_id", render: (rowData) => {
        return <span className={classes.idHeader} onClick={() => { handleActionClick(rowData, 'view') }}>{rowData.asset_id}</span>
      }
    },
    { title: "Source System ID", field: "src_sys_id", },
    { title: "Data Asset Name", field: "asset_nm", },
    { title: "Target System ID", field: "target_id", },
    { title: "Asset Owner", field: "asset_owner", },
    // {
    //   title: "Actions", field: "", render: (rowData) => {
    //     return <div style={{minWidth: '200px'}}>
    //       <Tooltip placement='top' title="View">
    //         <VisibilityOutlinedIcon onClick={() => { handleActionClick(rowData, 'view') }} style={{ color: '#666', fontSize: '18px', margin: '0 0 1px 0px', cursor: 'pointer' }}></VisibilityOutlinedIcon>
    //       </Tooltip>
    //       <Tooltip placement='top' title="Edit">
    //         <EditOutlinedIcon onClick={() => handleActionClick(rowData, 'edit')} style={{ color: '#666', fontSize: '18px', margin: '0 0 1px 15px', cursor: 'pointer' }}></EditOutlinedIcon >
    //       </Tooltip>
    //       <Tooltip placement='top' title="Clone">
    //         <FileCopyOutlinedIcon onClick={() => handleActionClick(rowData, 'clone')} style={{ color: '#666', fontSize: '18px', margin: '0 0 1px 15px', cursor: 'pointer' }}></FileCopyOutlinedIcon>
    //       </Tooltip>
    //       <Tooltip placement='top' title="Delete">
    //         <DeleteOutlineOutlinedIcon onClick={() => handleActionClick(rowData, 'delete')} style={{ color: '#666', fontSize: '18px', margin: '0 0 1px 15px', cursor: 'pointer' }}></DeleteOutlineOutlinedIcon>
    //       </Tooltip>
    //       <Tooltip placement='top' title="Catalogs">
    //         <LaunchIcon onClick={() => handleUrlClick(rowData)} style={{ color: '#666', fontSize: '18px', margin: '0 0 1px 15px', cursor: 'pointer' }}></LaunchIcon>
    //       </Tooltip>
    //     </div>
    //   }
    // },
  ];

  const handleUrlClick = (rowData) => {
    props.updateSelectedRow(rowData);
    window.open(`/data-assets/catalog-details?src_sys_id=${rowData.src_sys_id}&asset_id=${rowData.asset_id}`, '_blank', 'noopener,noreferrer');
  }

  const handleCreate = () => {
    props.updateMode('create');
    props.resetDataAssetValues();
  }

  const handleActionClick = (selectedRow, mode) => {
    props.resetDataAssetValues();
    props.updateMode(mode);
    props.updateSelectedRow({...selectedRow});
    switch (mode) {
      case 'view':
        navigate(`/data-assets/details/${selectedRow.src_sys_id}`);
        break;
      case 'delete':
        navigate(`/data-assets/delete/${selectedRow.src_sys_id}`);
        break;
      case 'clone':
        navigate("/data-assets/create");
        break;
      case 'edit':
        navigate("/data-assets/edit");
        break;
      default:
    }
  }

  return (
    <>
      <div className={classes.table}>
        <PageTitle showInfo={() => props.openSideBar({ heading: 'Data Assets', content: 'Data Assets are the entries within the framework which holds the properties of individual files coming from the various sources. In other words, they are the metadata of source files. The metadata includes column names, datatypes, security classifications, DQ rules, data obfuscation properties etc.' })}>
          Data Assets
        </PageTitle>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '25px' }}>
          <SearchBar data={data} onChange={(d) => { setFilteredList(d) }}></SearchBar>
          <Link to="/data-assets/create" >
            <Button variant="contained" className={classes.button}  style={{marginTop: '7px'}} onClick={() => handleCreate()}>Add New +</Button>
          </Link>
        </div>
        <MaterialTable
          isLoading={backdrop}
          icons={tableIcons}
          title="Data Assets"
          columns={columns}
          data={filteredList}
          actions={[
            {
              icon: () => <Fab size='small' ><VisibilityIcon style={{ color: '#666', fontSize: '18px', margin: '0 0 1px 0px', cursor: 'pointer' }}></VisibilityIcon></Fab>,
              tooltip: 'View',
              position: 'row', // 'auto' | 'toolbar' | 'toolbarOnSelect' | 'row'
              onClick: (event, rowData) => {
                console.log("view data", rowData)
                handleActionClick(rowData, 'view')
              }
            },
            {
              icon: () => <Fab size='small'><EditIcon style={{ color: '#666', fontSize: '18px', margin: '0 0 1px 0px', cursor: 'pointer' }}></EditIcon ></Fab>,
              tooltip: 'Edit',
              position: 'row',
              onClick: (event, rowData) => {
                handleActionClick(rowData, 'edit');
              }
            },
            {

              icon: () => <Fab size='small'><FileCopyOutlinedIcon style={{ color: '#666', fontSize: '18px', margin: '0 0 1px 0px', cursor: 'pointer' }}></FileCopyOutlinedIcon></Fab>,
              tooltip: 'Clone',
              position: 'row',
              onClick: (event, rowData) => {
                handleActionClick(rowData, 'clone');
              }
            },
            {

              icon: () => <Fab size='small'><DeleteIcon style={{ color: '#666', fontSize: '18px', margin: '0 0 1px 0px', cursor: 'pointer' }}></DeleteIcon></Fab>,
              tooltip: 'Delete',
              position: 'row',
              onClick: (event, rowData) => {
                handleActionClick(rowData, 'delete')
              }
            },
            {
              icon: () =><Fab size='small'>
                <LaunchIcon style={{ color: '#666', fontSize: '18px', margin: '0 0 1px 0px', cursor: 'pointer' }}></LaunchIcon></Fab>,

              tooltip: 'Catalogs',
              position: 'row',
              onClick: (event, rowData) => {
                handleUrlClick(rowData)
              }
            },

          ]}
          options={{
            paging: false,
            toolbar: false,
            search: false,
            searchFieldAlignment: 'left',
            showTitle: false,
            draggable: false,
            actionsColumnIndex: -1,
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
              textAlign: 'left'
            },
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
  open: state.dataAssetState.dialogue.flag,
  fieldValues: state.dataAssetState.dataAssetValues,
  mode: state.dataAssetState.updateMode.mode,
  dataFlag: state.dataAssetState.updateDataFlag.dataFlag,
})
const mapDispatchToProps = dispatch => bindActionCreators({
  openDataAssetDialogue,
  closeDataAssetDialogue,
  updateMode,
  updateAllDataAssetValues,
  resetDataAssetValues,
  updateDataAssetTableData,
  updateSelectedRow,
  openSnackbar,
  openSideBar
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(DataAssets);