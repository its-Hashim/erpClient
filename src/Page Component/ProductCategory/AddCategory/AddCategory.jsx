import React, {useState} from 'react'
import { Form, useLoaderData, redirect, useNavigate} from 'react-router-dom'
import SpecField from './SpecField';

export default function AddCategory() {

  const [no_of_specs, setNo_of_specs] = useState(1);
  const [specFields, setSpecFields] = useState([<SpecField n="1" key={1}  />]);
  const {data} = useLoaderData();
  const navigate = useNavigate();
  // console.log(no_of_specs);
  
  const addSpec = ()=>{
    let specs = [...specFields];
    specs.push(<SpecField n={no_of_specs+1} key={no_of_specs+1} />)
    // console.log(specs);
    setSpecFields(specs);
    setNo_of_specs(no_of_specs+1) 
  }

  return (
    <div className="container">
      <div className="add-heading bg-primary">
        <h3 >Add Category</h3>
      </div>
      {/* {no_of_specs} */}
      <Form method="POST" className="needs-validation" noValidate>
        <input hidden type="number" name='no_of_specs' value={no_of_specs} onChange={(e)=>{}} />
        <div className="form-row">
          <div className="form-group col-md-8">
            <label htmlFor="catagory_name">Category Name</label>
            <input type="text" className="form-control" id="catagory_name" name="catagory_name" required />
            <div className="invalid-feedback">
              Category name is required
            </div>
          </div>

          <div className="form-group col-md-4">
            <div className="select-items">
              <label htmlFor="belongs_to">This Category belongs to</label>
              <select className="custom-select" name="belongs_to" id="belongs_to" required>
                <option value="null">null</option>
                {data.map((element,i)=>{
                  let name=element.name.replace(/_/g, " " );
                  name= name.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
                  return <option key={i} value={element.name}>{name}</option>
                })}
              </select>
            </div>
          </div>
          
        </div>

        {specFields}

        <button type="submit" className="btn btn-primary btn-sm add-button">Add</button>
        <a className="btn btn-info btn-sm add-button mr-3 mb-3 text-white" onClick={()=>{navigate(-1)}} role="button">Cancel</a>
        <a className="btn btn-info btn-sm add-button mr-3 mb-3 text-white" role="button" onClick={addSpec}>Add Specs</a>
      </Form>
    </div>
  )
}

export const action = async ({request, params})=>{
  const data = await request.formData();
  let n = (data.get('no_of_specs'));
  const obj = {};
  for(let i=1; i<=n;i++){
    obj[`spec_${i}`] = data.get(`spec_${i}`);
    obj[`default_${i}`]= data.get(`default_${i}`);
  }
  obj["name"]=data.get("catagory_name");
  obj["belongs_to"]=data.get("belongs_to");

  console.log(obj);
  console.log(request.method);
  const res = await fetch(process.env.REACT_APP_NODE_ENV+'/catagory/add', {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(obj)
  })
  const ret = await res.json();
  if (ret.done==true || ret.done==='true') {
      return redirect("/productsCatagory");
  } else {
    throw "Cannot create the product";
  } 
  // return(null);
}
