import React from 'react'
import ClientsForm from './Component/ClientsForm'
import {redirect} from 'react-router-dom'

function AddClients() {
  return (
    <div className='container' style={{ marginTop: "40px" }}>
      <ClientsForm title="Add Customer" />
    </div>
  )
}

export default AddClients


export const action = async ({ request, params }) => {
  const data = await request.formData();
  const obj = {
    mobile_no: data.get('mobile'),
    name: data.get('name'),
    address_line_1: data.get('address_line_1'),
    address_line_2: data.get('address_line_2'),
    city_or_district: data.get('city_or_district'),
    state: data.get('state'),
    country: data.get('country'),
    postal_code: data.get('postal_code'),
    id:data.get("id")
  }
  console.log(obj);
  console.log(request.method);
  const res = await fetch(process.env.REACT_APP_NODE_ENV+'/clients/addClient', {
    method: request.method,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(obj)
  })
  const ret = await res.json();
  console.log(ret);
  if (ret.done==true || ret.done==='true') {
    if (request.method == 'PUT') {
      alert("Client Details Has been updated")
      return redirect("/clients/transaction/"+obj.id)
    }
    return redirect("/clientList")
  } else {
    if (request.method == 'PUT') {
      throw ret;
    }else{
      throw "Cannot create the customer with the mobile number provided";
    }
  }

}

export function loader({ request, params }) {
  console.log("inside loader");
  return null;
}