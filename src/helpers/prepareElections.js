import moment from 'moment'


export const prepareElections = ( elections = [] ) => {

    return elections.map(
        (e) => ({
            ...e,
            end: moment( e.end ).toDate(),
             start: moment( e.start ).toDate(),
            //end:moment(e.end).format('YYYY-MM-DD HH:mm:ss'),
            //start: moment(e.start).format('YYYY-MM-DD HH:mm:ss'),
        })
    );

}