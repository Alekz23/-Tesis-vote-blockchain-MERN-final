import React, { useEffect } from 'react';

import { Routes, Route, BrowserRouter } from 'react-router-dom';

import { PrivateRoute } from './PrivateRoute';
import { PublicRoute } from './PublicRoute';

import { LoginScreen } from '../components/auth/LoginScreen';
import { DashboardRoutes } from './DashboardRoutes';
import { useDispatch, useSelector } from 'react-redux';
import { DashboardUser } from './DashboardUser';
import { startChecking } from '../actions/auth';
//import { startChecking } from '../actions/auth';



export const AppRouter = () => {


    const { auth } = useSelector(state => state);
    // const dispatch = useDispatch();

    // useEffect(() => {
    //     dispatch(startChecking())
    // },[dispatch])

    // console.log(auth.checking);
    // console.log(auth.rol);



  
    // if(auth.checking){
    //     return <h1>Espere...</h1>
    // }


    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={
                    <PublicRoute>
                        <LoginScreen />
                    </PublicRoute>
                }
                />
                <Route path="/*" element={
                    <PrivateRoute>
                        {(auth?.rol === "ADMIN_ROLE") ?
                            <DashboardRoutes />
                            : <DashboardUser />
                        }
                    </PrivateRoute>
                }
                />

            </Routes>
        </BrowserRouter>
    )
}
