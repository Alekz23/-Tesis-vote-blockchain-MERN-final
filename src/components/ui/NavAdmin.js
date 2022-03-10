import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import { startLogout } from '../../actions/auth';



export const NavAdmin = () => {

    const dispatch = useDispatch();
    const { name } = useSelector(state => state.auth);

    const navigate = useNavigate();

    const handleLogout = () => {
        //history.replace('/login');
        navigate('/',
        {
            replace: true
        });
        dispatch(startLogout());
       
    }


    return (
        <nav className="navbar navbar-expand-sm navbar-dark bg-dark">

            <Link
                className="navbar-brand"
                to="/"
            >
                Vote
            </Link>

            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarNav">
                <div className="navbar-nav">

                    <NavLink
                        className={({ isActive }) => 'nav-item nav-link ' + (isActive ? 'active' : '')}
                        to="/elecciones"
                    >
                        Elecciones
                    </NavLink>

                    <NavLink
                        className={({ isActive }) => 'nav-item nav-link ' + (isActive ? 'active' : '')}
                        to="/listas"
                    >
                        Listas
                    </NavLink>

                    <NavLink
                        className={({ isActive }) => 'nav-item nav-link ' + (isActive ? 'active' : '')}
                        to="/candidatos"
                    >
                        Candidatos
                    </NavLink>

                    <NavLink
                        className={({ isActive }) => 'nav-item nav-link ' + (isActive ? 'active' : '')}
                        to="/usuarios"
                    >
                        Usuarios
                    </NavLink>
                </div>

                <div className="navbar-collapse collapse w-100 order-3 dual-collapse2 d-flex justify-content-end">

                    <ul className="navbar-nav ml-auto">

                        {/* <NavLink
                            className={({ isActive }) => 'nav-item nav-link ' + (isActive ? 'active' : '')}
                            to="/resultados"
                        >
                            Resultados
                        </NavLink> */}
                        <span className="nav-item nav-link text-info">
                            {name}
                        </span>

                        <button
                            className="btn btn-outline-danger"
                            onClick={handleLogout}
                        >
                            <i className="fas fa-sign-out-alt"></i>
                            <span> Salir</span>
                        </button>

                    </ul>

                </div>

            </div>

        </nav>
    )
}