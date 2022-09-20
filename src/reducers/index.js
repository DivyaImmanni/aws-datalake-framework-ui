import dataAssetsReducer from "reducers/dataAssetsReducer";
import lakeDestinationsReducer from "reducers/lakeDestinationsReducer";
import notificationReducer from "reducers/notificationReducer";
import sourceSystemsReducer from "reducers/sourceSystemsReducer";
import { combineReducers } from "redux";
import authenticationReducer from "./authenticationReducer";

export default function rootReducer(history){
    const rootReducer = combineReducers({
        notificationState: notificationReducer,
        authenticationState: authenticationReducer,
        sourceSystemState: sourceSystemsReducer,
        dataAssetState: dataAssetsReducer,
        lakeDestinationState: lakeDestinationsReducer
    })
    return rootReducer;
};