import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux"
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { updateCart, updateAll, updateSummery } from "../../Store/cartSlice";

export default function Cart() {

  const navigate = useNavigate();

  const [product_list, setProductList] = useState([]);
  const [search, setSearch] = useState("");

  const cart = useSelector((state)=> state.cart.cart);
  const cart_no = useSelector((state)=> state.cart.cartNo);
  const summery = useSelector((state)=> state.cart.summery);
  const dispatch = useDispatch();

  const [quantityChanged, setQuantityChanged] = useState(false);
  const [discChanged, setDiscChanged] = useState(false);

  // const searchRef = useRef();

  let url =
    process.env.REACT_APP_NODE_ENV+"/getProductsReact?" +
    new URLSearchParams({
      cart_no: 1,
    });
  useEffect(() => {
    axios.get(url).then((res) => {
      // console.log(res.data);
      setProductList(res.data.product_list);
      // if(!res.data.authenticated){
      //   navigate('/clientList')
      // }
      // dispatch(updateCartNo(res.data.cart_no));
      // dispatch(updateSummery(res.data.summery));
      // else {
        dispatch(updateAll({
          cart:res.data.cart,
          cartNo:res.data.cart_no,
          summery:res.data.summery
        }))
      // }
    });
  }, [dispatch, url]);

  // console.log("Building Cart");

  let tax,sum = 0;

  cart.forEach((element)=>{
    sum += +((element.mrp - element.discount) *
    element.quantity *
    element.per_peice_quantity);
  });
  let totalSum ;
  if(summery.tax){
    tax = 0.18*+sum;
    totalSum = (sum+tax + +summery.shipping - +summery.discount).toFixed(2);
  } else{
    totalSum = (sum + +summery.shipping - +summery.discount).toFixed(2);
  }

  const quantityChangedHandler = (event)=>{
    let index = event.target.id.split(":")[1];
    var cart2 = [...cart];
    var prod = {...(cart[index])};
    prod.quantity = event.target.value;
    cart2[index] = prod;
    dispatch(updateCart(cart2));
    if(!quantityChanged) setQuantityChanged(true);
  }
  // console.log(cart);
  const discountChangeHandler = (event)=>{
    let index = event.target.id.split(":")[2];
    let cart2 = [...cart];
    var prod = {...(cart[index])};
    prod.discount = +event.target.value;
    cart2[index] = prod;
    dispatch(updateCart(cart2));
    if(!discChanged) setDiscChanged(true);
  }

  const taxCheckHandler = (event)=>{
    let summ = {...summery};
    summ.tax = !summery.tax
    let url = process.env.REACT_APP_NODE_ENV+'/upTax/';
    axios.post(url,{cart_no: cart_no, tax: summ.tax})
      .then((res) => {
        if (!res.data) {
          alert("Could Not Update tax.")
        }
      })
      .catch((res) => {alert("could not update tax")});
    dispatch(updateSummery(summ));
  }
  
  const shippingHand= (event)=>{
    let summ = {...summery};
    summ.shipping = event.target.value;
    dispatch(updateSummery(summ));
  }

  const shippingBlurHand = ()=>{
    let url = process.env.REACT_APP_NODE_ENV+'/upShip/';
    axios.post(url,{cart_no: cart_no, shipping: summery.shipping})
      .then((res) => {})
      .catch((res) => {alert("could not update shipping")});
  }

  const summDiscHand= (event)=>{
    let summ = {...summery};
    summ.discount = event.target.value;
    dispatch(updateSummery(summ));
  }
  const summDiscBlurHand= (event)=>{
    let url = process.env.REACT_APP_NODE_ENV+'/upSummeryDisc/';
    axios.post(url,{cart_no: cart_no, discount: summery.discount})
      .then((res) => {})
      .catch((res) => {alert("could not update discount")});
  }

  const addToCart = () => {
    let product_id = search.split(':')[0];
    let url = process.env.REACT_APP_NODE_ENV+'/addProductIntoCart/'+ product_id;
    axios.get(url).then((res) => {
      if (res.length === 0) {
        alert("product not found");
        setSearch("");
      }else{
        // console.log("product added in cart");
        const found = cart.findIndex((e, i) =>{
          return (e.product_id === res.data[0][0].product_id);
        });
        let cart2 = [...cart];
        if (found === -1) {
          cart2.unshift(res.data[0][0]);
        }else{
          cart2[found] = res.data[0][0];
        }
        // console.log(res.data[0][0]);
        setSearch("");
        dispatch(updateCart(cart2));
      }
    })
    .catch((e)=>{
      console.log(e);
      alert("product not found");
      setSearch("");
    });
  };

  const removeProductHandler = (e)=>{
    let url = process.env.REACT_APP_NODE_ENV+'/removeProductFromCart/'+e.target.id;
    axios.get(url).then((res) => {
      if(!res.data){
        alert("cannot delete item from cart");
      }else {
        let cart2 = [...cart];
        const i = cart.findIndex((el, i) =>{
          return (el.sl_no === Number(e.target.id));
        });
        cart2.splice(i,1);
        dispatch(updateCart(cart2));
      }
    });

  }


  const searchKeyDownHandler = (event) =>{
    if (event.keyCode === 13){
      if(search === ""){
        navigate("/sellCheckout");
      }
      else addToCart();
    }
  }

  const quanBlurHand = (event) =>{
    if(quantityChanged){
      let index = event.target.id.split(":")[1];
      let url = process.env.REACT_APP_NODE_ENV+'/upQuan/'
      axios.post(url,{sl_no: cart[index].sl_no, quantity: cart[index].quantity})
      .then((res) => {})
      .catch((res) => {alert("could not update quantity")});
      setQuantityChanged(false);
    }
  }
  
  const discBlurHand = (event) =>{
    if(discChanged){
      let index = event.target.id.split(":")[2];
      let url = process.env.REACT_APP_NODE_ENV+'/upDisc/'
      axios.post(url,{sl_no: cart[index].sl_no, discount: cart[index].discount})
      .then((res) => {})
      .catch((res) => {alert("could not update discount")});
      setDiscChanged(false);
    }
  }

  const formSubHand = (event)=>{
    event.preventDefault();
    console.log("form submitted");
    // searchRef.current.focus();
  }

  const clearCart = ()=>{
    alert('Do you want to clear the currnt cart?');
    let url = process.env.REACT_APP_NODE_ENV+'/clearCart/'+cart_no;
    axios.delete(url)
      .then((res) => {
        // console.log(res);
        dispatch(updateCart([]));
      })
      .catch((res) => {alert("could not clear cart")});
  }

  return (
    <div className="container-fluid">
      {/* <!-- <form action="/"> --> */}

      <div className="search-area">
        <div className="search-label">
          <label htmlFor="select_product">Products Name: </label>
        </div>
        <div className="search-input">
          <input
            autoFocus={true}
            type="text"
            className="form-control"
            list="product_list"
            id="select_product"
            name="product_name"
            value={search}
            onKeyDown={searchKeyDownHandler}
            onChange={(e)=>{setSearch(e.target.value);}}
            // ref={searchRef}
          />
          <datalist dir="rtl" id="product_list">
            {product_list.map((product) => (
              <option key={product.product_id}>
                {`${product.product_id} : ${product.product_name} : Stock=  ${product.stock} ,MRP=₹ ${product.mrp}`}
              </option>
            ))}
          </datalist>
        </div>
        <div className="search-button">
          <button tabIndex="-1" className="btn btn-dark" onClick={addToCart} id="listButton">
            Add to cart
          </button>
        </div>
      </div>


      <form action="" onSubmit={formSubHand} method="" id="cartForm">

      </form>


      <div className="row">
        <div className="col-lg-9">
          <h3 className="display-4">Shopping Cart : {cart_no}</h3>
          <hr />
          <div className="">
            {cart.map((element, index) => (
              <div key={element.product_id}>
                <div className="row mb-1">
                  <div className="col-md-6">
                    <div className="" style={{ padding: "0px" }}>
                      <p className="mb-0" id="">
                        <strong>{element.product_name}</strong>
                        <button
                          id={element.sl_no}
                          onClick={removeProductHandler}
                          className="btn btn-sm btn-outline-danger mt-auto float-right"
                          tabIndex="-1"
                        >
                          X
                        </button>
                      </p>
                      <p className="price-para mb-0">
                        <span className="price-label">Rate </span>
                        <span className="price">
                          ₹
                          <span id={`${element.product_id}_mrp`}>
                            {element.mrp}
                          </span>
                          /
                        </span>
                        <span className="price-label">{element.unit}</span>
                      </p>
                      <p className="mb-0">
                        <span className="stock-label">
                          In Stock {element.stock}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="col">
                    <input
                      className="quantity_input"
                      form="cartForm"
                      onChange={quantityChangedHandler}
                      onBlur={quanBlurHand}
                      type="number"
                      name={`quantity_${element.product_id}`}
                      id={`${element.product_id}:${index}`}
                      style={{ width: "70px" }}
                      value={element.quantity}
                      step='any'
                    />

                    <p
                      className="font-weight-light mb-0"
                      style={{ fontSize: "small" }}
                    >
                      <span hidden id={`${element.product_id}_totalQuantity`}>
                        {element.per_peice_quantity}
                      </span>
                      <span id={`totalQuantity_${element.product_id}`}>
                        {(
                          element.quantity * element.per_peice_quantity
                        ).toFixed(3)}
                      </span>
                      {` ` + element.unit}
                    </p>
                  </div>

                  <div className="col text-right">
                    <input
                      placeholder="Disc"
                      className="discount_input"
                      form="cartForm"
                      type="number"
                      style={{ width: "70px" }}
                      name={`discount_${element.product_id}`}
                      id={`discount:${element.product_id}:${index}`}
                      onChange= {discountChangeHandler}
                      onBlur={discBlurHand}
                      value={element.discount}
                      step="any"
                    />

                    <span hidden id={`cp_${element.product_id}`}>
                      {element.cp}
                    </span>
                    <p
                      id="discount%"
                      className="font-weight-light d-none"
                      style={{ fontSize: "small" }}
                    >
                      E2.G
                      <span id={`profit_${element.product_id}`}>
                        {(
                          ((element.mrp - element.discount - element.cp) /
                            (element.cp + 0.01)) *
                          100
                        ).toFixed(1)}
                      </span>
                    </p>
                  </div>

                  <div className="col text-right">
                    <span className="text-danger font-weight-bold">₹ </span>
                    <span id={`${element.product_id}_netPrice`}>
                      {element.mrp - element.discount}
                    </span>
                  </div>

                  <div className="col text-right">
                    <span className="text-danger font-weight-bold">₹ </span>
                    <span
                      className="amount"
                      id={`${element.product_id}_amount`}
                    >
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
          <input
            className="btn btn-danger btn-sm"
            id={cart_no}
            onClick={clearCart}
            value="Clear Cart"
            type="button"
          />
          <br />
          <br />
          <hr className="mt-0" />
        </div>
        <div className="col-lg-3">
          <h3 className="display-4">Summery</h3>
          <hr />
          <div className="border border-dark " style={{ padding: "0.9rem" }}>
            <h6>
              Subtotal (2){" "}
              <span className="text-danger float-right">
                ₹ <span id="subtotal">{sum}</span>
              </span>
            </h6>
            <p>
              <input
                checked={summery.tax}
                form="cartForm"
                type="checkbox"
                name="taxCheck"
                onChange={taxCheckHandler}
                id="taxCheck"
              />
              Tax
              <span className="float-right">
                ₹<span id="tax">{(tax)? tax.toFixed(2): 0}</span>
              </span>
            </p>
            <p>
              Shipping
              <span className="float-right">
                ₹
                <input
                  form="cartForm"
                  className="cart-input-width"
                  type="number"
                  style={{
                    border: "none",
                    outline: "none",
                    borderBottom: "1px solid black",
                  }}
                  name="shippingCost"
                  id="shippingCost"
                  onChange={shippingHand}
                  onBlur={shippingBlurHand}
                  value={summery.shipping}
                />
              </span>
            </p>
            <p>
              Discount
              <span className="float-right">
                ₹
                <input
                  form="cartForm"
                  style={{
                    border: "none",
                    outline: "none",
                    borderBottom: "1px solid black",
                  }}
                  // onchange="estimateTotal();"
                  className="cart-input-width"
                  type="number"
                  name="summury_discount"
                  id="discount"
                  value={summery.discount}
                  onChange={summDiscHand}
                  onBlur={summDiscBlurHand}
                />
              </span>
            </p>
            <h4>
              Total{" "}
              <span className="text-danger float-right">
                ₹ <span id="estimatedTotal">{totalSum}</span>
              </span>
            </h4>
          </div>

          <br />
          <input
            type="hidden"
            name="cart_no"
            form="cartForm"
            value={cart_no}
          />
          <button
            hidden
            type="submit"
            form="cartForm"
            formAction="/cart/save"
            formMethod="POST"
            className="btn btn-dark btn-lg btn-block"
          ></button>
          <Link to={"/sellCheckout"}>
            <button
              form="cartForm"
              formAction="/cart/sell"
              formMethod="POST"
              id="sell_button"
              className="btn btn-danger btn-lg btn-block"
            >
                Proceed to Sell
            </button>
          </Link>
          <Link to={"/purchaseCheckout"}>
            <button
              form="cartForm"
              formAction="/cart/sell"
              formMethod="POST"
              id="sell_button"
              className="btn btn-dark btn-lg btn-block"
            >
                Proceed to Purchase
            </button>
          </Link>
          {/* <button
            form="cartForm"
            formAction="/cart/save"
            formMethod="POST"
            className="btn btn-dark btn-lg btn-block"
          >
            Save The Cart
          </button> */}
        </div>
      </div>
    </div>
  );
}
