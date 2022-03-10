import React from 'react';

import { Routes, Route } from 'react-router-dom';

import { EleccionScreen } from '../components/elecciones/EleccionScreen';
import { ListaScreen } from '../components/listas/ListaScreen';
import { CandidatoScreen } from '../components/candidatos/CandidatoScreen';
import { NavAdmin } from '../components/ui/NavAdmin';
import { UserScreen } from '../components/user/UserScreen';
//import { ResultsScreen } from '../components/vote/ResultsScreen';



export const DashboardRoutes = () => {

    return (
        <>
            <NavAdmin/>

            <div className="container">
                <Routes>
                    <Route path="elecciones" element={<EleccionScreen/>}/>
                    <Route path="listas" element={<ListaScreen/>}/>
                    <Route path="candidatos" element={<CandidatoScreen/>}/>
                    <Route path="usuarios" element={<UserScreen/>}/>
                    {/* <Route path="resultados" element={<ResultsScreen/>}/> */}
                    <Route path="/" element={<EleccionScreen/>}/>

                </Routes>
            </div>
        </>
    )
}
