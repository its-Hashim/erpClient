import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import * as XLSX from 'xlsx';

function AddNewProductBatche(props) {
  const {name:cat} = useParams()
  const inputRef = useRef(null)
  const [specsList, setSpecsList] = useState([]);
  // const [selectedFile, setSelectedFile] = useState();
  const [alerts, setAlerts] = useState([]);

  const [typeError, setTypeError] = useState(null);
  const [excelData, setExcelData] = useState(null);

  // console.log(excelData);

  
  // console.log(selectedFile);

  useEffect(async() => {
    
    try {
      const res = await fetch(process.env.REACT_APP_NODE_ENV+'/getFeilds/'+cat)
      const data = await res.json();
      let specs = [];
      data.result.forEach(e => {
        // let spec =e.Field.replace(/_/g, " " );
        let spec =e.Field;
        // spec.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
        if (spec != "specs_id") {
          specs.push(spec)
        }
      });
      setSpecsList(specs);
    } catch (error) {
      alert(error)
    }
  }, [])
  


  const downloadTemplateBtnHandler = async ()=>{

    try {
      
      const response = await axios({
        url: (process.env.REACT_APP_NODE_ENV+'/addNewProductBatche/'+cat),
        method: 'GET',
        responseType: 'blob',
      })
      if (response.status != 200) {
        alert(await response.json())
        alert(response.status)
        
      }else{
        const url = window.URL.createObjectURL(response.data);
        const link = document.createElement('a');
        link.href = url;
        // link.download = "adf";
        const contentDisposition =
        response.headers['content-disposition'];
        // console.log(response.headers);
        // console.log(contentDisposition);
        let fileName = "template";
        if (contentDisposition) {
          const fileNameMatch =
            contentDisposition.match(/filename="(.+)"/);
          console.log('fileNameMatch', fileNameMatch);
          if (fileNameMatch.length === 2) {
            fileName = fileNameMatch[1];
          }
        }
        link.download = fileName;
        link.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      alert(error)
    }
    // fetch(process.env.REACT_APP_NODE_ENV+'/addNewProductBatche/'+cat)
    // .then( (res) => {
    //   const header = res.headers.get('Content-Disposition');
    //   console.log(res.headers);
    //     // const parts = header.split(';');
    //     // let filename = parts[1].split('=')[1].replaceAll("\"", "");
    //     console.log(header);
    //   return(res.blob())
    // } )
    // .then( blob => {
    //   var file = window.URL.createObjectURL(blob);
    //   window.location.assign(file);
    // })
    // .catch ((error)=>{
    //     alert(error)
    // })  
  }

  // const onFileChange = (event) => {
  //     setSelectedFile(event.target.files[0])
  //     const formData = new FormData();
 
  //       // Update the formData object
  //       formData.append(
  //           "myFile",
  //           event.target.files[0],
  //           event.target.files[0].name
  //       );
 
  //       // Details of the uploaded file
  //       console.log(selectedFile);
 
  //       // Request made to the backend api
  //       // Send formData object
  //       const res  = axios.post(process.env.REACT_APP_NODE_ENV+'/batchProductUpload/'+cat, formData);
  // };


  const handleFile=(e)=>{
    let fileTypes = ['application/vnd.ms-excel','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','text/csv'];
    let selectedFile = e.target.files[0];
    if(selectedFile){
      if(selectedFile&&fileTypes.includes(selectedFile.type)){
        setTypeError(null);
        let reader = new FileReader();
        reader.readAsArrayBuffer(selectedFile);
        reader.onload=(e)=>{
          const workbook = XLSX.read(e.target.result,{type: 'buffer'});
          const worksheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[worksheetName];
          const data = XLSX.utils.sheet_to_json(worksheet);
          fetch(process.env.REACT_APP_NODE_ENV+'/batchProductUploadArray/'+cat, {
            method: "post",
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },

            //make sure to serialize your JSON body
            body: JSON.stringify(data)
          })
          .then( (res) => res.json())
          .then((data)=>{
            console.log(data);
            setExcelData(data);

          })
          
        }
      }
      else{
        // alert('Please select only excel file types');
        setAlerts([...alerts, 
          <div key={alerts.length+1} className="alert alert-danger alert-dismissible fade show" role="alert">
            <strong>Type Error </strong> {selectedFile.name} is not supported. Supports csv, xls, xlsx. 
            <button type="button" className="close" data-dismiss="alert" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
        ])
      }
    }
    else{
      // console.log('Please select your file');
      setAlerts([...alerts, 
        <div key={alerts.length+1} className="alert alert-warning alert-dismissible fade show" role="alert">
          Please select a file
          <button type="button" className="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      ])
    }
  }

  return (
    <div className="container pt-4 pb-5">
      <div key={alerts.length+1} className="alert alert-danger alert-dismissible fade show" role="alert">
        <strong>Development not done completely but will not crash...!</strong>
        <button type="button" className="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      {alerts}
      <div className="card">
        <div className="card-header">
          <div className="" style={{display: "flex", justifyContent: "space-between"}}>
            <div className='mb-2'>
              <p className="card-heading text-capitalize">add products for {cat}</p>
            </div>
          </div>
          <button className="btn btn-dark btn-sm" onClick={downloadTemplateBtnHandler}>Download Template</button>
          {/* <input 
            encType="multipart/form-data"
            ref={inputRef}
            type="file"
            style={{display:'none'}}
            onChange={onFileChange}
          />  */}

          <input
            type="file"
            ref={inputRef}
            style={{display:'none'}}
            onChange={handleFile} 
          />
          <button className="btn btn-dark btn-sm ml-3" onClick={()=>{inputRef.current.click()}}>Upload Excel</button>
        </div>
        { excelData && 
        <div className="table-responsive-xl">
          <table className="table table-striped table-hover table-sm table-responsive" 
          // style={{display: 'block', overflowX: 'auto', whiteSpace: 'nowrap'}}
          >
              <thead className="thead-dark">
                <tr>
                  <th>Name</th>
                  <th>Brand</th>
                  <th>MRP</th>
                  <th>CP</th>
                  <th>Unit</th>
                  <th>Qty/pc</th>
                  <th>Active</th>
                  <th>Stock</th>
                  <th>Min Stock</th>
                  <th>Default Stock</th>
                  {specsList.map((data,i)=><th key={i} className='text-capitalize' scope="col">{data}</th>)}
                  <th>Remark</th>
                </tr>
              </thead>
              <tbody>
                {
                  excelData.map((d,i)=>{

                    return(
                      <tr key={i}>

                        <td>{d.Name}</td>
                        <td>{d.Brand}</td>
                        <td>{d.MRP}</td>
                        <td>{d["Cost Price"]}</td>
                        <td>{d.Unit}</td>
                        <td>{d["Quantity Per Peice"]}</td>
                        <td>{d.Active}</td>
                        <td>{d.Stock}</td>
                        <td>{d["Min. Stock"]}</td>
                        <td>{d["Default Stock"]}</td>
                        {specsList.map((sp,i)=>
                          {
                            // console.log(sp);
                            return(<td key={i} className='text-capitalize' scope="col">{d[sp]}</td>)
                          }
                        )}
                        <td>{d.remark}</td>

                    </tr>
                    )

                  })
                }
                {/* {props.trData.map((data,i)=>{
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
                })} */}
              </tbody>
            </table>
          </div>
          }
          <div className="card-footer d-flex justify-content-between align-items-center"></div>
      </div>
    </div>
  )
}

export default AddNewProductBatche