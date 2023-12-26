import React from 'react'
import ClientsForm from './Component/ClientsForm';


export default function ClientDetails(props) {

  return (
        <div className='container' style={{ marginTop: "40px" }}>
          <ClientsForm method="PUT" disabled="true" title={props.title} data={props.data} />
        </div>
  )
}
