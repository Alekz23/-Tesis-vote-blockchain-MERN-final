import React from 'react';

import { Routes, Route } from 'react-router-dom';


import { VoteScreen } from '../components/vote/VoteScreen';
import { NavUser } from '../components/ui/NavUser';



export const DashboardUser = () => {
    return (
        <>
            <NavUser />

            <div className="container">
                <Routes>
                    <Route path="votos" element={<VoteScreen />} />

                    <Route path="/" element={<VoteScreen  />} />

                </Routes>
            </div>
        </>
    )
}
