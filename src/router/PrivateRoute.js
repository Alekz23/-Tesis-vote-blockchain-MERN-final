import React from 'react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { startChecking } from '../actions/auth';



export const PrivateRoute = ({ children }) => {

    const { uid, checking, rol} = useSelector( state => state.auth);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(startChecking())
    },[dispatch])

    console.log(checking);
    console.log(rol);
    console.log('en private route');

    //guardar la ultima pagina visitada
    const location= useLocation();
    localStorage.setItem('lastPath', location.pathname);
    console.log(location);


    return !!uid
        ? children
        : <Navigate to="/login" />
}
