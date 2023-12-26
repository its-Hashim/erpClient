import React, {useEffect, useState, useReducer} from 'react'
import Table from '../Components/Table';
import { useNavigate } from "react-router-dom";

function Distributors() {

  const navigate = useNavigate();
  const [formData, setFormData] = useState("");
  const initialState = {
    pageNo: 0,
    distributorsList: [],
    noOfPages:0,
    allDistributorsList:[]
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
        
      case 'UPDATE_DISTRIBUTORS_LIST':
        return{
          ...state,
          distributorsList:action.value.distributorsList,
          noOfPages: action.value.noOfPages,
        };
      
        case 'UPDATE_ALL_DISTRIBUTORS_LIST':
        return{
          ...state,
          allDistributorsList:action.allDistributorsList
        };

      default:
        return state
      
    }

  }


  const [{pageNo, distributorsList, noOfPages,allDistributorsList}, dispatch] = useReducer(reducer, initialState);
  // console.log(clientsList); 
  // console.log(distributorsList);
  // console.log(allDistributorsList);

  useEffect(()=>{
    const getAllClientsList = ()=>{
      fetch(process.env.REACT_APP_NODE_ENV+'/getAllDistributorsList')
      .then(res=>res.json())
      .then((data =>{
        // console.log(data);
        dispatch({type:"UPDATE_ALL_DISTRIBUTORS_LIST",allDistributorsList:data.allDistributorsList})
      }))
    };

    getAllClientsList();

  },[])
  
  useEffect(() => {
    const fetchData = async()=>{
      const res = await fetch(process.env.REACT_APP_NODE_ENV+"/getDistributorsList?"+new URLSearchParams ({pageNo}));
      const data = await res.json();
      // console.log(data);
      dispatch({type:'UPDATE_DISTRIBUTORS_LIST', value: {distributorsList:data.distributorsList, noOfPages: data.noOfPages}});
    }
    try{
      fetchData();
    }catch(e) {
      alert("unable to connet to server");
    }
  }, [pageNo,dispatch]);

  const formSubmitHandler = (e)=>{
    e.preventDefault();
    var data = formData.split(' ')[0]
    if(typeof(Number(data)) == 'number'){
      navigate('/distributor/transaction/'+data);
    }else{
      alert("Invalid Id")
    }
  }

  // const navigateToAddClient = (e)=>{
  //   e.preventDefault();
  //   navigate('/clients/add-client');
  // }

  
  const addClientBtnHandler = ()=>{
    navigate("/distributor/add");
  }

  const headerItems = (
    <div className="d-flex justify-content-end">
      <form onSubmit={formSubmitHandler} className="form-inline" id="cForm">
        <input type="text" className="form-control mr-2" list="dist_list" 
          id="select_dist" name="dist"
          value={formData}
          onChange={e=>{setFormData(e.target.value)}}
          autoFocus={true} />
        <button className="btn btn-outline-dark btn-sm">Search</button>
      </form>
      <form className="form-inline">
        <button onClick={addClientBtnHandler} type='button' className="btn btn-dark btn-sm ml-2">Add Distributors</button>
      </form>
      <datalist dir="rtl" id="dist_list">
        {allDistributorsList.map((dist=>{
          var c=dist.name.replace(/_/g, " " );
          return(
            <option key={dist.distributor_id}>{dist.distributor_id} {" : "} {c.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() +
              txt.substr(1).toLowerCase();})}</option>
              )
            }))}
      </datalist>
    </div>
  );


  return (
    <div className="d-flex" id="wrapper">
      <Table 
            title="Distributors List"
            rowURL="/distributor/transaction/"
            headerItems={headerItems}
            thData={["ID","Name","Address","District","State", "Postal Code"]}
            trData={distributorsList}
            dispatch={dispatch}
            pageNo={pageNo}
            noOfPages={noOfPages}
          />
    </div>
  )
}

export default Distributors;