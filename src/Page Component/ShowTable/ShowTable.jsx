import React, { useEffect, useState } from 'react'

function ShowTable() {
  

  const [tableList, setTableList] = useState([]);


  const hostName= process.env.REACT_APP_NODE_ENV+"";

  useEffect(async () => {

    let url = hostName+'/showTables';
    const res = await fetch(url);
    const tables = await res.json();
    console.log(tables);

    setTableList(tables.tableList)

  
  },[])
  
  return (
    <>
    
    <div>ShowTable</div>

    <select class="custom-select custom-select-sm">
      <option selected>Open this select menu</option>
      {tableList.map((e)=>{
        return(
            <option value={e.Tables_in_released_royal_shop}>{e.Tables_in_released_royal_shop}</option>
            )
        })}
      </select>
    </>
  )
}

export default ShowTable