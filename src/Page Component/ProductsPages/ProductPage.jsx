import React from 'react'
import { useParams, useLoaderData, Form, redirect, useNavigate} from 'react-router-dom'

function ProductPage() {


  // const loaderData = useLoaderData();
  // console.log(loaderData);
  let {product_list, fields, catagory, brands,query} = useLoaderData();
  const navigate = useNavigate()
  // console.log(product_list);
  // console.log(fields);
  // console.log(catagory);
  // console.log(brands);
  // console.log(query);
  const {cat} = useParams();
  let qa = query;
  query = JSON.stringify(query).replace(/"/g, '');
  query = query.replace(/,/g, ',  ');
  query = query.replace(/:/g, ':  ');
  query = query.replace(/{/g, '');
  query = query.replace(/}/g, '');

  catagory = catagory.replace(/_/g, " " );
  catagory = catagory.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});

  const addToCart = async (id)=> {
    let url = process.env.REACT_APP_NODE_ENV+'/addProductIntoCart/'+ id;
    const res = await fetch(url).then(res=>res.json()).catch(err=>{
      alert(err)
    });
    alert("Product Added Total Quantity: "+res[0][0].quantity);
  }


  const formSubmitHandler = (e)=>{
    e.preventDefault();
  //  console.log(qa);
    // console.log(e.target.value); 
    let url="?";

    for (const [key,value] of Object.entries(qa)){
      url += key+"="+value+"&";
    }
    url = url.slice(0, -1);
  //  console.log(url);
    navigate(url);
    
  }

  const changeField = (field, value)=>{
    qa[field] = value;
  //  console.log(qa);
  }


  return (
    <div className="container-fluid">
      <div className="mx-auto product-head">
        <span >{catagory}</span>
      </div>

      <form method='GET' onSubmit={formSubmitHandler}>
        <div className="row">
          <div className="product-form-input input-group input-group-sm col-sm-6 col-lg-4 col-xs-12">
            <div className="">
              <label className="mr-3" htmlFor="inputGroupSelect01">Brand</label>
            </div>
            <select className="custom-select" id="inputGroupSelect01" name="brand_name"
              onChange={(e)=>{changeField("brand_name", e.target.value);}}
            >
              <option >Choose...</option>
               {brands.map(brand =>{
                // console.log(brand);
                return (<option key={brand.brand_name} value={brand.brand_name}>{brand.brand_name}</option>)
               } )}
            </select>
          </div>
          {fields.map(element => {

            
            if (element.Field != 'specs_id') {
              if (element.Field === null) {
                qa[element.Field]= "Choose...";
              }
              let fieldName=element.Field.replace(/_/g, " " );
              fieldName = fieldName.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() +
                txt.substr(1).toLowerCase();});
              return (
                <div key={element.Field} className="product-form-input input-group input-group-sm col-sm-6 col-lg-4 col-xs-12">
                  <div className="">
                    <label className="mr-3" htmlFor={`inputGroupSelect${element.Field}`}>{fieldName}</label>
                  </div>
                  <select className="custom-select " defaultValue={query[element.Field]} id={`inputGroupSelect${element.Field}`} name={element.Field}
                    onChange={(e)=>{changeField(element.Field, e.target.value);}}
                  >
                    <option value="Choose...">Choose...</option>
                    {element.item.map(item =>
                      <option key={item[element.Field]} value={item[element.Field]}> {item[element.Field]}</option>
                    )}
                  </select>
                </div>
              )
            }
          })}
        </div>
        <button className="btn btn-outline-dark product-form-btn" type="submit">Apply</button>
        <br />
      </form>

      
      <hr style={{margin: "10px"}}/>
      <h5>{query}</h5>


      <div className="row">



        { product_list.map(element => {
          let url = "https://drive.google.com/thumbnail?id=";
          
          url += '1WWHR6yC325fux1Lck1pqBCoyLcbzp9-M';
          
          let bad = element.brand_name.replace(/_/g, " ");
          bad = bad.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
          return(
          <div key={element.product_id} className="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-12 text-center">
            <div className="">
              <div>
                <div className="image">
                  <img src={url} alt="IMG" className="img-thumbnail"/>
                </div>
                <div>
                  <p id="description" className="">{element.product_name}</p>
                  <p className="price-para"><span className="price-label">Rate </span><span className="price">₹{element.mrp}
                    </span><span className="price-label"> per {element.unit} </span>
                    <br/><span className="price-label">MRP. </span><span
                      className="price">₹{(element.per_peice_quantity * element.mrp)} </span>
                  </p>
                  <div className="add-to-cart-btn">
                    <button className="btn btn-secondary btn-block btn-sm product-add-button" onClick={(e)=>{addToCart(element.product_id)}}
                      id={element.product_id}>Add to cart</button>
                  </div>
                  <p><span className="stock-label">In Stock {element.stock}</span></p>
                </div>
              </div>
            </div>
          </div>
        )})}
      </div>
    </div>
  )
}


export const loader = async ({params, request})=>{
  // console.log(params);
//  console.log(request.url.split('?')[1]);
  let url = process.env.REACT_APP_NODE_ENV+"/productPage/"+params.cat;
  if (request.url.split('?')[1] != null) {
    url += "?"+request.url.split('?')[1];
  }
  const res = await fetch(url)
  .then((res)=>{
    return (res.json());
  })
  .catch((err)=>{
    throw({msg:"asdfs"})
  })
    // console.log(res);
  return res;
}


export const action = async ({ request, params }) => {
//  console.log("adsfasdf");
  
  const data = await request.formData();
//  console.log(data);  

  redirect('/')
}



export default ProductPage