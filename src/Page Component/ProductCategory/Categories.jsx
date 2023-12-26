import React, {useReducer} from 'react'
import { useLoaderData, useNavigate } from 'react-router-dom';
import classes from "../../Page Component/Components/Table.module.css"

function Categories() {
  const {data} = useLoaderData();
  const navigate = useNavigate();

  return (
    <div class="d-flex container">
      <div id="page-content-wrapper">
        <div class="copntainer-fluid">
          <div class="card">
            <div class="card-header">
            <div className={classes.cardHeader}>
              <div>
                <div>
                  <p className="display-4 card-heading">Catagory</p>
                </div>
                </div>
                <div>
                  <button onClick={()=>{navigate('/productsCatagory/add')}} className='btn btn-dark'>Add Category</button>
                </div>
              </div>
            </div>
            <table class="table table-striped table-hover">
              <thead class="thead-dark">
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Belongs To</th>
                </tr>
              </thead>
              <tbody>
                {data.map((element)=>{
                    let name=element.name.replace(/_/g, " " );
                    name=name.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
                  return(
                    <tr>
                        <th scope="row" onClick={()=>{navigate(`/productsCatagory/${element.name}`)}}>
                          {name}
                        </th>
                        <td>
                          {element.this_catagory_belongs_to}
                        </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <div class="card-footer"></div>
        </div>
      </div>

    </div>
  )
}

export const loader = async ()=>{
  const res = await fetch(process.env.REACT_APP_NODE_ENV+'/getCategoryList');
  return res;
}

export default Categories;