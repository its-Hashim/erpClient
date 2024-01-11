import React, {useEffect, useReducer} from 'react'
import Table from '../Components/Table';
import classes from './index.module.css'
import {useNavigate, redirect} from 'react-router-dom'

export default function Products() {

  const navigate = useNavigate();
  const initialState = {
    pageNo: 0,noOfPages:0,
    productList: [],categoryList:[],brandList:[],
    cat:"/_default_/", brand:"/_default_/", stock:"/_default_/", active:"/_default_/",
    stk:0,amt:0
  }
  const reducer = (state, action)=>{
    switch(action.type){
      case 'UPDATE_PAGENO':
        if(action.value <= state.noOfPages && action.value >= 1){
          return{...state, pageNo: (Number(action.value) - 1)};
        }else{
          return{...state};
        } 
      case 'INCREMENT_PAGENO':
        return{...state, pageNo: ++state.pageNo};
      case 'DECREMENT_PAGENO':
        return{...state, pageNo:--state.pageNo};

      case 'UPDATE_PRODUCT_LIST':
        return{...state,
          productList:action.productList,
          noOfPages:action.noOfPages,
          amt:action.amt,
          stk:action.stk
        };
      case 'UPDATE_BRAND_AND_CATEGORY_LIST':
        return{...state,brandList:action.brandList,
                categoryList:action.categoryList,
              };

      case 'update_cat':
        return{...state, cat:action.value};
      case 'update_brand':
        return{...state, brand:action.value};
      case 'update_stock':
        return{...state, stock:action.value};
      case 'update_active':
        return{...state, active:action.value};
      case 'update_stock':
        return{...state, stk:action.value};
      case 'update_amt':
        return{...state, amt:action.value};
      default:
        return state 
    }
  }

  const [{pageNo,noOfPages,productList, categoryList, brandList, cat, brand, stock, active, stk, amt}, dispatch] = useReducer(reducer, initialState);

  useEffect(()=>{
    fetch(process.env.REACT_APP_NODE_ENV+"/getCategoryBrand")
    .then(res=>res.json())
    .then((data)=>{
        dispatch({type:"UPDATE_BRAND_AND_CATEGORY_LIST", brandList:data.brand, categoryList:data.cat})
    })
  },[]);

  useEffect(()=>{
    fetch(process.env.REACT_APP_NODE_ENV+"/getProductList?"+new URLSearchParams({pageNo,cat, brand, stock, active}))
    .then(res=>res.json())
    .then((data)=>{
        // console.log("**************");
        // console.log(data);
        // console.log("**************");
        dispatch({type:"UPDATE_PRODUCT_LIST", stk: data.totalStock, amt:data.totalAmount, productList:data.list, noOfPages: data.noOfPages})
        //   dispatch({type:"UPDATE_PAGENO", value:1})
      })
    },[pageNo])

  const applyFilterHandler = ()=>{
    // console.log("filtering...");
    // console.log(pageNo);
    if (pageNo != 0) {
      dispatch({type:"UPDATE_PAGENO", value:1})
    }else{
      fetch(process.env.REACT_APP_NODE_ENV+"/getProductList?"+new URLSearchParams({pageNo,cat, brand, stock, active}))
      .then(res=>res.json())
      .then((data)=>{
        // console.log("**************");
        console.log(data);
        // console.log("**************");
        dispatch({type:"UPDATE_PRODUCT_LIST", stk: data.totalStock, amt:data.totalAmount, productList:data.list, noOfPages: data.noOfPages})
      })
    }
  }
    
  // useEffect(()=>{
  //     dispatch({type:"UPDATE_PAGENO", value:1})
  // },[cat, brand, stock, active]);


  const printBtnHandler = ()=>{
    if (cat === "/_default_/") {
      alert("Please Select A Category.")
    }else{
      navigate('stockBookPrint', {state:{cat, brand, stock, active}})
    }
  }

  const headerItems= (<>
  <button disabled={cat === "/_default_/"} onClick={printBtnHandler} className='btn btn-dark mr-2'>Print Stock Book</button>
  <button onClick={()=>{navigate('/productItem/addProducts')}} className='btn btn-dark'>Add Product</button>
  </>);
  
  const filterItems= (
    <div className={classes.filterItem}>
      {/* <form onSubmit={filterFormSubmitHandler} method="GET"> */}
        <select onChange={(e)=>{dispatch({type:"update_cat",value:e.target.value})}}
         name="catagory" defaultValue={"/_default_/"} className="custom-select" style={{maxWidth:"200px", marginLeft:"-7px"}}>
          <option value={"/_default_/"}>All Category</option>
          {categoryList.map((data)=>{
            var c=data.name.replace(/_/g, " " );
            c= c.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() +
              txt.substr(1).toLowerCase();});
            return(<option key={data.name} value={data.name}>{c}</option>);
            }
          )}
        </select>
        <select onChange={(e)=>{dispatch({type:"update_brand",value:e.target.value})}}
          name="brand_name" defaultValue={"/_default_/"} className="custom-select" style={{maxWidth:"200px"}}>
          <option value={"/_default_/"}>All Brand</option>
          {brandList.map((data,i)=>{
            var c=data.brand_name.replace(/_/g, " " );
            c= c.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() +
              txt.substr(1).toLowerCase();});
            return(<option key={i} value={data.name}>{c}</option>);
            }
          )}
        </select>
        <select onChange={(e)=>{dispatch({type:"update_stock",value:e.target.value})}}
          name="active" defaultValue={"/_default_/"} className="custom-select" style={{maxWidth:"200px"}}>
          <option value={"/_default_/"}>Select Stock</option>
          <option value="0">Low Stock</option>
          <option value="1">On Stock</option>
          <option value="2">High Stock</option>
        </select>
        <select onChange={(e)=>{dispatch({type:"update_active",value:e.target.value})}}
          name="active" defaultValue={"/_default_/"} className="custom-select" style={{maxWidth:"200px"}}>
          <option value={"/_default_/"}>Select Active or Inactive</option>
          <option value="1">Active</option>
          <option value="0">Inactive</option>
        </select>
        <button className="btn btn-outline-dark btn-sm" onClick={applyFilterHandler}>Filter</button>
        No of Stock:<strong className="text-danger">
          {stk}
        </strong> Stock Value:<strong className="text-danger">₹ {amt}</strong>
      {/* </form> */}
    </div>
  );
  
  return (
    <div  className="d-flex pb-5" id="wrapper">
      <Table
        title='Products List'
        headerItems={headerItems}
        rowURL="/productItem/"
        filterItems={filterItems}
        thData={["Name", "Category","Brand","Stock", "Min Stock","Max Stock","MRP","Amount"]}
        trData={productList}
        dispatch={dispatch}
        pageNo={pageNo}
        noOfPages={noOfPages}
        
       />
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
  }
  console.log(obj);
  console.log(request.method);
  const res = await fetch(process.env.REACT_APP_NODE_ENV+'/createNewProduct', {
    method: request.method,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(obj)
  })
  const ret = await res.json();
  console.log(ret);
  if (ret.done==true || ret.done==='true') {
      return redirect("/productItem/"+ret.id)
  } else {
    throw "Cannot create the product";
  }
}
