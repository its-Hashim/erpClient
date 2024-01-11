import React from 'react'
import {Form, useNavigate, useLoaderData, Link} from 'react-router-dom'
import SpecField from '../AddCategory/SpecField';

export default function Category() {
  const navigate = useNavigate();
  const {category, category_specs} = useLoaderData();
  let name=category.name.replace(/_/g, " " );
  name=name.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
  const del = async()=>{
    const res = await fetch(process.env.REACT_APP_NODE_ENV+'/deleteCatagory/'+category.name);
    const ret = await res.json();
    console.log(ret);
    if (ret.done==true || ret.done==='true') {
        navigate(-1);
    } else {
      alert ("Cannot delete", ret.msg);
    }
  };
  return (
    <div className="container">
      <div className="add-heading bg-dark">
        <h3 >Edit {name} Category</h3>
      </div>
      {/* {no_of_specs} */}
      <Form method="POST" className="needs-validation" noValidate>
        <input hidden type="number" name='no_of_specs' value={"no_of_specs"} onChange={(e)=>{}} />
        <div className="form-row">
          <div className="form-group col-md-8">
            <label htmlFor="catagory_name">Category Name</label>
            <input type="text" className="form-control" id="catagory_name" value={name} disabled name="catagory_name" required />
            <div className="invalid-feedback">
              Category name is required
            </div>
          </div>

          <div className="form-group col-md-4">
            <div className="select-items">
              <label htmlFor="belongs_to">This Category belongs to</label>
              <input type="text" className="form-control" id="belongs_to" value={category.this_catagory_belongs_to} disabled name="belongs_to" required />
            </div>
          </div>       
        </div>


        {category_specs.map((spec,i)=>{
          i+=1;
          if (spec.Field != "specs_id") {
            
            return(
              <div id="spec-container" key={i}>
                <div className="row">

                  <div className="form-group col-md-8">
                    <label htmlFor={`spec_${i}`}>Spec {i}</label>
                    <input type="text" className="form-control" id={`spec_${i}`} value={spec.Field} onChange={()=>{}} disabled name={`spec_${i}`} required />
                  </div>

                  <div className="form-group col-md-4">
                    <label htmlFor={`spec_${i}_default`}>Default</label>
                    <input type="text" className="form-control" id={`spec_${i}_default`} value={spec.Default} onChange={()=>{}} disabled name={`default_${i}`} required />
                  </div>

                </div>
                
              </div>
            )
          }
        })}

        

        {/* <SpecField  /> */}

        <Link to='addNewProductBatche' className='btn btn-dark btn add-button'>Add Product Batche</Link>
        <Link to='labelEdit' className='btn btn-dark btn add-button mr-3'>Edit Lable</Link>
        <a className="btn btn-danger btn add-button mr-3 mb-3 text-white" role="button" onClick={del} >Delete</a>
        <div style={{height:"100px"}}></div>
      </Form>
    </div>
  )
}

export const loader = async ({request, params})=>{
  const res = await fetch(process.env.REACT_APP_NODE_ENV+'/editCatagory/'+params.name);
  return res;
}
