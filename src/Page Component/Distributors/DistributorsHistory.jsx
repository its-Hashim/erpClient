import React, {useReducer, useEffect} from "react";
import { useParams} from "react-router-dom";
import Table from "../Components/Table";
// import ClientDetails from "./ClientDetails";
import {useLoaderData} from 'react-router-dom'



const DistributorsHistory = ()=>{
  const {id} = useParams();
  const initialState = {
    pageNo: 0,
    list: [],
    noOfPages:0,
    name:"",
    showDetails:false,
  };

  const details = useLoaderData();

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
        
      case 'UPDATE_LIST':
        return{...state, list:action.value.list, noOfPages: action.value.noOfPages, name: action.value.name, details:action.value.details};
      
      case 'TOGGLE_SHOW_DETAILS':
        return{...state, showDetails: !state.showDetails}

      default:
        return state
      
    }

  };


  const [{pageNo, list, noOfPages, name, showDetails}, dispatch] = useReducer(reducer, initialState);
  // console.log(list); 

  useEffect(() => {
    const fetchData = async()=>{
      const res = await fetch(process.env.REACT_APP_NODE_ENV+"/getAllDistributorsHistory?"+new URLSearchParams ({pageNo,id}));
      const data = await res.json();
      console.log(data.details);
      dispatch({type:'UPDATE_LIST', value: {list:data.list, noOfPages: data.noOfPages,name: data.name, details:data.details}});
    }
    try{
      fetchData();
    }catch(e) {
      alert("unable to connet to server");
    }
    
  }, [pageNo,dispatch,id]);


  const detailsButton = <button onClick={()=>{dispatch({type:'TOGGLE_SHOW_DETAILS'})}} className="btn btn-dark btn-ms">{!showDetails ? "Show Details" : "Hide Details"}</button>;

  // const clientDetails =<ClientDetails title='Details' data={details}/> 


  return(
    <div className="container" style={{paddingBottom:"50px"}}>
      <div style={{display:"block"}}>
        {/* <Table 
          title={`${ (name === "" || name === null)? "Customer Not Found": (name+ 's Transactions') }`}
          headerItems={detailsButton}
          // filterItems={showDetails && clientDetails}
          rowURL="/"
          thData={["Sales or Paymet","Date","Debit","Credit"]}
          trData={list}
          dispatch={dispatch}
          pageNo={pageNo}
          noOfPages={noOfPages}
        /> */}
      </div>
    </div>
  )
}

export default DistributorsHistory;

export const loader = async({params})=>{
  console.log(params);
  const res = await fetch(process.env.REACT_APP_NODE_ENV+"/getDistributorsDetails?"+new URLSearchParams ({id:params.id}));
  return res;
}