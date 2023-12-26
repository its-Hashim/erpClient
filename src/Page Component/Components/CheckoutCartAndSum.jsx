import React from 'react'

function CheckoutCartAndSum(props) {

  const {cart, cartNo, subtotal, tax, summery, total} = props;

  return (
    <div className="row">
        <div className="col-lg-9">
          <h3 className="display-4">Checkout Cart : {cartNo}</h3>
          <hr />
          <div>
            {cart.map((element, index) => (
              <div key={index}>
                <div className="row mb-1" key={element.product_id}>
                  <div className="col-md-6">
                    <div className="" style={{ padding: "0px" }}>
                      <div>
                        <p className="mb-0" id="">
                          {element.product_id} :{element.product_name}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="col">
                    <span>
                      {element.quantity}
                      <span
                        className="font-weight-light"
                        style={{ fontSize: "small", marginBottom: "0" }}
                      >
                        <span hidden id="{element.product_id}_totalQuantity">
                          {element.per_peice_quantity}
                        </span>
                        (
                        <span id="totalQuantity_{ element.product_id }">
                          {element.quantity * element.per_peice_quantity}
                        </span>
                        {element.unit})
                      </span>
                    </span>
                  </div>

                  <div className="col text-right">
                    <p className="price-para mb-0">
                      <span className="price">
                        ₹
                        <span id="{element.product_id}_mrp">{element.mrp}</span>{" "}
                      </span>
                      <span className="price-label"> per {element.unit} </span>
                    </p>
                  </div>

                  <div className="col text-right">{element.discount}</div>

                  <div className="col text-right">
                    <span className="text-danger font-weight-bold">₹ </span>
                    <span id="{ element.product_id }_netPrice">
                      {element.mrp - element.discount}
                    </span>
                  </div>

                  <div className="col text-right">
                    <span className="text-danger font-weight-bold">₹ </span>
                    <span className="amount" id="{ element.product_id }_amount">
                      {(
                        (element.mrp - element.discount) *
                        element.quantity *
                        element.per_peice_quantity
                      ).toFixed(2)}
                    </span>
                  </div>
                </div>
                <hr className="" />
              </div>
            ))}
          </div>
          <hr className="mt-0" />
        </div>
        <div className="col-lg-3">
          <h3 className="display-4">Summery</h3>
          <hr />
          <div className="border border-dark " style={{ padding: "0.9rem" }}>
            <h6>
              Subtotal (2){" "}
              <span className="text-danger float-right">
                ₹ <span id="subtotal">{subtotal}</span>
              </span>
            </h6>
            <p>
              {/* <input
                disabled
                hidden
                checked={summery.tax}
                form="cartForm"
                type="checkbox"
                name="taxCheck"
                // onChange="estimateTotal();"
                id="taxCheck"
              /> */}
              Tax
              <span className="float-right">
                ₹ <span id="tax">{tax}</span>
              </span>
            </p>
            <p>
              Shipping
              <span className="float-right">
                ₹ <span id="shippingCost">{summery.shipping}</span>
              </span>
            </p>
            <p>
              Discount
              <span className="float-right">
                ₹ <span id="discount">{summery.discount}</span>
              </span>
            </p>
            <h4>
              Total{" "}
              <span className="text-danger float-right">
                ₹ <span id="estimatedTotal">{total}</span>
              </span>
            </h4>
          </div>
          <br />
        </div>
      </div>
  )
}

export default CheckoutCartAndSum