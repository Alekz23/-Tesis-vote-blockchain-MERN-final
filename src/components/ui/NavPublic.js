import React from 'react';
import { Link, NavLink} from 'react-router-dom';

import { useDispatch} from 'react-redux';
import { startLogout } from '../../actions/auth';



export const NavPublic = () => {

    const dispatch = useDispatch();
   


    const handleLogout = () => {
        //history.replace('/login');
        dispatch( startLogout() );
    }


    return (
        <nav className="navbar navbar-expand-sm navbar-dark bg-dark">
            
            <Link 
                className="navbar-brand" 
                to="/"
            >
                Vote
            </Link>
            <div className="navbar-collapse">
                <div className="navbar-nav">

                    <NavLink 
                        className={ ({ isActive }) => 'nav-item nav-link ' + (isActive ? 'active' : '') }
                        to="/resultados"
                    >
                        Resultados
                    </NavLink>

                   

                   
                </div>
            </div>
            

            <div className="navbar-collapse collapse w-100 order-3 dual-collapse2 d-flex justify-content-end">
                <ul className="navbar-nav ml-auto">

                    <span className="nav-item nav-link text-info">
                        VIEW PUBLIC
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