import React, { useState } from 'react';

export const Counter = () => {



  const [state, setState] = useState(0);

  


  const Add = () => {

   
    setState(state+1)

    //setState(prev=> prev, prev+1)
    console.log(state) ///1

   
  }

  return <div>

    <button onClick={Add} > Add</button>
    <h1>{state}</h1>

  </div>;
};
