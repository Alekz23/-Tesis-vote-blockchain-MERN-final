import React from 'react';

import { Routes, Route } from 'react-router-dom';
import { LoginScreen } from '../components/auth/LoginScreen';
import { NavPublic } from '../components/ui/NavPublic';

import { ResultsScreen } from '../components/vote/ResultsScreen';



export const DashboardPublic = () => {
    return (
        <>
            <NavPublic />

            <div >
                <Routes>
                    <Route path="login" element={<LoginScreen />} />
                    <Route path="resultados" element={<ResultsScreen />} />

                    <Route path="/" element={<LoginScreen />} />

                </Routes>
            </div>
        </>
    )
}
