import React from 'react';
import { Link, NavLink} from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import { startLogout } from '../../actions/auth';



export const NavUser = () => {

    const dispatch = useDispatch();
    const { name } = useSelector( state => state.auth );


    const handleLogout = () => {
        //history.replace('/login');
        dispatch( startLogout() );
    }


    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            
            <Link 
                className="navbar-brand" 
                to="/"
            >
                Vote
            </Link>

            

            <div className="form-inline my-2 my-lg-0">
                <ul className="navbar-nav ml-auto">

                    <span className="nav-item nav-link text-info">
                        { name }
                    </span>
                    
                    <button 
                        className="nav-item nav-link btn" 
                        onClick={ handleLogout }
                    >
                        Logout
                    </button>
                </ul>
            </div>
        </nav>
    )
}