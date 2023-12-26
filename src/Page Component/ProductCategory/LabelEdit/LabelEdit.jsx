import React from 'react'
import { useLoaderData, redirect, Form } from 'react-router-dom'

function LabelEdit() {

  const {category, category_specs} = useLoaderData();
  // console.log(category);
  // console.log(category_specs);

  return (
    <div className='container-sm mt-5' style={{ maxWidth:'700px'}}>
      <h2 className='add-heading bg-primary  pl-1' style={{textTransform:'capitalize'}}>Set Label for {category.name}</h2>

      <Form method='put'>

        {[...Array(3).keys()].map((i)=>{
          i+=1;
          return(
            <div className="form-row">
              <div className="col-md form-group">
                <label htmlFor={`labelFeature${i}`}>Label Feature {i}:</label>
                <select className="custom-select" id={`labelFeature${i}`} name={`labelFeature${i}`} defaultValue={category["label_feature_"+i]}>
                  <option value={null}>None</option>
                  {category_specs.map((spec,i)=>{
                    
                    if (spec.Field != "specs_id") {
                      return(
                        <option key={spec.Field} value={spec.Field}>{spec.Field}</option>
                        )
                      }
                    })}
                </select>
              </div>

              <div className="col-md form-group">
                <label htmlFor={"printAs"+i}>Printed as</label>
                <input type="text" name={"printAs"+i} id={"printAs"+i} className='form-control' defaultValue={category["label_feature_alias_"+i]} />
              </div>

            </div>
            
          );


        })}

        

        {/* <div className="form-row">

        
        
          <div className="col-md form-group">

            <label htmlFor="labelFeature2">Label Feature 2:</label>
            <select className="custom-select" id='labelFeature2' name='labelFeature2' defaultValue={category.label_feature_2} >

              <option value={null}>None</option>
              {category_specs.map((spec,i)=>{
                
                if (spec.Field != "specs_id") {
                  return(
                    <option key={spec.Field} value={spec.Field}>{spec.Field}</option>
                    )
                  }
                })}
              
            </select>
          </div>

          <div className="col-md form-group">
            <label htmlFor='printAs2'>Printed as</label>
            <input type="text" name='printAs2' id='printAs2' className='form-control' defaultValue={category.label_feature_alias_2} />
          </div>
        </div> */}

        <button className='btn btn-danger mt-3 mb-5' type='submit'>Submit</button>
      </Form>
    </div>
  )
}

export default LabelEdit


export const loader = async ({request, params})=>{
  const res = await fetch(process.env.REACT_APP_NODE_ENV+'/editCatagory/'+params.name);
  return res;
}

export const action = async ({request, params})=>{

  const data = await request.formData();
  const obj = {
    label_feature_1: data.get('labelFeature1'),
    label_feature_2: data.get('labelFeature2'),
    label_feature_3: data.get('labelFeature3'),
    label_feature_alias_1:data.get('printAs1'),
    label_feature_alias_2:data.get('printAs2'),
    label_feature_alias_3:data.get('printAs3'),
  }

  // console.log(obj);


  // const res = await fetch(process.env.REACT_APP_NODE_ENV+'/editCatagory/'+params.name);

  const res = await fetch(process.env.REACT_APP_NODE_ENV+'/editCatagory/'+params.name+'/editLabel', {
    method: request.method,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(obj)
  })
  const ret = await res.json();
  // console.log(ret);
  if (ret.done) {
    alert("Updated...")
    return null;
  }else{
    alert(ret.msg)
    return null;
  }
}