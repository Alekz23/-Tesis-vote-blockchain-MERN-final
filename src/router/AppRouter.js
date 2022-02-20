import React, { useEffect } from 'react';

import { Routes, Route, BrowserRouter } from 'react-router-dom';

import { PrivateRoute } from './PrivateRoute';
import { PublicRoute } from './PublicRoute';

import { LoginScreen } from '../components/auth/LoginScreen';
import { DashboardRoutes } from './DashboardRoutes';
import { useSelector } from 'react-redux';
import { DashboardUser } from './DashboardUser';
import { startChecking } from '../actions/auth';
import { useDispatch } from 'react-redux';



export const AppRouter = () => {

   
    const { auth} = useSelector( state => state);

 
    return (
        <BrowserRouter>
          
            <Routes>
                <Route path="/login" element={
                    <PublicRoute>
                        <LoginScreen/>
                    </PublicRoute>
                } 
                />
                

                <Route path="/*" element={ 
                        <PrivateRoute>
                            {(auth?.rol === "ADMIN_ROLE") ?
                               <DashboardRoutes/>
                               : <DashboardUser/>
                        } 
                        </PrivateRoute>
                    } 
                />

            </Routes>
        </BrowserRouter>
    )
}
