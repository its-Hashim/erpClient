import React, {useEffect, useState, useReducer} from 'react'
import Table from '../Components/Table';
import { useNavigate } from "react-router-dom";

function Clients() {

  const navigate = useNavigate();
  const [formData, setFormData] = useState("");
  const initialState = {
    pageNo: 0,
    clientsList: [],
    noOfPages:0,
    allClientsList:[]
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
        
      case 'UPDATE_CLIENTS_LIST':
        return{
          ...state,
          clientsList:action.value.clientsList,
          noOfPages: action.value.noOfPages,
        };
      
        case 'UPDATE_ALL_CLIENTS_LIST':
        return{
          ...state,
          allClientsList:action.allClientsList
        };

      default:
        return state
      
    }

  }


  const [{pageNo, clientsList, noOfPages,allClientsList}, dispatch] = useReducer(reducer, initialState);
  // console.log(clientsList); 

  useEffect(()=>{
    const getAllClientsList = ()=>{
      fetch(process.env.REACT_APP_NODE_ENV+'/getAllClientsList')
      .then(res=>res.json())
      .then((data =>{
        // console.log(data);
        dispatch({type:"UPDATE_ALL_CLIENTS_LIST",allClientsList:data.allClientsList})
      }))
    };

    getAllClientsList();

  },[])
  
  useEffect(() => {
    const fetchData = async()=>{
      const res = await fetch(process.env.REACT_APP_NODE_ENV+"/getClientsList?"+new URLSearchParams ({pageNo}));
      const data = await res.json();
      // console.log(data.clientsList);
      dispatch({type:'UPDATE_CLIENTS_LIST', value: {clientsList:data.clientsList, noOfPages: data.noOfPages}});
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
      navigate('/clients/transaction/'+data);
    }else{
      alert("Invalid Id")
    }
  }

  // const navigateToAddClient = (e)=>{
  //   e.preventDefault();
  //   navigate('/clients/add-client');
  // }

  
  const addClientBtnHandler = ()=>{
    navigate("/clients/add-client");
  }

  const headerItems = (
    <div className="d-flex justify-content-end">
      <form onSubmit={formSubmitHandler} className="form-inline" id="cForm">
        <input type="text" className="form-control mr-2" list="client_list" 
          id="select_client" name="client"
          value={formData}
          onChange={e=>{setFormData(e.target.value)}}
          autoFocus={true} />
        <button className="btn btn-outline-dark btn-sm">Search</button>
      </form>
      <form className="form-inline">
        <button onClick={addClientBtnHandler} type='button' className="btn btn-dark btn-sm ml-2">Add Client</button>
      </form>
      <datalist dir="rtl" id="client_list">
        {allClientsList.map((client=>{
          var c=client.name.replace(/_/g, " " );
          return(
            <option key={client.client_id}>{client.client_id} {" : "} {c.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() +
              txt.substr(1).toLowerCase();})} {client.mobile_no}</option>
              )
            }))}
      </datalist>
    </div>
  );


  return (
    <div className="d-flex" id="wrapper">
      <Table 
            title="Client List"
            rowURL="/clients/transaction/"
            headerItems={headerItems}
            thData={["ID","Name","Mobile","Address","City","State"]}
            trData={clientsList}
            dispatch={dispatch}
            pageNo={pageNo}
            noOfPages={noOfPages}
          />
    </div>
  )
}

export default Clients