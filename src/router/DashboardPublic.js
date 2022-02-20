import React from 'react';

import { Routes, Route } from 'react-router-dom';
import { NavPublic } from '../components/ui/NavPublic';

import { ResultsScreen } from '../components/vote/ResultsScreen';



export const DashboardPublic = () => {
    return (
        <>
            <NavPublic />

            <div className="container">
                <Routes>
                    <Route path="resultados" element={<ResultsScreen />} />
                    

                    <Route path="/" element={<ResultsScreen/>} />

                </Routes>
            </div>
        </>
    )
}
