import React, {useState,useEffect} from 'react';
import {Form} from 'react-router-dom';

export default function AddProducts() {

  const [pageDetails, setPageDetails] = useState({brands:[],category:[],units:[]})

  useEffect(() => {
    fetch(process.env.REACT_APP_NODE_ENV+"/addProductPageDetails")
    .then(res=>res.json())
    .then((data)=>{
        // console.log(data);
        setPageDetails(data);
    })
  },[]);
  

  return (
    <div className='container' id="addProductsForm">

      <div className="add-heading bg-primary">
        <h3 >Add Product</h3>
      </div>

      <Form method="POST" className="needs-validation" noValidate={true}>

        <div className="form-group">
          <div className="select-items">
            <label htmlFor="categorySelect">Category</label>
            <select className="custom-select" name="catagory" id="categorySelect" required>
             {pageDetails.category.map((c,i)=>{
                let cat = c.name.replace(/_/g, " ");
                cat = cat.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();})
                return(<option key={i} value={c.name}>{cat}</option>)
              })}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="brandSelect">Brand</label>
          <input type="text" className="form-control" list="brands" id="brandSelect" name="brand_name" required/>
          <datalist id="brands">
          {pageDetails.brands.map((b,i)=>{
            let brand = b.brand_name.replace(/_/g, " ");
            brand = brand.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();})
            return(<option key={i} value={b.brand_name}>{brand}</option>)
          })}
          </datalist>
        </div>

        <div className="form-group ">
          <label htmlFor="name">Name</label>
          <input type="text" className="form-control" id="name" placeholder="Name" name="name" required/>
        </div>

        <div className="form-group ">
          <label htmlFor="mrp">MRP</label>
          <input type="number" className="form-control" id="mrp" placeholder="00" name="mrp" step="any"/>
        </div>
      
        <div className="form-group ">
          <label htmlFor="cp">Cost Price</label>
          <input type="number" className="form-control" id="cp" placeholder="00" name="cp"  step="any"/>
        </div>

        <div className="form-group">
          <label htmlFor="unitSelect">Unit</label>
          <input type="text" className="form-control" list="units" id="unitSelect" name="unit" required />
          <datalist id="units">
          {pageDetails.units.map((u,i)=>{
            let unit = u.name.replace(/_/g, " ");
            return(<option key={i} value={u.name}>{unit}</option>)
          })}
          </datalist>
        </div>

        <button className="btn btn-info btn-sm" type="submit">Apply</button>
      </Form>

    </div>
  )
}