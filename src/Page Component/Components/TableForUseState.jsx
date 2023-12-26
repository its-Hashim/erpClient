import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import  PropTypes  from "prop-types";
import classes from "./Table.module.css"

function TableForUseState(props) {
  const navigate = useNavigate();
  const [goToValue, setGoToValue] = useState(1);
  const clickButton = (e)=>{
    // console.log(e);
    if(goToValue >= 1 && goToValue <= props.noOfPages){
      if(e.keyCode === 13){
        props.setPageNo((goToValue-1));
      }
    }
    else{

      alert("Page Number Not Valid");
    }
  };
  
  const click = (e)=>{
    // console.log(e);
    if(goToValue >= 1 && goToValue <= props.noOfPages){
      // if(e.keyCode === 13){
        props.setPageNo((goToValue-1));
      // }
    }
    else{
      alert("Page Number Not Valid");
    }
  };

  const clickEvent = (data,e)=>{
    if(props.rowURL){
      if (data.id != null && data.hide_url == null) {
        navigate(props.rowURL+data.id);
      }else if(data.hide_url != null){
        // console.log(data.hide_url);
        navigate(props.rowURL+data.hide_url);
      }
    }
  }
  return (
    <div id="page-content-wrapper">
      <div className="container-fluid">
        <div className="card">
          <div className="card-header">
            <div className={classes.cardHeader}>
              <div>
              <div>
                <p className="display-4 card-heading">{props.title}</p>
              </div>
              </div>
              <div>
                {(props.headerItems) && props.headerItems}
              </div>
            </div>
            {(props.filterItems) && <div style={{marginTop:"15px"}}>
              {(props.filterItems) && props.filterItems}
            </div>}
          </div>

          <table className="table table-striped table-hover">
            <thead className="thead-dark">
              <tr>
                {props.thData.map((data,i)=><th key={i} scope="col">{data}</th>)}
              </tr>
            </thead>
            <tbody>
              {props.trData.map((data,i)=>{
                return (
                  // <tr onclick="window.location = '/clients/<%= client.client_id %>'">
                  <tr key={i} onClick={(e)=>{clickEvent(data,e)}}>
                    {Object.entries(data).map(function(data, index) {
                      if (data[0].split('_')[0] === 'hide') {

                      } else if (index === 0) {
                        return (
                          <th key={`${data[0]}${i}${data[1]}`} scope="row">{data[1]}</th>
                        )
                      }else{
                        return(
                          <td key={`${data[0]}${i}${data[1]}`}>{data[1]}</td>
                        )
                      }
                      return (<></>) ;
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="card-footer d-flex justify-content-between align-items-center">

          <div className="form-inline">
            <button className='btn btn-outline-dark font-weight-bold '
            disabled={(props.pageNo === 0)? true :false} onClick={(e)=>{props.setPageNo(+props.pageNo-1)}}>Prev</button>
            <span style={{margin:"20px"}}>Showing {Number(props.pageNo)+1} of {props.noOfPages}</span>
            <button className='btn btn-outline-dark font-weight-bold '
            disabled={(props.pageNo < props.noOfPages-1)?false:true} onClick={()=>{props.setPageNo(+props.pageNo+1)}}>Next</button>  
            <label style={{marginLeft:"50px"}} htmlFor="">Goto:</label>
            <input className='form-control mb-2 mr-sm-2'
            style={{margin:"10px", maxWidth:"70px"}} type="number" min="1" value={goToValue} onKeyDown={clickButton} onChange={(e)=>{setGoToValue(e.target.value)}} />
            <button className='btn btn-outline-dark font-weight-bold' onClick={click}>Go</button>
          </div>
          <div >
            {(props.footerAction) && props.footerAction}
          </div>

        </div>
      </div>
    </div>
  )
}


TableForUseState.propTypes = {
  title:PropTypes.string.isRequired,
  thData: PropTypes.array.isRequired,
  trData: PropTypes.array.isRequired,
  setPageNo: PropTypes.func.isRequired,
  pageNo: PropTypes.number.isRequired,
  noOfPages: PropTypes.number.isRequired,
};

export default TableForUseState