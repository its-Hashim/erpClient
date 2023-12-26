import JsBarcode from 'jsbarcode';
import jsPDF from 'jspdf';
import React, { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import css from "./index.module.css"

export default function StockBookPrint() {
  const [productList, setProductList] = useState([]);
  const [printState, setPrintState] = useState(false)
  const [string, setString] = useState("Stock Book Print");
  const [catDetails, setCatDetails] = useState([]);
  const location = useLocation();
  const pdfRef = useRef();
  // console.log(location.state);
  const {cat, brand, stock, active} = location.state;
  // console.log(cat, brand, stock, active);
  // console.log(productList);

  useEffect(async() => {
    
    fetch(process.env.REACT_APP_NODE_ENV+"/getProductListForStockBook?"+new URLSearchParams({cat, brand, stock, active}))
    .then(res=>res.json())
    .then((data)=>{
      // console.log(data);
      setProductList(data.list);
      setCatDetails(data.catDtls[0]);
    });
  }, [cat, brand, stock, active])

  const upBtnHandler = (e)=>{
    let id = e.target.id;
    // console.log(id);
    let productList2 = [...productList];
    console.log(productList);
    if(id != 0){
      const b = productList2[id];
      productList2[id] = productList2[id-1];
      productList2[id-1] = b;
    }
    setString(string+" ");
    setProductList(productList2);
  };
  
  
  const dnBtnHandler = (e)=>{
    const id = e.target.id;
    // console.log(id);
    // console.log("original product list",productList);
    let productList2 = [...productList];
    // console.log("Duplicated Product List",productList2);
    if(id != (productList.length-1)){
      let b = productList[id];
      // console.log(b);
      productList2[id] = productList2[+id+1];
      // console.log(productList2);
      productList2[+id+1] = b;
      // console.log(productList2);
    }
    // console.log(productList2);
    setString(string+" ");
    setProductList(productList2);
  };

  const disabledPrintBtn = ()=>{

    setString(string+" ");
    setPrintState(true);
    setString(string+" ");
  }
  
  const enablePrintBtn = ()=>{
    setString(string+" ");
    setPrintState(false);
    setString(string+" ");

  }
  
  function  printBtnHandler() {
    
    disabledPrintBtn();
    // console.log(printState);
    // Generate a barcode using JsBarcode library
    let pdf = new jsPDF('p', 'mm', [297,210]);
    // console.log(productList);
    let k=0;
    productList.forEach((data,i)=>{
      JsBarcode(pdfRef.current, data.product_id, {
        format: 'CODE128',
        displayValue: false,
      });
      
      // Get the barcode SVG element
      var img = new Image();
      const imageDataUrl = pdfRef.current.toDataURL('image/png');
      img.src = '/assets/brown-color-wooden-sheets-408.jpg';
      const y = k*58
      
      pdf.addImage(img, 'PNG', 10, 10+y, 40, 40);
      pdf.addImage(imageDataUrl, 'PNG', 62, 9+y, 70, 12);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(12);
      // pdf.setFontType("bold");
      pdf.text(data.product_name, 65, 25+y)
      pdf.setFont("helvetica", "normal"); 
      // pdf.setFontType("normal");
      // const tt = (catDetails.label_feature_alias_1===null?"":catDetails.label_feature_alias_1)+data[catDetails.label_feature_1]+
      //     ", "+
      //     (catDetails.label_feature_alias_2===null?"":catDetails.label_feature_alias_2)+data[catDetails.label_feature_2]+
      //     ", "
      //     (catDetails.label_feature_alias_3===null?"":catDetails.label_feature_alias_3)+data[catDetails.label_feature_3]
      
      let tt = catDetails.label_feature_alias_1===null?"":catDetails.label_feature_alias_1+data[catDetails.label_feature_1];
      // console.log(tt);
      pdf.text( tt,65, 30+y)
      pdf.text("Quantity per pc: "+data.per_peice_quantity, 65, 35+y)
      pdf.text("Rate: "+data.mrp+" per "+data.unit, 65, 40+y)
      pdf.text("MRP: Rs. "+(+data.mrp*+data.per_peice_quantity), 65, 45+y)
      pdf.text("Stock:", 65, 50+y)
      k++;
      if (k >= 5)
      {
        pdf.addPage();
        k=0;
      }
      // console.log(i);
      if(i+1 == productList.length){
        // console.log("last done");
        console.log(printState);
      }
    });
    pdf.output('save', cat+'_book.pdf'); 
    enablePrintBtn();
    setString(string+" ");
  }
  

  return (
    <div  className="d-flex pb-5" id="wrapper">
      <div className="container card pt-2 mt-5">

      <div className="card-header">
        <h1 className='display-4 text-capitalize' style={{fontSize:"32px", float:"left"}}>{string} {cat}</h1>
        <button className='btn btn-dark float-right' disabled={printState} onClick={printBtnHandler}>Print</button>
      </div>
  
      <table className="table">
        <thead className='thead-dark'>
          <tr>
            <th scope="col">#</th>
            <th scope="col"></th>
            <th scope="col"></th>
            <th scope="col">Name</th>
            <th scope="col">Brand</th>
            <th scope="col">Rate</th>
            <th scope="col">{catDetails.label_feature_alias_1}</th>
            <th scope="col">{catDetails.label_feature_alias_2}</th>
            <th scope="col">{catDetails.label_feature_alias_3}</th>
          </tr>
        </thead>
        <tbody>
          {productList.map((data, i)=>{return (
            <tr key={i} >
              <th>{i}</th>
              <td><button className='btn btn-sm btn-dark' disabled={i==0} id={i} onClick={upBtnHandler}>UP</button></td>
              <td><button className='btn btn-sm btn-dark' disabled={i==(productList.length-1)} id={i} onClick={dnBtnHandler}>DN</button></td>
              <td>{data.product_name}</td>
              <td>{data.brand_name}</td>
              <td>{data.mrp}</td>
              <td>{data[catDetails.label_feature_1]}</td>
              <td>{data[catDetails.label_feature_2]}</td>
              <td>{data[catDetails.label_feature_3]}</td>
            </tr>
          )})}
        </tbody>
      </table>
      </div>
      <canvas ref={pdfRef} style={{ display: 'none' }} />
    </div>
  )
}
