import { combineReducers } from 'redux';

import { uiReducer } from './uiReducer';
import { calendarReducer } from './calendarReducer';
import { electionReducer } from './electionReducer';
import { authReducer } from './authReducer';
import { listaReducer } from './listaReducer';
import { candidatoReducer } from './candidatoReducer';
import { userReducer } from './userReducer';
//import { electionByIdReducer } from './electionByIdReducer';



export const rootReducer = combineReducers({
    ui: uiReducer,
    calendar: calendarReducer,
    eleccion: electionReducer,
    auth: authReducer,
    lista: listaReducer,
    candidato: candidatoReducer,
    //byId: electionByIdReducer
    user: userReducer 
    // TODO: AuthReducer
})

