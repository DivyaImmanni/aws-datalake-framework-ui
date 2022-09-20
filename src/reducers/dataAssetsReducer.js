import * as Constants from 'components/Constants/Constants';
import { combineReducers } from "redux";

const initialDataAttributes = {
    "asset_id": "",
    "src_sys_id": "",
    "target_id": "",
    "file_header": "", //default true
    "multipartition": "", //default false
    "file_type": "",
    "asset_nm": "",
    "trigger_file_pattern": null,
    "file_delim": "", //default ,
    "file_encryption_ind": false, //default false
    "asset_owner": "",
    "support_cntct": "",
    "derived_schema": false,
    "rs_load_ind": "", //default false
}
const initialIngestionAttributes = {
    "src_table_name": "",
    "src_sql_query": "",
    "ingstn_src_path": "",
    "trigger_mechanism": "",
    "frequency": "",
    "ext_method": "full",
    "ext_col": "",
}
const initialColumnAttributes = [{
    "col_id": 1,
    "col_nm": "",
    "tgt_col_nm": "",
    "tgt_data_type": "",
    "tgt_datetime_format": "",
    "col_desc": "",
    "data_classification": "",
    "col_length": 0,
    "req_tokenization": false,
    "pk_ind": false,
    "data_type": "",
    "datetime_format": "",
    "null_ind": false
}]

const dialogue = (state = { flag: false }, action) => {
    switch (action.type) {
        case Constants.OPEN_DA_DIALOGUE:
            return {
                ...state, flag: true
            }
        case Constants.CLOSE_DA_DIALOGUE:
            return {
                ...state, flag: false
            }
        default:
            return { ...state }
    }
}

const updateDataFlag = (state = { dataFlag: true }, action) => {
    switch (action.type) {
        case Constants.UPDATE_DA_TABLE_FLAG:
            return {
                ...state, dataFlag: action.flag
            }
        default:
            return { ...state }
    }
}

const updateMode = (state = { mode: '' }, action) => {
    switch (action.type) {
        case Constants.UPDATE_DA_MODE:
            return { ...state, mode: action.mode }
        default:
            return { ...state }
    }
}

const updateDataAssetTableData = (state = { data: [] }, action) => {
    switch (action.type) {
        case Constants.UPDATE_DA_TABLE_DATA:
            return { ...state, data: action.data }
        default:
            return { ...state }
    }
}

const columnAttributeError = (state = {data: {}}, action) => {
    switch (action.type) {
        case Constants.COLUMN_ATTRIBUTES_DATA_ERROR:
            return { ...state, data: action.payload }
        default:
            return { ...state }
    }
}

const dataAssetValues = (state = { "asset_info": initialDataAttributes, "ingestion_attributes": initialIngestionAttributes, "asset_attributes": initialColumnAttributes, "adv_dq_rules": [] }, action) => {
    switch (action.type) {
        case Constants.UPDATE_ASSET_INFO_FIELD_VALUE:
            return { ...state, "asset_info": { ...state.asset_info, [action.payload.field]: action.payload.value } };
        case Constants.UPDATE_INGESTION_FIELD_VALUES:
            return { ...state, "ingestion_attributes": { ...state.ingestion_attributes, [action.payload.field]: action.payload.value } }
        case Constants.UPDATE_COLUMN_ATTRIBUTES_DATA:
            return { ...state, "asset_attributes": [...action.payload] }
        case Constants.UPDATE_DQ_RULES_FIELD:
            return { ...state, "adv_dq_rules": [...action.payload] }
        case Constants.UPDATE_ALL_DATA_ASSET_FIELD_VALUES:
            return { ...action.row }
        case Constants.RESET_DATA_ASSET_FIELD_VALUES:
            return { "asset_info": initialDataAttributes, "ingestion_attributes": initialIngestionAttributes, "asset_attributes": initialColumnAttributes, "adv_dq_rules": [] };
        default:
            return { ...state }
    }
}

const updateSelectedRow = (state = {}, action) => {
    switch (action.type) {
        case Constants.UPDATE_SELECTED_ROW:
            return {
                ...action.row
            }
        default:
            return { ...state }
    }
}

const dataAssetsReducer = combineReducers({
    dialogue,
    updateMode,
    dataAssetValues,
    updateDataFlag,
    updateDataAssetTableData,
    updateSelectedRow,
    columnAttributeError
})

export default dataAssetsReducer;