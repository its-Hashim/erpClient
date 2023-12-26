import React from 'react'

function PrependInput(props) {
  return (
    <>
      <label htmlFor={props.id}>{props.label}</label>
      <div className="input-group">
        <div className="input-group-prepend">
          <span className="input-group-text" id="basic-addon1">
            {props.prepend}
          </span>
        </div>
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
      </div>

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

export default PrependInput