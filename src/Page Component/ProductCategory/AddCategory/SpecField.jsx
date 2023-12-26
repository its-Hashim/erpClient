import React from 'react'

export default function SpecField(props) {
  return (
    <div id="spec-container">
      <div className="row">

        <div className="form-group col-md-8">
          <label htmlFor={`spec_${props.n}`}>Spec {props.n}</label>
          <input type="text" className="form-control" id={`spec_${props.n}`} name={`spec_${props.n}`} required />
        </div>

        <div className="form-group col-md-4">
          <label htmlFor={`spec_${props.n}_default`}>Default</label>
          <input type="text" className="form-control" id={`spec_${props.n}_default`} name={`default_${props.n}`} required />
        </div>

      </div>
      
    </div>
  )
}
