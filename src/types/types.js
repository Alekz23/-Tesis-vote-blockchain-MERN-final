
export const types = {
    //abrir y cerra el formulario model para ingresar datos
    uiOpenModal: '[ui] Open modal',
    uiCloseModal: '[ui] Close modal',

    //elecciones estados 
    electionSetActive: '[election] Set Active',
    electionStartAddNew: '[election] Start Add new',
    electionAddNew: '[election] Add new',
    electionClearActiveElection: '[election] Clear active election', //limpiar del store la eleccion activa
    electionUpdated: '[election] Election updated', //actualizar eleccion
    electionDeleted: '[election] Election deleted', // eliminar eleccion
    electionLoaded: '[election] Election loaded',
    electionLogout : '[election] Election logout',
    electionLoadedByList: '[byId] Election loadedList',

    electionEnabled: '[election] Enable Active', // habilitar eleccion global
    electionClearEnable: '[election] Clear enable election', //limpiar del store la eleccion habilitada




    //redux de listas------------------------------------------------
    listaSetActive: '[lista] Set Active',
    listaStartAddNew: '[lista] Start Add new',
    listaAddNew: '[lista] Add new',
    listaClearActiveElection: '[lista] Clear active lista', //limpiar del store la eleccion activa
    listaUpdated: '[lista] Lista updated', //actualizar eleccion
    listaDeleted: '[lista] Lista deleted', // eliminar eleccion
    listaLoaded: '[lista]  Lista loaded',
    listaLogout : '[lista] Lista logout',


    //cargos redux
      //redux de listas------------------------------------------------
      cargoSetActive: '[cargo] Set Active',
      cargoStartAddNew: '[cargo] Start Add new',
      cargoAddNew: '[cargo] Add new',
      cargoClearActiveCargo: '[cargo] Clear active cargo', //limpiar del store la eleccion activa
      cargoDeleted: '[cargo deleted', // eliminar eleccion
      cargoLoaded: '[cargo]  cargo loaded',
      cargoLogout : '[cargo] cargo logout',
  

    //redux de candidatos ----------------

     //elecciones estados 
     candidatoSetActive: '[candidato] Set Active',
     candidatoStartAddNew: '[candidato] Start Add new',
     candidatoAddNew: '[candidato] Add new',
     candidatoClearActiveCandidato: '[candidato] Clear active Candidato', //limpiar del store la eleccion activa
     candidatoUpdated: '[candidato] Candidato updated', //actualizar eleccion
     candidatoDeleted: '[candidato] Candidato deleted', // eliminar eleccion
     candidatoLoaded: '[candidato]  Candidato loaded',
     candidatoLogout : '[candidato] Candidato logout',

      //usuarios estados 
      userSetActive: '[user] Set Active',
      userStartAddNew: '[user] Start Add new',
      userAddNew: '[user] Add new',
      userClearActiveUser: '[user] Clear active User', //limpiar del store la eleccion activa
      userUpdated: '[user] User updated', //actualizar eleccion
      userDeleted: '[user] User deleted', // eliminar eleccion
      userLoaded: '[user]  User loaded',
      userLogout : '[user] User logout',
 



    
    //esatdo para el login Authorization
    authCheckingFinish: '[auth] Finish checking login state',
    authStartLogin: '[auth] Start login',
    authLogin: '[auth] Login',
    authStartRegister: '[auth] Start Register',
    authStartStartTokenRenew: '[auth] Start token renew',
    authLogout: '[auth] Logout',


    eventSetActive: '[event] Set Active',
    eventAddNew: '[event] Add new',
    eventClearActiveEvent: '[event] Clear active event',
    eventUpdated: '[event] Event updated',
    eventDeleted: '[event] Event deleted',


}