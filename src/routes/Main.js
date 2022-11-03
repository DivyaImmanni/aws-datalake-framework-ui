import Dashboard from 'components/Dashboard';
import DataAssets from 'components/DataAssets';
import CreateDataAsset from 'components/DataAssets/CreateDataAsset';
import DataAssetDetails from 'components/DataAssets/DataAssetDetails';
import DataCatalogDetails from 'components/DataAssets/DataCatalogDetails';
import LakeDestination from 'components/LakeDestination';
import CreateLakeDestination from 'components/LakeDestination/CreateLakeDestination';
import SourceSystems from 'components/SourceSystems';
import CreateSourceSystem from 'components/SourceSystems/CreateSourceSystem';
import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Test from './../components/Test/Test';


const Page = props =>(
    <Routes>
        <Route exact path="/" element={<Dashboard/>}/>
        <Route path="/source-systems" element={<SourceSystems/>}/>
        <Route path="/source-systems/create" element={<CreateSourceSystem/>}/>
        <Route path="/source-systems/edit" element={<CreateSourceSystem/>}/>
        <Route path="/data-assets" element={<DataAssets/>}/>
        <Route path="/data-assets/create" element={<CreateDataAsset/>}/>
        <Route path="/data-assets/edit" element={<CreateDataAsset/>}/>
        <Route path="/data-assets/details/:src_sys_id" element={<DataAssetDetails/>}/>
        <Route path="/data-assets/delete/:src_sys_id" element={<DataAssetDetails/>}/>
        <Route path="/data-assets/catalog-details" element={<DataCatalogDetails/>}/>
        <Route path="/lake-destinations" element={<LakeDestination/>}/>
        <Route path="/lake-destinations/create" element={<CreateLakeDestination/>}/>
        <Route path="/lake-destinations/edit" element={<CreateLakeDestination/>}/>
        <Route path="/collections" element={<Test title={'Collections'}/>}/>
        <Route path="/asim-rules" element={<Test title={'ASIM Rules'}/>}/>
        <Route path="/db-connectors" element={<Test title={'DB Connectors'}/>}/>

        <Route path="/pipelines">
            <Route  path="" element={<Test title={'Pipelines'}/>}/>
            <Route index path="pipelines" element={<Test title={'Pipelines'}/>}/>
            <Route path="execution" element={<Test title={'Pipelines Execution'}/>}/>
        </Route>

        <Route path="/audit">
            <Route index path="" element={<Test title={'DQ Results'}/>}/>
            <Route path="dq-results" element={<Test title={'DQ Results'}/>}/>
            <Route path="reports" element={<Test title={'Reports and Dashboard'}/>}/>
        </Route>

        <Route path="/deployment" element={<Test title={'Deployment'}/>}/>        

        <Route path="*" element={<Navigate to="/" />}/>
    </Routes>
)

const Main = (props) => {
    return (
        <div style={props.style}>
            <Page />
        </div>
    )
}

export default Main;