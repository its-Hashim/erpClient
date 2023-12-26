import React, { useEffect, useRef, useState } from 'react'
import QRCode from 'qrcode';
import jsPDF from 'jspdf'
import { useParams } from 'react-router-dom'

function PrintPurchaseLabel() {

  const [purchaseList, setPurchaseList] = useState([])
  const [printState, setPrintState] = useState(false)
  const [date, setDate] = useState("")
  const pdfRef = useRef();
  

  const {id:purchaseId} = useParams();
  // console.log("adsfasdf");
  // console.log(purchaseList);

  useEffect(() => {
    fetch(process.env.REACT_APP_NODE_ENV+"/getPurchaseLabelDetails?"+new URLSearchParams({purchaseId}))
    .then(res=>res.json())
    .then((data)=>{
      // console.log(data);
      data.purchaseList.pop();
      // data.pop();
      const {date:tDate} = data.purchaseList.pop()[0];
      setDate(tDate.split('T')[0])
      setPurchaseList(data.purchaseList)
    });
  },[])

  const disabledPrintBtn = ()=>{

    setPrintState(true);
  }
  
  const enablePrintBtn = ()=>{
    setPrintState(false);

  }
  
  // const printBtnHandler = ()=>{}
  const printBtnHandler = async ()=>{
    let i=0, j=0, c=0;
    disabledPrintBtn();
    // console.log(printState);
    // Generate a barcode using JsBarcode library
    let pdf = new jsPDF('p', 'mm', [297,210]);
    pdf.setFont("helvetica");
    pdf.setFontSize(10);
    // console.log(productList);
    for (let index = 0; index < purchaseList.length; index++) {
      const e = purchaseList[index][0];
      // console.log(e);
      for(let n=1; n<=e.packets; n++){
        // console.log(e);
        const str = await QRCode.toDataURL(e.id+"#"+(e.quantity/e.packets).toFixed(2));
        pdf.addImage(str, 'PNG', i*70, (j*29.7)+8, 22 , 22);
        pdf.text((i*70)+3, ((j*29.7)+5), e.product_name, { maxWidth: 63});
        pdf.text((i*70)+22, ((j*29.7)+4)+10, `Date: ${date}`);
        pdf.text((i*70)+22, ((j*29.7)+4)+14, 'Qty: '+(e.quantity/e.packets).toFixed(2)+' pc, MRP: ' +e.actual_mrp*e.per_peice_quantity*+(e.quantity/e.packets).toFixed(2));
        pdf.text((i*70)+22, ((j*29.7)+4)+18, (e.label_feature_alias_1+e[e.label_feature_1] ? e.label_feature_alias_1+e[e.label_feature_1]:  ""));
        pdf.text((i*70)+22, ((j*29.7)+4)+22, (e.label_feature_alias_2+e[e.label_feature_2] ? e.label_feature_alias_2+e[e.label_feature_2] : ""));

        i++;
        if(i>2){
          j++;
          i =0;

        }
        c++;
        if(c>= 30){
          pdf.line(70,0,70,297);
          pdf.line(140,0,140,297);
          for(let i=1; i<=10;i++){
            pdf.line(0,29.7*i,210,29.7*i);
          }
          pdf.addPage();
          c=0;
          j=0;
        }
      }
    }
    pdf.line(70,0,70,297);
    pdf.line(140,0,140,297);
    for(let i=1; i<=10;i++){
      pdf.line(0,29.7*i,210,29.7*i);
    }
    pdf.output('save', purchaseId+'.pdf'); 
    enablePrintBtn();
  }

  return (
    <>
    <div  className="d-flex pb-5" id="wrapper">
      <div className="container card pt-2 mt-5">
        <div className="card-header">
          <h1 className='display-4 text-capitalize' style={{fontSize:"32px", float:"left"}}>Print Label for purchase</h1>
          <button className='btn btn-dark float-right' onClick={printBtnHandler}>Print</button>
        </div>

        <table className="table">
          <thead className='thead-dark'>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Packets</th>
              <th scope="col">Name</th>
              <th scope="col">Brand</th>
              <th scope="col">Rate</th>
              <th scope="col">Qty</th>
              <th scope="col">feature 1</th>
              <th scope="col">feature 2</th>
            </tr>
          </thead>
          <tbody>
            {purchaseList.map((data,i)=>{
              // console.log(data);
              return(
              <tr key={i} >
              <th>{i}</th>
              {/* <td><button className='btn btn-sm btn-dark' disabled={i==0} id={i} onClick={upBtnHandler}>UP</button></td> */}
              {/* <td><button className='btn btn-sm btn-dark' disabled={i==(productList.length-1)} id={i} onClick={dnBtnHandler}>DN</button></td> */}
              <td><input type="number" 
                    style={{maxWidth:"4rem"}} 
                    name="" id="" 
                    defaultValue={data[0].packets} 
                    onBlur={(e)=>{data[0].packets = e.target.value}} /></td>
              <td>{data[0].product_name}</td>
              <td>{data[0].brand_name}</td>
              <td>{data[0].mrp}</td>
              <td>{data[0].quantity}</td>
              <td>{data[0].label_feature_alias_1}{data[0][data[0].label_feature_1]}</td>
              <td>{data[0].label_feature_alias_2}{data[0][data[0].label_feature_2]}</td>
            </tr>
            )})}
          </tbody>
        </table>
        <canvas ref={pdfRef} style={{ display: 'none' }} />
      </div>
    </div>
    </>
  )
}

export default PrintPurchaseLabel