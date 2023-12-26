import React from "react";
import { Form, redirect, Link, useNavigate, useLoaderData } from "react-router-dom";

function Login() {
  return (
    <div className="d-flex" id="wrapper">
      {/* <% if (messages.error) { %>
      <%= messages.error %>
        <% } %> */}
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
        <div className="login-form">
          <Form className="form-signin" method="post">
            <h2 className="form-signin-heading">Wellcome Back!</h2>
            <div className="form-group">
              <label htmlFor="exampleInputEmail1">Email address</label>
              <input
                type="email"
                name="email"
                className="form-control"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                autoFocus
              />
              <small id="emailHelp" className="form-text text-muted">
                We'll never share your email with anyone else.
              </small>
            </div>
            <div className="form-group">
              <label htmlFor="exampleInputPassword1">Password</label>
              <input
                type="password"
                name="password"
                className="form-control"
                id="exampleInputPassword1"
              />
            </div>
            <button className="btn btn-lg btn-danger btn-block" type="submit">
              Sign in
            </button>
            <br />
          </Form>
        </div>
      </div>
    </div>
  );
}


export const loader = async ()=>{
  const res = await fetch(process.env.REACT_APP_NODE_ENV+'/loginReact', {
    credentials: "include",
  });
  const ret = await res.json();
  // console.log(ret);
  if (ret.authenticated) {
    return redirect('/')
  }else{
    return null;
  }
}


export const action = async ({ request, params }) => {
  // console.log("Logging in...");
  const data = await request.formData();
  const obj = {
    password: data.get("password"),
    email: data.get("email"),
  };
  // console.log(obj);
  // console.log(request.method);
  const res = await fetch(process.env.REACT_APP_NODE_ENV+"/loginReact", {
    method: request.method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(obj),
    credentials: "include",
  });
  const ret = await res.json();
  // console.log(ret);
  if(ret.success){
    localStorage.setItem('token', ret.token);
    const expiration = new Date();
    expiration.setHours(expiration.getHours() + 24);
    localStorage.setItem('expiration', expiration.toISOString());
    return redirect('/')
  }else{
    alert(ret.msg)
    return ret;
  }
  
};

export default Login;
