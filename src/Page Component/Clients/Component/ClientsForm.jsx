import React, {useReducer, useEffect, useState} from 'react';
import { Form } from 'react-router-dom';
import Input from '../../Purchase/Component/Input';
import PrependInput from '../../Purchase/Component/PrependInput';

function ClientsForm(props) {

  const initialState = {
    l1:"", l2:"", city:"", zip:"", state:"", name:"", id:"", country:"", mobile_no:"",
    inputDisabled:false, mode:'add'
  }

  const reducer = (s, action) =>{
    switch (action.type) {
      case 'l1':
        return{...s, l1:action.value};
      case 'l2':
        return{...s, l2:action.value}
      case 'city':
        return{...s, city:action.value}
      case 'zip':
        return{...s, zip:action.value}
      case 'state':
        return{...s, state:action.value}
      case 'name':
        return{...s, name:action.value}
      case 'id':
        return{...s, id:action.value}
      case 'country':
        return{...s, country:action.value}
      case 'mobile_no':
        return{...s, mobile_no:action.value}
      case 'inputDisabled':
        return{...s, inputDisabled:action.value}
      case 'mode':
        return{...s, mode:action.value}
      case 'edit':
        return{...s, mode:"edit", inputDisabled:false}
      case 'read':
        return{...s, mode:"read", inputDisabled:true}
      case 'all':
        return {
          ...s,
          l1:action.value.l1,
          l2:action.value.l2,
          city:action.value.city,
          zip:action.value.zip,
          state:action.value.state,
          name:action.value.name,
          id:action.value.id, 
          country:action.value.country, 
          mobile_no:action.value.mobile_no,
          mode:"read",
          inputDisabled:true
        }

    
      default:
        return s;
    }
  }

  const [{l1, l2, city, zip, state, name, id, country, mobile_no, mode, inputDisabled}, dispatch] = useReducer(reducer, initialState)
  useEffect(() => {  
    if (props.data) {
      dispatch({type:"all", value:props.data})
    }
  }, [])
  
  let buttonText = "Add Customer";
  if (mode==='read') {
    buttonText="Edit";
  }
  buttonText = mode==='read' ? "Edit" : "Save"

  const formSubmitHandler = (e) =>{
    if(mode=='read'){
      e.preventDefault();
      dispatch({type:'edit'});
      return
    }
    if(mode=='edit'){
      
      return
    }
  }

  const cancelHandler = (e)=>{
    if (props.data) {
      dispatch({type:"all", value:props.data})
    }
  }
  
  return (
    <div className='card'>
      <div className='card-header'>
        <p className='display-4 card-heading'>{props.title}</p>
      </div>
      <div className='m-3'>
        <Form
          action="/clients/add-client"
          method={props.method ? props.method : "POST"}
        >
          <div className="form-row">
            <div className="form-group col-md-6">
              <PrependInput
                prepend="91"
                onChange={(e)=>{dispatch({type:"mobile_no", value:e.target.value})}}
                id={"inputNumber"}
                label={"Mobile"}
                type={"number"}
                name="mobile"
                value={mobile_no} 
                // value={632465}
                placeholder="9876543210"
                required={true}
                focus={true}
                disabled={props.data ? true : false}
              />
            </div>
            <div className="form-group col-md-6">
              <Input
                onChange={(e)=>{dispatch({type:"name", value:e.target.value})}}
                disabled={inputDisabled}
                id={"inputName"}
                label={"Client Name"}
                type={"text"}
                name={"name"}
                value={name} 
                // value={"asdfasdf"}
                placeholder="Sk Imran"
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
                  value={l1}
                  onChange={(e)=>{dispatch({type:"l1", value:e.target.value})}}
                  id="inputAddress"
                  // value="Enter customer address"
                  placeholder="Enter customer address"
                  name="address_line_1"
                  required={true}
                // error={add1Error}
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
                  value={l2}
                  onChange={(e)=>{dispatch({type:"l2", value:e.target.value})}}
                  // onChange={e => setAdd2(e.target.value)}
                  id="inputAddress2"
                  // value="Enter customer address line 2"
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
                    onChange={(e)=>{dispatch({type:"city", value:e.target.value})}}
                    // onChange={e => {setCity(e.target.value);setCityError("")}}
                    id="inputCity"
                    // value="city"
                    placeholder="Enter customer city"
                    name="city_or_district"
                    required={true}
                  // error={cityError}
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
                    onChange={(e)=>{dispatch({type:"state", value:e.target.value})}}
                    // onChange={e => {setState(e.target.value);setStateError("")}}
                    id="inputState"
                    // value="state"
                    placeholder="Enter customer state"
                    name="state"
                    required={true}
                  // error={stateError}
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
                    onChange={(e)=>{dispatch({type:"country", value:e.target.value})}}
                    // onChange={e => {setCountry(e.target.value);setCountryError("")}}
                    id="inputCountry"
                    // value="country"
                    placeholder="Enter customer country"
                    name="country"
                    required={true}
                  // error={countryError}
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
                    onChange={(e)=>{dispatch({type:"zip", value:e.target.value})}}
                    // onChange={e => {setZip(e.target.value);setZipError("")}}
                    id="inputZip"
                    // value="121321"
                    placeholder="Enter customer zip"
                    name="postal_code"
                    required={true}
                  // error={zipError}
                  />
                  <input onChange={(e)=>{}} hidden={true} name="id" value={id ==="" || id===null ? "" : id} />

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
          <button onClick={cancelHandler} hidden={props.data && mode ==='edit'? false: true} className='add-button ml-5 btn btn-dark' type="reset">Cancel</button>
          <button
            type='submit'
            className={`btn btn-outline-danger add-button submitButton`}
            onClick={formSubmitHandler}
            >
            {buttonText}
          </button>
        </Form>
      </div>
    </div>
  )
}

export default ClientsForm