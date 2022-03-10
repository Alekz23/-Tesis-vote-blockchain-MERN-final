import React from 'react';
import { Link, NavLink } from 'react-router-dom';





export const NavPublic = () => {

    // const dispatch = useDispatch();



    // const handleLogout = () => {
    //     //history.replace('/login');
    //     dispatch(startLogout());
    // }


    return (

        <nav className="navbar navbar-expand-sm navbar-dark bg-dark">
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <Link
                className="navbar-brand"
                to="/"
            >
                Vote
            </Link>


            <div className="collapse navbar-collapse" id="navbarText">
                <ul className="navbar-nav mr-auto">
                </ul>

                <ul className="navbar-nav ml-auto ">

                    <NavLink
                        className={({ isActive }) => 'nav-item nav-link ' + (isActive ? 'active' : '')}
                        to="/"
                    >
                        Login
                    </NavLink>


                    <NavLink
                        className={({ isActive }) => 'nav-item nav-link ' + (isActive ? 'active' : '')}
                        to="/resultados"
                    >
                        Resultados
                    </NavLink>

                </ul>
            </div>

        </nav>
    )




}