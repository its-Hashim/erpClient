import React, {useEffect, useState} from 'react'
import {Form, useParams, redirect, Link} from 'react-router-dom'

export default function EditProduct() {

  const [specField, setSpecField] = useState([]);
  const [specs, setSpecs] = useState({});
  const [specsValue, setSpecsValue] = useState([]);

  const {id} = useParams();
  const [cat, setCat] = useState("");
  const [qPerPc, setQPerPc] = useState(1);
  const [brand, setBrand] = useState("");
  const [brandList, setBrandList] = useState([]);
  const [name, setName] = useState("");
  const [active, setActive] = useState(false)
  const [mrp, setMrp] = useState(0);
  const [cp, setCp] = useState(0);
  const [stock, setStock] = useState(0);
  const [minStock, setMinStock] = useState(0);
  const [maxStock, setMaxStock] = useState(0);
  const [unit, setUnit] = useState("");
  const [unitList, setUnitList] = useState([]);
  const [catSpecId, setCatSpecId] = useState(0);
  const [specsChar, setSpecsChar] = useState("");


  useEffect(() => {
    fetch(process.env.REACT_APP_NODE_ENV+"/getProductDetails?"+new URLSearchParams({id}))
    .then(res=>res.json())
    .then((data)=>{
      console.log(data);
        setSpecsValue(data.specsValues);
        setSpecField(data.specField);
        setSpecs(data.specs);
        setCat(data.product.catagory);
        setQPerPc(data.product.per_peice_quantity)
        setBrand(data.product.brand_name);
        setBrandList(data.brands);
        setName(data.product.product_name);
        setActive(data.product.active===1 ? true: false );
        setMrp(data.product.mrp);
        setCp(data.product.cp);
        setStock(data.product.stock);
        setMinStock(data.product.min_stock);
        setMaxStock(data.product.default_stock);
        setUnit(data.product.unit);
        setUnitList(data.units);
        setCatSpecId(data.product.catagory_specs_id);

    })
  
  }, [])
  

  useEffect(()=>{
    let temp = "";
    specField.forEach((spec, i)=>{
      temp += spec.Field+"::";
    });
    setSpecsChar(temp);
  },[specField]);

  return (
    <div className='container' id="addProductsForm">

      <div className="add-heading bg-danger">
        <h3 >Edit Product</h3>
      </div>  

      <h3>
        {/* <% var cat = catagory.replace(/_/g, " "); %> */}
        Enter the {cat}'s Specification
      </h3>

      {/* <div className="profile-pic">
        <img src="../../../../product_images/" alt="IMG" className="img-thumbnail" />
        <form id="dpform" action="/manage/productItem/edit/<%= product.product_id %>/uploadProductDp" enctype="multipart/form-data" method="POST">
          <div className="edit">
            <label htmlFor="">
              <img src="../../../../assets/edit icon.png"  alt="" srcset="">
            </label>
            <input id="file" type="file" onchange="checkFile()" name="file" accept=".jpg, .jpeg" required>
          </div>
        </form>
      </div> */}


      
      <Form method="POST">


        {/* <% for( let index = 0; index < spec_fields.length; index++ ) { %>
          <% if (spec_fields[index].Field == 'specs_id') { %>
            <% continue; %> 
          <% } %> */}

          {specField.map((spec, i)=>{
            if (spec.Field != 'specs_id'){
              return (
                <div key={i} className="form-group">
                  <label htmlFor={spec.Field+'Select'}>{spec.Field}</label>
                  <input type={spec.Type}
                    className="form-control"
                    list={spec.Field}
                    id={spec.Field+'Select'}
                    value={specs[spec.Field]}
                    onChange={(e)=>{
                      let tempo = {...spec};
                      tempo[spec.Field] = e.target.value;
                      setSpecs(tempo);
                    }}
                    name={spec.Field} />

                  <datalist id={spec.Field}>
                    {specsValue[i].map((v, j)=><option key={j}>{v[spec.Field]}</option>)}
                  </datalist>
                </div>

              );
            }
            else{
              return (<input type="hidden" id="specs"  name="specs" onChange={(e)=> setSpecsChar(e.target.value)} value={specsChar} />)
            }
          })}


        <div className="form-group ">
          <label htmlFor="quantity_per_peice">Quantity Per Peice</label>
          <input step="any" type="number" className="form-control" id="quantity_per_peice" 
            placeholder="1" name="quantity_per_peice" value={qPerPc} onChange={(e)=>{setQPerPc(e.target.value)}} />
        </div>
        
        <div className="form-group">
          <label htmlFor="brandSelect">Brand</label>
          <input type="text" className="form-control" list="brands" id="brandSelect" value={brand} name="brand_name" 
            onChange={(e)=>{setBrand(e.target.value)}} />
          <datalist id="brands">
            {brandList.map((b, i)=> <option key={i}>{b.brand_name}</option> )}
              
          </datalist>
        </div>

        <div className="form-group ">
          <label htmlFor="name">Name</label>
          <input type="text" className="form-control" id="name" placeholder="Name" name="name" value={name}
            onChange={(e)=>{setName(e.target.value)}} />
        </div>
        <input checked={active} type="radio" value={true} id="active" name="active" onChange={(e)=>{setActive(e.target.value === "true")}}/>
        <label htmlFor="active" className='mr-3'>Active</label>
        <input checked={!active} type="radio" value={false} id="inactive"  name="active" onChange={(e)=>{setActive(e.target.value === "true")}} />
        <label htmlFor="inactive">Inactive</label>
        
        {/* <div className="form-group ">
          <label htmlFor="image_url">G Drive Imgae Share Link</label>
          <input type="text" className="form-control" id="image_url" placeholder="image_url" name="image_url" value="<%= product.image_url %>" />
        </div> */}
        
        <div className="form-group ">
          <label htmlFor="mrp">MRP</label>
          <input type="number" className="form-control" id="mrp" placeholder="1000.00" name="mrp" value={mrp} 
            onChange={(e)=>{setMrp(e.target.value)}} step="any"/>
        </div>
        
        <div className="form-group ">
          <label htmlFor="cp">Info</label>
          <input type="number" className="form-control" id="cp" placeholder="950.00" name="cp" value={cp} 
            onChange={(e)=>{setCp(e.target.value)}} step="any"/>
        </div>
        
        <div className="form-group ">
          <label htmlFor="stock">Stock</label>
          <input type="number" className="form-control" id="stock" placeholder="1" name="stock" value={stock}
          onChange={(e)=>{setStock(e.target.value)}} step="any"/>
        </div>

        <div className="form-group ">
          <label htmlFor="min_stock">Enter The Min. Stock</label>
          <input type="number" className="form-control" id="min_stock" placeholder="1" name="min_stock" value={minStock}
            onChange={(e)=>{setMinStock(e.target.value)}} step="any"/>
        </div>

        <div className="form-group ">
          <label htmlFor="default_stock">Enter The Default Stock</label>
          <input type="number" className="form-control" id="default_stock" placeholder="950.00" name="default_stock" value={maxStock}
            onChange={(e)=>{setMaxStock(e.target.value)}} step="any"/>
        </div>

        <div className="form-group">
          <label htmlFor="unitSelect">Unit</label>
          <input type="text" className="form-control" list="units" id="unitSelect" value={unit}
            onChange={(e)=>{setUnit(e.target.value)}} name="unit"  />
          <datalist id="units">
            {unitList.map((u,i)=> <option key={i} value={u}> u </option>)}
          </datalist>
        </div>

        <input type="hidden" name="product_id" onChange={(e)=> {}} value={id} />
        <input type="hidden" name="catagory_specs_id" onChange={(e)=> {}} value={catSpecId} />
        <input type="hidden" name="catagory" onChange={(e)=> {}} value={cat} />

        {/* <a href="/manage/productItem/delete/<%= product_id %>/<%= catagory_specs_id %>/<%= catagory %>" className="btn btn-danger btn-sm">Please Delete</a> */}

        <button className="btn btn-dark " type="submit">Save</button>
        <Link to="label" className="btn btn-outline-danger ml-2" >Generate Label</Link>
      </Form>

    </div>
  )
}


export const action = async ({request, params})=>{
  const data = await request.formData();
  const obj = {
    catagory: data.get('catagory'),
    brand_name: data.get('brand_name'),
    name: data.get('name'),
    mrp: data.get('mrp'),
    cp: data.get('cp'),
    unit: data.get('unit'),
    specs: data.get('specs'),
    product_id: data.get('product_id'),
    quantity_per_peice: data.get('quantity_per_peice'),
    active: data.get('active'),
    stock: data.get('stock'),
    min_stock: data.get('min_stock'),
    default_stock: data.get('default_stock'),
    catagory_specs_id: data.get('catagory_specs_id'),
    catagory: data.get('catagory')
  }
  let specFields =  obj.specs.split("::");
  specFields = specFields.slice(1,-1);
  specFields.forEach((d)=>{
    obj[d]=data.get(d);
  })
  let res = await fetch(process.env.REACT_APP_NODE_ENV+'/editProduct', {
    method: request.method,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(obj)
  });

  res = await res.json();

  if (res.done == true) {
    alert("The Product Has been updated")
    return redirect("/productItem/"+obj.product_id)
  } else {
    throw "Cannot Edit The Products Please Contact Admin. MSG: "+res.err;
  }

}