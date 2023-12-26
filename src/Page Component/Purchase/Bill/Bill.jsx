import React, {useState, useEffect} from 'react'
import { useSelector } from 'react-redux'
import {useNavigate, useParams} from 'react-router-dom'
import { jsPDF } from "jspdf";
import classes from './bill.module.css'

function Bill(props) {

  const cartNo = useSelector( state => state.cart.cartNo);
  const navigate = useNavigate();
  const [string, setString] = useState(null);
  const [pdf, setPdf] = useState();
  const [saleId, setSaleId] = useState();
  const {id, prints} = useParams();
  // pdf.autoPrint();
  useEffect(() => {
    const fetchData = async ()=>{
      const res =await fetch(process.env.REACT_APP_NODE_ENV+"/getBillDetails?"+new URLSearchParams ({id:(id)}));
      const data = await res.json();
      const pdf = getPDF(data);
      setSaleId(data.saleDetails.sale_id);
      setPdf(pdf);
      if (prints === 'print') {
        pdf.autoPrint();
      }
      setString(pdf.output('datauristring'));
    }
    try {
      fetchData();
    } catch (error) {
      alert("unable to load data");
    }
  }, [id]);
  
  
  
  const save = () =>{
    pdf.save(('Invoice_saleID.pdf'));
  }
  
  const print = () =>{
    pdf.autoPrint();
    setString(pdf.output('datauristring'));
  }

  const moveToCart = ()=>{
    const moveItemsToCart = async ()=>{
      const res =await fetch(process.env.REACT_APP_NODE_ENV+"/fillCartFromBill?"+new URLSearchParams ({cartNo, saleId}));
      const data = await res.json();
      if (data.success) {
        navigate('/');
      } else {
        alert("Unable to fill cart please contact support"+data.err)
      }
    }
    try {
      moveItemsToCart();
    } catch (error) {
      alert("unable to move contact support");
    }
  }

  function getPDF({soldProducts, saleDetails, previousDue, subtotal}) {
    const pdf = new jsPDF('p', 'mm', [210 , 148]);
    var total = subtotal + previousDue + saleDetails.shipping - saleDetails.summery_discount;
    if(saleDetails.tax === 1) total = Number(total)+ Number(Number(subtotal * 0.18).toFixed(1));
    var img = new Image();
    img.src = '/assets/logo.jpg';
    let startY = 70;
    let finalY = 165;
    var breakY = 160;
    if(saleDetails.tax === 1) {
      finalY = 160;
      breakY = 155
    };
    function decor() 
    {
        pdf.addImage(img, 'jpeg', 7, 7, 37, 19);
        pdf.setFont("helvetica");
        pdf.setFontSize(9);
        pdf.setFont(undefined,"bold");
        pdf.setTextColor(0, 0, 0);
        pdf.text(saleDetails.name, 7, 40);
        pdf.text('Royal Plywood', 51, 9);
        pdf.setFont(undefined,"normal");
        pdf.text('NH6, Panskura, Purba Mednapur', 51, 13);
        pdf.text('West Bengal, 721139', 51, 17);
        pdf.text('+91 8013787177', 51, 21);
        pdf.text('+91 9432971771', 51, 25);
        pdf.text('skhasemali49@gmail.com', 51, 29);
        pdf.text('Bill To:', 7, 36);
        // pdf.text(String(saleDetails.address_line_1+"\n"+saleDetails.address_line_2), 7, 44);
        pdf.text(String(saleDetails.address_line_1), 7, 44);
        pdf.text((saleDetails.city_or_district+", "+saleDetails.state+", "+saleDetails.postal_code), 7, 48);
        pdf.text(String(saleDetails.mobile_no), 7, 52);
        pdf.text(('# '+String(saleDetails.sale_id)), 141, 17, 'right');
        pdf.text((new Date(saleDetails.date).getDate() + '/' + (new Date(saleDetails.date).getMonth()+1) + '/' + new Date(saleDetails.date).getFullYear()), 141, 21, 'right');
        pdf.setFontSize(12);
        pdf.text('Amount:', 110, 36, 'right');
        pdf.text("Rs. " + total, 141, 36, 'right');
        pdf.text('Paid:', 110, 41.5, 'right');
        pdf.text(("Rs. "+saleDetails.paid), 141, 41.5, 'right');
        pdf.text('Totol Due:', 110, 47, 'right');
        pdf.text(("Rs. "+Math.round(total-saleDetails.paid)), 141, 47, 'right');
        pdf.text('Due Date:', 110, 52.5, 'right');
        pdf.text((new Date(saleDetails.due_date).getDate() + '/' + (new Date(saleDetails.due_date).getMonth()+1) + '/' + new Date(saleDetails.due_date).getFullYear()), 141, 52.5, 'right');
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(20);
        pdf.text('INVOICE', 141, 12, 'right');
        pdf.setFontSize(10);
        pdf.text('ID', 7, 61.5);
        pdf.text('Description', 17, 61.5);
        pdf.text('Quan.', 75, 61.5);
        pdf.text('Rate', 88, 61.5);
        pdf.text('Disc', 100, 61.5);
        pdf.text('Price', 124, 61.5, 'right');
        pdf.text('Amount', 141, 61.5, 'right');
        pdf.setDrawColor(10, 10, 10);
        pdf.setLineWidth(0.2);
        pdf.line(7, 56.5, 141, 56.5);
        pdf.line(7, 64, 141, 64);
        pdf.line(7, finalY, 141, finalY);
      }
      decor();

      soldProducts.forEach((product)=>{
        
          pdf.setFont("courier");
          pdf.setFontSize(9);
          pdf.text(String(product.product_id), 7, startY);
          pdf.setFontSize(10);
          var desc = pdf.splitTextToSize(String(product.product_name), 50);
          pdf.text(17, startY, desc);
          pdf.text(String(product.quantity), 75, startY);
          pdf.text(String(product.rate), 88, startY);
          pdf.text(String(product.disc), 100, startY);
          pdf.text(String(product.price), 124, startY, 'right');
          pdf.text(String(product.amount), 141, startY, 'right');
          pdf.setFont("helvetica");
          startY += (5 * desc.length);
          if (startY > breakY) {
              pdf.text('Continued...', 17, finalY + 25);
              pdf.addPage();
              decor();
              startY = 70;
          }
      });
      pdf.setFontSize(10);
      console.log(saleDetails.tax);
      if ((saleDetails.tax === 1)) {
        pdf.text('Subtotal', 110, finalY + 7, 'right');
        pdf.text('Rs. ' + String(subtotal), 113, finalY + 7);
        pdf.text('Tax', 110, finalY + 12, 'right');
        pdf.text('Rs. ' + String((subtotal*0.18).toFixed(1)), 113, finalY + 12);
        finalY +=5;
      }
      else{
        pdf.text('Subtotal', 110, finalY + 7, 'right');
        pdf.text('Rs. ' + String(subtotal), 113, finalY + 7);
      }
      pdf.text('Shipping', 110, finalY + 12, 'right');
      pdf.text('Rs. ' + String(saleDetails.shipping), 113, finalY + 12);
      pdf.text('Discount', 110, finalY + 17, 'right');
      pdf.text('Rs. ' + String(saleDetails.summery_discount), 113, finalY + 17);
      pdf.text('Previous Due', 110, finalY + 22, 'right');
      pdf.text('Rs. ' + String(previousDue), 113, finalY + 22);
      pdf.line(87, finalY + 25, 141, finalY + 25);
      pdf.line(7, finalY + 25, 61, finalY + 25);
      pdf.text('Rs. ' + String(total), 113, finalY + 31);
      pdf.text('Authorized Signature', 34, finalY + 31, 'center');
      pdf.setFontSize(14);
      pdf.text('Total', 110, finalY + 31, 'right');
      let totalPage = pdf.internal.getNumberOfPages();
      pdf.setFontSize(8);
      for (let index = 1; index <= totalPage; index++) {
          pdf.setPage(index);
          pdf.text('Page '+index+ ' of '+ totalPage, 74, 196, 'center');
      }
      return pdf;
  }

  return (
    <>
    <div className={classes.parent}>
        <iframe src={string} title="bill" name='billpdf' id="billpdf" />
        <div>
          <button type="button" onClick={print} className="btn btn-danger btn-lg btn-block">Print</button>
          <button type="button" onClick={save} className="btn btn-secondary btn-lg btn-block">Download</button>
          <button type="button" onClick={moveToCart} className="btn btn-secondary btn-lg btn-block">Move to Cart</button>
        </div>
    </div>
    </>
  )
}

export default Bill