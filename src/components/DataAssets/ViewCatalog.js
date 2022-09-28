import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import Close from '@material-ui/icons/Close';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { bindActionCreators } from 'redux';

const useStyles = makeStyles((theme) => ({
  dialogCustomizedWidth: {
    'max-width': '65%'
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: '28%',
    margin: 15,
    fontSize: 14,
    wordBreak: 'break-word',
    maxWidth: '28%'
  },
  button: {
    float: 'right',
    margin: '1vh',
    color: 'white',
    minWidth: '7%',
    marginTop: '12px',
  },
}));

const ViewCatalog = (props) => {
  const classes = useStyles();
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <Dialog open="true" fullWidth classes={{ paperFullWidth: classes.dialogCustomizedWidth }}>
      <DialogTitle >
        {props.fieldValues.exec_id ? <div >Execution ID : <span style={{ fontWeight: 'bold' }}> {props.fieldValues.exec_id}</span></div> : ''}
        <Tooltip title="close">
          <Close style={{ position: 'absolute', top: 24, right: 17, cursor: 'pointer', color: '#F7901D' }} onClick={() => props.setOpen(false)} />
        </Tooltip>
      </DialogTitle>
      <DialogContent>
        <Tabs>
          <TabList style={{ display: 'flex', margin: 0, border: 'none' }}>
            <Tab style={{
              fontWeight: tabIndex === 0 ? 'bold' : '',
              border: 'none',
              borderBottom: tabIndex === 0 ? '5px solid #F7901D' : ''
            }} onClick={() => setTabIndex(0)}><span>Execution Information</span></Tab>
          </TabList>
          <TabPanel style={{paddingBottom:'3%' }}>
            <div style={{ border: '1px solid #CBCBCB'}}>
              <div style={{ marginLeft: '3%', paddingTop: 10 }}>
                <FormControl className={classes.formControl}>
                  <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                    Execution ID
                  </div>
                  <div>{props.fieldValues.exec_id}</div>
                </FormControl>
                <FormControl className={classes.formControl}>
                  <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                    Source System ID
                  </div>
                  <div>{props.fieldValues.src_sys_id}</div>
                </FormControl>
                <FormControl className={classes.formControl}>
                  <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                    Asset ID
                  </div>
                  <div>{props.fieldValues.asset_id}</div>
                </FormControl>
                <FormControl className={classes.formControl}>
                  <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                    DQ Indicator
                  </div>
                  <div>{props.fieldValues.dq_validation}</div>
                </FormControl>
                <FormControl className={classes.formControl}>
                  <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                    Masking Indicator
                  </div>
                  <div>{props.fieldValues.data_masking}</div>
                </FormControl>
                <FormControl className={classes.formControl}>
                  <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                    Publish Indicator
                  </div>
                  <div>{props.fieldValues.data_publish}</div>
                </FormControl>
                <FormControl className={classes.formControl}>
                  <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                    DQ Execution ID
                  </div>
                  <div>{props.fieldValues.dq_validation_exec_id}</div>
                </FormControl>
                <FormControl className={classes.formControl}>
                  <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                    Masking Execution ID
                  </div>
                  <div>{props.fieldValues.data_masking_exec_id}</div>
                </FormControl>
                <FormControl className={classes.formControl}>
                  <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                    Publish Execution ID
                  </div>
                  <div>{props.fieldValues.data_publish_exec_id}</div>
                </FormControl>
                <FormControl className={classes.formControl}>
                  <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                    Source File Path
                  </div>
                  <div>{props.fieldValues.src_file_path}</div>
                </FormControl>
                <FormControl className={classes.formControl}>
                  <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                    Log path
                  </div>
                  <div>{props.fieldValues.s3_log_path}</div>
                </FormControl>
                <FormControl className={classes.formControl}>
                  <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                    Target File Path
                  </div>
                  <div>{props.fieldValues.tgt_file_path}</div>
                </FormControl>
              </div>
            </div>
          </TabPanel>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

const mapStateToProps = state => ({

})
const mapDispatchToProps = dispatch => bindActionCreators({
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(ViewCatalog);