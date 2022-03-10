import React  from 'react';
import { useSelector } from 'react-redux';

import { Navigate } from 'react-router-dom';
import { DashboardPublic } from './DashboardPublic';





export const PublicRoute = ({ children }) => {

   
    const {uid} = useSelector( state => state.auth);

    return (!!uid)
        ? <Navigate to="/" />
        :  <DashboardPublic/>
        // :  <DashboardPublic/>
}
