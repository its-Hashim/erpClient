import React from "react";
import { Link } from "react-router-dom";

function ErrorSection(props) {

  const url = (props.status === 401)? "/loginApp" : "/";
  const btnText = (props.status === 401)? "Login" : "Home";

  return (
    <section className="page_404">
      <div className="container">
        <div className="row">
          <div className="col-sm-12 ">
            <div className="col-sm-10 col-sm-offset-1  text-center">
              <div className="four_zero_four_bg">
                <h1 className="text-center ">{props.status}</h1>
              </div>

              <div className="contant_box_404">
                <h3 className="h2">{props.header}</h3>

                <p>{props.msg}</p>

                <Link to={url} className="link_404">
                  {btnText}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ErrorSection;
