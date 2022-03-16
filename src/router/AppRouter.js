import React from 'react';

import { Routes, Route, BrowserRouter } from 'react-router-dom';

import { PrivateRoute } from './PrivateRoute';
import { PublicRoute } from './PublicRoute';

import { DashboardRoutes } from './DashboardRoutes';
import { useSelector } from 'react-redux';
import { DashboardUser } from './DashboardUser';

import { DashboardPublic } from './DashboardPublic';
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
                         {/* <LoginScreen /> */}
                        {/* <ResultsScreen/>  */}
                        <DashboardPublic></DashboardPublic>
                    </PublicRoute>
                }
                />
                <Route path="/*" element={
                    <PrivateRoute>
                        {(auth?.rol === "Administrador") ?
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
