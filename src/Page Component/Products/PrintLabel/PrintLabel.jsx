import React, { useEffect, useState, useRef } from 'react'
import { jsPDF } from "jspdf"
import JsBarcode from 'jsbarcode';
import classes from './label.module.css'
import QRCode from 'qrcode';
import { useLoaderData } from 'react-router-dom';

function PrintLabel() {
  const [string, setString] = useState(null);
  const [numberOfLabel, setNumberOfLabel] = useState(1);
  const [quantity, setQuantity] = useState(1);
  const [lableFor, setLableFor] = useState("book");
  const [pdf, setPdf] = useState();
  const pdfRef = useRef();

  const loaderData= useLoaderData();

  console.log(loaderData);


  


  useEffect(() => {
    updatePDF();
  }, []);

  const updatePDF = ()=>{
    const fetchData = async ()=>{
      let pdf = new jsPDF('p', 'mm', [297,210]);
      if (lableFor === "packet")
      {
        pdf = await getPDFForPacket(pdf);
      }else{
        pdf = await getPDFForStockBook(pdf);
      }
      // setSaleId(data.saleDetails.sale_id);
      setPdf(pdf);
      
      setString(pdf.output('datauristring'));
    }
    try {
      fetchData();
    } catch (error) {
      alert("unable to load data");
    }
  }

  const print = () =>{
    pdf.autoPrint();
    setString(pdf.output('datauristring'));
  }


  async function  getPDFForStockBook(pdf) {
    

    // Generate a barcode using JsBarcode library
    JsBarcode(pdfRef.current, loaderData.id, {
      format: 'CODE128',
      displayValue: false,
    });

    // Get the barcode SVG element
    var img = new Image();
    const imageDataUrl = pdfRef.current.toDataURL('image/png');
    img.src = '/assets/brown-color-wooden-sheets-408.jpg';


    pdf.addImage(img, 'PNG', 10, 10, 40, 40);
    pdf.addImage(imageDataUrl, 'PNG', 62, 9, 70, 12);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(12);
    // pdf.setFontType("bold");
    pdf.text(loaderData.name, 65, 25)
    pdf.setFont("helvetica", "normal");
    // pdf.setFontType("normal");
    pdf.text(
        (loaderData.alias1===null?"":loaderData.alias1)+loaderData.property1+
        ", "+
        (loaderData.alias2===null?"":loaderData.alias2)+loaderData.property2+
        ", "+
        (loaderData.alias3===null?"":loaderData.alias3)+loaderData.property3,
      65, 30)
    pdf.text("Quantity per pc: "+loaderData.per_peice_quantity, 65, 35)
    pdf.text("Rate: "+loaderData.mrp+" per "+loaderData.unit, 65, 40)
    pdf.text("MRP: Rs. "+(+loaderData.mrp*+loaderData.per_peice_quantity), 65, 45)
    pdf.text("Stock:", 65, 50)
    return pdf;
  }
  

  async function getPDFForPacket(pdf) {
    let c = 0;
    let i = 0;
    let j = 0;
    // console.log(numberOfLabel);
    while (c<numberOfLabel){

      // const str = await QRCode.toDataURL(loaderData.id);
      const str = await QRCode.toDataURL(loaderData.id+"#"+12+"#"+121);
      pdf.setFont("helvetica");
      pdf.setFontSize(10);
      pdf.addImage(str, 'PNG', i*70, (j*29.7)+8, 22 , 22);
      pdf.text((i*70)+3, ((j*29.7)+5), loaderData.name, { maxWidth: 63});
      pdf.text((i*70)+22, ((j*29.7)+4)+10, `Date: ${loaderData.mfd}`);
      pdf.text((i*70)+22, ((j*29.7)+4)+14, 'Qty: '+quantity+' pc');
      pdf.text((i*70)+22, ((j*29.7)+4)+18, (loaderData.alias1===null?"":loaderData.alias1)+loaderData.property1);
      pdf.text((i*70)+22, ((j*29.7)+4)+22, (loaderData.alias2===null?"":loaderData.alias2)+loaderData.property2);

      c++;
      i++;
      if(i>2){
        j++;
        i =0;

      }

    }
    // Generate a barcode using JsBarcode library
    // pdf.text('Name of the product which may be long and width', 50,50)
    
    pdf.line(70,0,70,297);
    pdf.line(140,0,140,297);
    for(let i=1; i<=10;i++){
      pdf.line(0,29.7*i,210,29.7*i);
    }
    
    return pdf;
  }

  return (
    <>
      <div  className={classes.parent}> 
          <iframe src={string}  title="bill" name='billpdf' id="billpdf" />
          <div className='ml-5'>
            <h5>Label for : </h5>

            <div className="form-check">
              <input className="form-check-input" type="radio" name="exampleRadios" id="exampleRadios1" value="book" 
                onChange={(e)=>setLableFor(e.target.value)}
                checked={lableFor === "book"}
              />
              <label className="form-check-label" htmlFor="exampleRadios1">
                Stock Book
              </label>
            </div>
            <div className="form-check">
              <input className="form-check-input" type="radio" name="exampleRadios" id="exampleRadios2" value="packet" 
                checked={lableFor === "packet"}
                onChange={(e)=>setLableFor(e.target.value)}
              />
              <label className="form-check-label mb-3" htmlFor="exampleRadios2">
                Packet
              </label>
            </div>

            { lableFor==='packet' && (
              <>
                <label  htmlFor="numOfLabel"><h5>Number of labels : </h5></label>
                <input className='form-control mb-3' type="number" onChange={n=>{setNumberOfLabel(n.target.value)}} value={numberOfLabel} id='numOfLabel' />
                
                <label  htmlFor="quantityPerEachLabel"><h5>Quantity Per Each Label : </h5></label>
                <input className='form-control mb-5' type="number" onChange={n=>{setQuantity(n.target.value)}} value={quantity} id='quantityPerEachLabel' />
              </>
            )}

            <button type="button" onClick={updatePDF}  className="btn btn-secondary btn-lg btn-block">Update</button>
            <button type="button" onClick={print} className="btn btn-danger btn-lg btn-block">Print</button>
            {/* <button type="button"  className="btn btn-secondary btn-lg btn-block">Move to Cart</button> */}
          </div>
      </div>

      <canvas ref={pdfRef} style={{ display: 'none' }} />
    </>
  )
}

export default PrintLabel

export const loader = async({request, params})=>{

  const res = await fetch(process.env.REACT_APP_NODE_ENV+'/getLabelDetails/'+params.id);
  
  return res;
}