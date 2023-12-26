import React, { useEffect, useReducer } from 'react';
import Table from '../../Components/Table';

function Sale() {

  const initialState = {
    // period : "week",
    pageNo: 0,
    salesList: [],
    noOfPages:0,
  }

  const reducer = (state, action)=>{
    switch(action.type){
      case 'UPDATE_PERIOD':
        return{...state, period:action.value};

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
        
      case 'UPDATE_SALES_LIST':
        return{...state, salesList:action.value.salesList, noOfPages: action.value.noOfPages};

      default:
        return state
      
    }

  }


  // const [{period, pageNo, salesList, noOfPages}, dispatch] = useReducer(reducer, initialState);
  const [{pageNo, salesList, noOfPages}, dispatch] = useReducer(reducer, initialState);
  // console.log(salesList); 

  useEffect(() => {
    const fetchData = async()=>{
      const res = await fetch(process.env.REACT_APP_NODE_ENV+"/getSaleList?"+new URLSearchParams ({pageNo}));
      const data = await res.json();
      dispatch({type:'UPDATE_SALES_LIST', value: {salesList:data.salesList, noOfPages: data.noOfPages}});
    }
    try{
      fetchData();
    }catch(e) {
      console.log("unable to connet to server");
    }
  }, [pageNo,dispatch]);

  // const periodChangeHandler = (e)=>{
  //   dispatch({type: 'UPDATE_PERIOD', value:e.target.value});
  // };


  return (
    <>
      <div className="container">
        <div className="row">
          {/* <div className="col-lg"><canvas id="myChart"></canvas></div>
          <div className="col-lg"><canvas id="myChart2" ></canvas></div> */}
          {/* <div className="col-lg"><canvas id="myChart" style="height: 360px; width: 90%;"></canvas></div>
          <div className="col-lg"><canvas id="myChart2" style="height: 360px; width: 90%;"></canvas></div> */}
        </div>
        <div className="d-flex" id="wrapper" style={{paddingBottom:"50px"}}>
          <Table 
            title="Sales List"
            rowURL="/salesList/bill/show/"
            thData={["ID","Date","Clients Name","Total Amount","Paid"]}
            trData={salesList}
            dispatch={dispatch}
            pageNo={pageNo}
            noOfPages={noOfPages}
          />
        </div>
      </div>
    </>
  )
}

export default Sale;