import React from "react";
import { Form, redirect, Link } from "react-router-dom";

function SignUp() {
  // var actionData = useActionData();
//   console.log(actionData);
  return (
    <div className="d-flex" id="wrapper">
      <div className="container">
        {/* <% if (null> 0) { %>
                <div className="alert alert-warning alert-dismissible
               fade in" role="alert">
                    <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <strong>Ohps!</strong>
                    <%= message %>.
                </div>
                <% } %> */}
        {/* {(actionData.success===false) && <p>Email ID already present!</p>} */}
        <div className="login-form">
          <Form className="form-signin" method="post">
            <h2 className="form-signin-heading">Wellcome To Royal Plywood</h2>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
              />
            </div>
            <div className="form-group">
              <label htmlFor="exampleInputEmail1">Email address</label>
              <input
                type="email"
                className="form-control"
                id="exampleInputEmail1"
                name="email"
                aria-describedby="emailHelp"
              />
            </div>
            <div className="form-group">
              <label htmlFor="exampleInputPassword1">Password</label>
              <input
                type="password"
                name="pwd"
                className="form-control"
                id="exampleInputPassword1"
              />
            </div>
            <div className="form-group">
              <label htmlFor="position">Select Position</label>
              <select name="position" className="form-control" id="position">
                <option value='sales'>Sales</option>
                <option value='manager'>Manager</option>
              </select>
            </div>
            <button className="btn btn-lg btn-primary btn-block" type="submit">
              Sign in
            </button>
            <br />
            <p>
              Already a member? <Link to="/loginApp">Login</Link>
              , it's free.
            </p>
          </Form>
        </div>
      </div>
    </div>
  );
}

export const action = async ({ request, params }) => {
  console.log("singingUp");
  const data = await request.formData();
  const obj = {
    name: data.get("name"),
    pwd: data.get("pwd"),
    email: data.get("email"),
    position: data.get("position")
  };
  console.log(obj);
  console.log(request.method);
  const res = await fetch(process.env.REACT_APP_NODE_ENV+"/signUpReact", {
    method: request.method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(obj),
  });
  const ret = await res.json();
  console.log(ret);
  if(ret.success){
    return redirect('/loginApp')
  }else{
    alert("Email already already present!")
    return ret;
  }
  
};

export default SignUp;
