import React, { useEffect, useState } from "react";
import {useSelector} from 'react-redux';
import axios from "axios";
import Input from "./Component/Input";
import PrependInput from "./Component/PrependInput";
import { useNavigate } from "react-router-dom";
import CheckoutCartAndSum from "../Components/CheckoutCartAndSum";


function CheckoutForSales() {

  const navigate = useNavigate();

  const [cart, setCart] = useState([]);
  const [summery, setSummery] = useState({});
  const [clients, setClient] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);


  const [mobile, setMobile] = useState("");
  const [name, setName] = useState("");
  const [add1, setAdd1] = useState("");
  const [add2, setAdd2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("West Bengal");
  const [country, setCountry] = useState("India");
  const [zip, setZip] = useState("");
  const [dues, setDues] = useState("");
  const [paybleAmount, setPaybleAmount] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  
  const [inputDisabled, setInputDisabled] = useState(false);
  const cartNo = useSelector(state => (state.cart.cartNo));

  const dateObj = new Date();
  const month = dateObj.getMonth() + 1;
  var m = '';
  if (month < 10) {
    m = '0' + month;
  }
  else {
    m = month;
  }
  const day = String(dateObj.getDate()).padStart(2, '0');
  const year = dateObj.getFullYear();
  const output = year + '-' + m + '-' + day;
  const [dueDate, setDueDate] = useState(output);
  const [date, setDate] = useState(output);
  
  const [mobileError, setMobileError] = useState("");
  const [nameError, setNameError] = useState("");
  const [add1Error, setAdd1Error] = useState("");
  const [cityError, setCityError] = useState("");
  const [stateError, setStateError] = useState("");
  const [countryError, setCountryError] = useState("");
  const [zipError, setZipError] = useState("");
  const [paymentError, setPaymentError] = useState("");
  

  const hostName= process.env.REACT_APP_NODE_ENV+"";
  
  
  useEffect(() => {
    let url =
      hostName+"/checkOutSell?" +
      new URLSearchParams({cartNo:cartNo});
    axios.get(url).then((res) => {
      // console.log(res.data);
      setCart(res.data.cart);
      setSummery(res.data.summery);
      setClient(res.data.clients);
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

  // useEffect(() => {
  //   if (nameInputRef.current) {
  //     nameInputRef.current.focus();
  //   }
  // },[]);

  // const nameChangedHandler = e => setName(e.target.value);

  const mobileBlurHandler = e =>{
    let value= e.target.value;
    if(Number(value) !== 0 && value.toString().length === 10){
      setMobileError("");
      let url = hostName + "/getClientDue?cartNo=";

      var clientPresent = false;
      clients.forEach(function(currentValue, index){
        // console.log(currentValue);
        if (currentValue.mobile_no === value) {
          clientPresent = true;
          setName(currentValue.name);
          // disableForm();
          fetch(url+currentValue.client_id)
            .then(response =>{
              if (response.ok) {
                return response.json();
              }else{
                // enableForm();
                throw new Error('Something went wrong');
              }
            })
            .then(json => {

              // enableForm();
              currentValue.previous_due = json.due;
              console.log(json);
              setDues(json.due);
              setPaybleAmount(Number(currentValue.previous_due)+Number(total));
              // document.getElementById('client_id').value = currentValue.client_id;
              setInputDisabled(true);
              return;
              // disableAddressInputs();
            })
            .catch((error) => {
              // enableForm();
              throw new Error(error);
              });
        }
        if (clientPresent === false && index === (clients.length - 1)) {
          // document.getElementById('client_id').value = 'null';
          setDues(0);
          setPaybleAmount(Number(total));
          setInputDisabled(false);
          // console.log('Client not Found');
          // document.getElementById('dues').innerText = 0;
          // document.getElementById('payble-amount').innerText = Number(document.getElementById('estimatedTotal').innerText);
          // enableAddressInputs();
          // document.getElementById('inputAddress').focus();
        }
      })
    }else{
      setMobileError("Mobile number is invalid");
      setInputDisabled(false);
    }
  }
  
  const formSubmitHandler = event=>{
    event.preventDefault();
    event.stopPropagation();

    if(!inputDisabled){
      if(mobile.toString().length !== 10){
        setMobileError("Mobile number is invalid");
        return;
      }
      if(name === null || name === ""){
        setNameError("invalid name");
        return;
      }
      if(add1 === null || add1 === ""){
        setAdd1Error("invalid adderes");
        return;
      }
      if(city === null || city === ""){
        setCityError("invalid city");
        return;
      }
      if(state === null || state === ""){
        setStateError("invalid state");
        return;
      }
      if(country === null || country === ""){
        setCountryError("invalid country");
        return;
      }
      if(zip === null || zip === 0){
        setZipError("invalid zip");
        return;
      }
    }
    if(paymentAmount === null || paymentAmount === undefined || paymentAmount=== ""){
      setPaymentError("invalid payment amount");
      return;
    }
    const makeSale = ()=>
    {
      fetch(process.env.REACT_APP_NODE_ENV+"/MAKE_SALE", {
      
        // Adding method type
        method: "POST",
        
        // Adding body or contents to send
        body: JSON.stringify({
            cartNo,
            mobile,
            name,
            add1,
            add2,
            city,
            state,
            country,
            zip,
            paymentAmount,
            dueDate,
            date
        }),
        
        // Adding headers to the request
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
      })
      // Converting to JSON
      .then(response => response.json())
      
      // Displaying results to console
      .then(json => {console.log(json);navigate('/salesList/bill/print/'+json.saleId)});
    }
    makeSale();
  }

  return (
    <div className="container">
      <CheckoutCartAndSum cart={cart} cartNo={cartNo} subtotal={subtotal} tax={tax} summery={summery} total={total} />
      <hr />

      <div className="formWrap">
        <div className="spinner displayNone">
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
        <div id="formDiv">
          <form
            onSubmit={formSubmitHandler}
            id="myForm"
            // action="/cart/sell/checkout"
            // method="post"
            className="needs-validation"
            noValidate
          >
            <div className="form-row">
            <div className="form-group col-md-6">
              <PrependInput 
                prepend="91"
                id={"inputNumber"}
                label={"Mobile"}
                type={"number"}
                name={"mobile"}
                value={mobile} 
                placeholder="9876543210"
                onChange={e=>setMobile(e.target.value)}
                onBlur={mobileBlurHandler}
                error={mobileError}
                required={true}
                focus={true}
                datalist={clients.map((client) => (
                  <option key={client.client_id} name={client.client_id}>
                    {client.mobile_no}
                  </option>
                ))}
              
              />
              </div>
              <div className="form-group col-md-6">
              <Input
                disabled={inputDisabled}
                id={"inputName"}
                label={"Client Name"}
                type={"text"}
                name={"name"}
                value={name} 
                placeholder="Sk Imran"
                onChange={e=>{setName(e.target.value);setNameError("")}}
                error={nameError}
                msg={"Make sure to input full name."}
                required={true} 
                />
              </div>
            </div>
            <div className="address">
              <div id="address-section">
                <div className="form-group">
                  <Input
                    label="Address Line 1"
                    disabled={inputDisabled}
                    type="text"
                    value={add1}
                    onChange={e => {setAdd1(e.target.value);setAdd1Error("")}}
                    id="inputAddress"
                    placeholder="Enter customer address"
                    name="address_line_1"
                    required={true}
                    error={add1Error}
                  />

                  
                  {/* <label htmlFor="inputAddress">Address</label>
                  <input
                  value={add1}
                  onChange={e => setAdd1(e.target.value)}
                  type="text"
                  className="form-control d-inp"
                  id="inputAddress"
                  placeholder="1234 Main St"
                  name="address_line_1"
                  required
                  />
                <div className="invalid-feedback">This Field is required</div> */}
                </div>
                <div className="form-group">
                  <Input
                    label="Address Line 2"
                    disabled={inputDisabled}
                    type="text"
                    value={add2}
                    onChange={e => setAdd2(e.target.value)}
                    id="inputAddress2"
                    placeholder="Enter customer address line 2"
                    name="address_line_2"
                  />
                  {/* <label htmlFor="inputAddress2">Address 2</label>
                  <input
                    value={add2}
                    onChange={e => setAdd2(e.target.value)}
                    type="text"
                    className="form-control d-inp"
                    id="inputAddress2"
                    placeholder="Apartment, studio, or floor"
                    name="address_line_2"
                  /> */}
                </div>
                <div className="form-row">
                  <div className="form-group col-md-4">
                    <Input
                      label="City"
                      disabled={inputDisabled}
                      type="text"
                      value={city}
                      onChange={e => {setCity(e.target.value);setCityError("")}}
                      id="inputCity"
                      placeholder="Enter customer city"
                      name="city_or_district"
                      required={true}
                      error={cityError}
                    />
                    
                    {/* <label htmlFor="inputCity">City or District</label>
                    <input
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      type="text"
                      className="form-control d-inp"
                      id="inputCity"
                      name="city_or_district"
                      required
                    /> 
                    <div className="invalid-feedback">This field is required</div>*/}
                  </div>
                  <div className="form-group col-md-4">
                    <Input
                        label="State"
                        disabled={inputDisabled}
                        type="text"
                        value={state}
                        onChange={e => {setState(e.target.value);setStateError("")}}
                        id="inputState"
                        placeholder="Enter customer state"
                        name="state"
                        required={true}
                        error={stateError}
                      />
                  
                    
                    {/* <label htmlFor="inputState">State</label>
                    <input
                      value={state}
                      onChange={e => setState(e.target.value)}
                      type="text"
                      className="form-control d-inp"
                      id="inputState"
                      name="state"
                      required
                    /> 
                    <div className="invalid-feedback">State is required</div>*/}
                  </div>
                  <div className="form-group col-md-2">

                  <Input
                        label="Country"
                        disabled={inputDisabled}
                        type="text"
                        value={country}
                        onChange={e => {setCountry(e.target.value);setCountryError("")}}
                        id="inputCountry"
                        placeholder="Enter customer country"
                        name="country"
                        required={true}
                        error={countryError}
                      />

                    {/* <label htmlFor="inputCountry">Country</label>
                    <input
                      value={country}
                      onChange={e => setCountry(e.target.value)}
                      type="text"
                      className="form-control d-inp"
                      id="inputCountry"
                      name="country"
                      required
                    />
                    <div className="invalid-feedback">Country is required</div> */}
                  </div>
                  <div className="form-group col-md-2">
                    
                  <Input
                        label="Zip"
                        disabled={inputDisabled}
                        type="number"
                        value={zip}
                        onChange={e => {setZip(e.target.value);setZipError("")}}
                        id="inputZip"
                        placeholder="Enter customer zip"
                        name="postal_code"
                        required={true}
                        error={zipError}
                      />
                    
                    {/* <label htmlFor="inputZip">Zip</label>
                    <input
                      value={zip}
                      onChange={e => setZip(e.target.value)}
                      type="number"
                      className="form-control d-inp"
                      id="inputZip"
                      name="postal_code"
                      required
                    />
                    <div className="invalid-feedback zip-feedback">
                      There has to be a number
                    </div> */}
                  </div>
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group row col-md-6">
                <label htmlFor="dues" className="col-sm-3 col-form-label">
                  Dues:
                </label>
                <div className="col-sm-9">
                  <span className="text-danger">
                    ₹<span id="dues">{dues}</span>
                  </span>
                </div>
              </div>
              <div className="form-group row col-md-6">
                <label htmlFor="payble-amount" className="col-sm-4 col-form-label">
                  Payble Amount:
                </label>
                <div className="col-sm-8">
                  <span className="text-danger">
                    ₹<span id="payble-amount">{paybleAmount}</span>
                  </span>
                </div>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group row col-md-4">
                <label htmlFor="paid" className="col-sm-5 col-form-label">
                  Payment Amount:
                </label>
                <div className="col-sm-7">
                <Input
                        type="number"
                        value={paymentAmount}
                        onChange={e => {setPaymentAmount(e.target.value);setPaymentError("")}}
                        id="paid"
                        name="paid"
                        required={true}
                        error={paymentError}
                        step="any"
                      />
                </div>
              </div>
              <div className="form-group row col-md-4">
                <div className="col-sm-5 col-form-label">
                  <div style={{float:"right"}}>
                    <label htmlFor="due-date">
                      Due Date:
                    </label>
                  </div>
                </div>
                <div className="col-sm-7">
                  <input
                    value={dueDate}
                    onChange={e => setDueDate(e.target.value)}
                    type="date"
                    id="due-date"
                    className="form-control"
                    name="Due Date"
                    required
                  />
                </div>
              </div>
              <div className="form-group row col-md-4">
                <div className="col-sm-5 col-form-label">
                  <div style={{float:"right"}}>
                    <label htmlFor="date">
                      Date:
                    </label>
                  </div>
                </div>
                <div className="col-sm-7">
                  <input
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    type="date"
                    id="date"
                    className="form-control"
                    name="date"
                    required
                  />
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="btn btn-success add-button submitButton"
              onClick={formSubmitHandler}
            > 
              Sell
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
export default CheckoutForSales;