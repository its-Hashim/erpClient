import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import axios from "axios";
import CheckoutCartAndSum from '../../Components/CheckoutCartAndSum';
import { Form, redirect } from 'react-router-dom';

function CheckoutForPurchase() {
  const [cart, setCart] = useState([]);
  const [summery, setSummery] = useState({});
  const [subtotal, setSubtotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);
  const cartNo = useSelector(state => (state.cart.cartNo));
  const [distributors, setDistributors] = useState([]);
  const [officers, setOfficers] = useState([]);

  useEffect(() => {
    let url =
    process.env.REACT_APP_NODE_ENV+"/checkOutPurchase?" +
      new URLSearchParams({cartNo:cartNo});
    axios.get(url).then((res) => {
      // console.log(res.data);
      setCart(res.data.cart);
      setSummery(res.data.summery);
      setDistributors(res.data.distributors);
      setOfficers(res.data.officers);

      let tempSubtotal = +0;
      res.data.cart.forEach(
        (element) => {
          (tempSubtotal += +(
            (element.mrp - element.discount) *
            element.quantity *
            element.per_peice_quantity
          ).toFixed(2))
        });
        let tempTax = 0;
        if (res.data.summery.tax) {
          tempTax = +((tempSubtotal * 0.18).toFixed(2));
        }
        let tempTotal = (tempTax + tempSubtotal + (res.data.summery.shipping) - (res.data.summery.discount));
        setSubtotal(tempSubtotal);
        setTax(tempTax);
        setTotal(tempTotal);
    }).catch((e)=>{alert(e);});
  }, [cartNo]);

  return (
    <div className="container">
      <CheckoutCartAndSum cart={cart} cartNo={cartNo} subtotal={subtotal} tax={tax} summery={summery} total={total} />
      <hr />
      <Form method="post" className="needs-validation pb-5">

        <div className="form-group row">
          <label htmlFor="bill_no" className="col-sm-2 col-form-label">Enter The Bill No.:</label>
          <div className="col-sm-10">
            <input type="text" className="form-control" id="bill_no" defaultValue="" name="bill_no" required />
          </div>
        </div>

        <div className="form-group row">
          <label className="col-sm-2 col-form-label" htmlFor="distributor">Select a distributor:</label>
          <div className="col-sm-10">
            <select className="form-control" id="distributor" name="distributor">
              {distributors.map(element=> {
                return(
                    <option key={element.distributor_id} value={element.distributor_id} >
                      {element.name}
                    </option>
                  ) 
                 })}
            </select>
          </div>
        </div>

        <div className="form-group row">
          <label className="col-sm-2 col-form-label" htmlFor="Officer">Select a Officer:</label>
          <div className="col-sm-10">
            <select className="form-control" id="Officer" name="officer">
              {officers.map(element=> {
                return(
                    <option id={element.officer_id} value={element.officer_id} >
                      {element.officer_name}
                    </option>
                  )
                })}
            </select>
          </div>
        </div>

        <div className="form-group row">
          <label htmlFor="paid" className="col-sm-2 col-form-label">Payment Amount:</label>
          <div className="col-sm-10">
            <input type="number" className="form-control" id="paid" defaultValue="" name="paid" step="any" required />
          </div>
        </div>

        <div className="form-group row">
          <label htmlFor="d_ate" className="col-sm-2 col-form-label">Due Date:</label>
          <div className="col-sm-10">
            <input type="date" id='d_ate' defaultValue={new Date().toLocaleDateString('en-CA')} className="form-control" name="due_date" required />
          </div>
        </div>
        <input type="hidden" name="cart_no" defaultValue={cartNo} />
        <div className='pb-5'>
        <button type="submit" className="btn btn-danger float-right mb-5">Purchase</button>
        </div>
      </Form>
    </div>
    
  )
}
export default CheckoutForPurchase


export const action = async ({request, params})=>{

  const data = await request.formData();
  const obj = {
    bill_no: data.get('bill_no'),
    distributor: data.get('distributor'),
    officer: data.get('officer'),
    paid:data.get('paid'),
    due_date:data.get('due_date'),
    cart_no:data.get('cart_no'),
  }

  console.log(obj);


  // const res = await fetch(process.env.REACT_APP_NODE_ENV+'/editCatagory/'+params.name);

  const res = await fetch(process.env.REACT_APP_NODE_ENV+'/checkOutPurchase', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(obj)
  })
  const ret = await res.json();
  console.log(ret);

  if (ret[0][0].id) {
    alert("Purchase Success...")
    return redirect('/purchase/'+ret[0][0].id)
  }else{
    alert("Error Occured please contact admin..")
    return redirect('/')
  }
  // return(ret);
}