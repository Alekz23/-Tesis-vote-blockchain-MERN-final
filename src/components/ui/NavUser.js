import React from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';
import { startLogout } from '../../actions/auth';



export const NavUser = () => {

    const dispatch = useDispatch();
    const { name } = useSelector(state => state.auth);


    const handleLogout = () => {
        //history.replace('/login');
        dispatch(startLogout());
    }



    return (
        <nav class="navbar navbar-expand-sm navbar-dark bg-dark">
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <Link
                className="navbar-brand"
                to="/"
            >
                Vote
            </Link>


            <div class="collapse navbar-collapse" id="navbarText">
                <ul class="navbar-nav mr-auto">
                </ul>

                <ul className="navbar-nav ml-auto ">

                <span className="nav-item nav-link text-info">
                        {name}
                    </span>
                
                        <button
                            className="btn btn-outline-danger "
                            onClick={handleLogout}
                        >
                            <i className="fas fa-sign-out-alt"></i>
                            <span> Salir</span>
                        </button>
            
                </ul>
            </div>

        </nav>
    )
}