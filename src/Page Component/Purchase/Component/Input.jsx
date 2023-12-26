import React from 'react'

function Input(props) {
  // console.log("printing datalist in Input");
  // console.log(props.datalist);
  return (
    <>
      {(props.label) && <label htmlFor={props.id}>{props.label}</label>}
      <input
        disabled={props.disabled}
        ref={props.ref}
        type={props.type}
        className="form-control d-inp1"
        value={props.value}
        onChange={props.onChange}
        list={props.datalist ? props.name : ""}
        id={props.id}
        placeholder={props.placeholder}
        name={props.name}
        required={props.required}
        autoFocus={props.focus}
        onBlur={props.onBlur}
        />
      <datalist dir="rtl" id={props.name}>
        {props.datalist}
      </datalist>
      <small id="emailHelp" className="form-text text-muted">
        {props.msg}
      </small>
      <div style={{  color: "red",fontSize: "14px"}}>{props.error}</div>
    </>
  )
}

export default Input