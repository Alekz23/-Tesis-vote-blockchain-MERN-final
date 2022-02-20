import React from 'react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { startChecking } from '../actions/auth';



export const PrivateRoute = ({ children }) => {

    const { uid} = useSelector( state => state.auth);

    return !!uid
        ? children
        : <Navigate to="/login" />
}
