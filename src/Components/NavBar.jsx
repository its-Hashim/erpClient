import React, { useEffect } from "react";
import { Link, Outlet, useNavigate, useLoaderData, useSubmit } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {login, logout} from '../Store/authSlice'
import { getTokenDuration } from "../Util/auth";


function NavBar(props) {

  const {cart, auth}  = useSelector(state=>{return{cart:state.cart, auth: state.auth}});
  // console.log(cart);
  // console.log(auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {token, userData} = useLoaderData();
  const submit = useSubmit();

  // useEffect(()=>{
    // },[])
    
    useEffect(async () =>{
      
      
      // console.log(userData);
      // console.log(token);
      
      dispatch(login(userData))
    
    


    const tokenDuration = getTokenDuration();
    // console.log(tokenDuration);

    setTimeout(() => {
      submit(null, { action: '/logout', method: 'post' });
    }, tokenDuration);
  }, [token, submit]);

  const logoutHandler = async ()=>{
    dispatch(logout())
    submit(null, { action: '/logout', method: 'post' });
    
  }
  // const logoutHandler = async ()=>{
  //   // console.log("Handling logout")
  //   let res = await fetch(process.env.REACT_APP_NODE_ENV+"/logoutReact2",{
  //     method:'post',
  //     credentials: 'include'
  //   });
  
  //   res = await res.json()
  //   if (res.success) {
  //     navigate('/login')
  //     dispatch(logout())
  //   }
    
  // }


  let ManageDropDown = null;

  if (auth.authenticated && userData.user.position == 'manager') {
    ManageDropDown =  (auth.user.position == 'manager') &&<li className="nav-item d-inline-flex align-items-center dropdown">
                        <a
                          className="nav-link dropdown-toggle text-light"
                          href="#"
                          id="managerDropdown"
                          role="button"
                          data-toggle="dropdown"
                          aria-haspopup="true"
                          aria-expanded="false"
                        >
                          Manager
                        </a>
                        <div className="dropdown-menu" aria-labelledby="managerDropdown">
                          <Link to="/clientList" className="dropdown-item">Clients</Link>
                          <Link to="/salesList" className="dropdown-item">Sales Account</Link>
                          <Link to="/productItem" className="dropdown-item">Products</Link>
                          <Link to="/productsCatagory" className="dropdown-item">Catagories</Link>
                          {/* <!-- <a href="/clients/add" className="dropdown-item">Add Client</a> --> */}
                          {/* <!-- <a href="/send-sms" className="dropdown-item">Send SMS</a> --> */}
                          <Link to="/accounts" className="dropdown-item">
                            Cash Account
                          </Link>
                          <Link to="/distributor" className="dropdown-item">Distributors</Link>
                          <Link to="/purchase" className="dropdown-item">
                            Purchase Account
                          </Link>
                          <Link to="/signUpApp" className="dropdown-item">Add Member</Link>
                          {/* <!-- <a href="/manager/dashboard" className="dropdown-item">Dashboard</a> --> */}
                        </div>
                      </li>
  }



  return (

    <>
    <nav className="navbar navbar-expand-md navbar-dark bg-dark">
      <Link to={"/"}>
        <img src="/Images/logo.jpg" height="40px" alt="cannot load" />
      </Link>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav mr-auto">
          <div style={{width:'20px'}}></div>
          <li className="nav-item d-inline-flex align-items-center">
            <Link className="nav-link text-light" to="/product/plywood">
              Plywood
            </Link>
          </li>
          <li className="nav-item d-inline-flex align-items-center">
            <Link className="nav-link text-light" to="/product/block_board">
              Block Board
            </Link>
          </li>
          <li className=" d-inline-flex align-items-center">
            <Link className="nav-link text-light" to="/product/flush_door">
              Flush Door
            </Link>
          </li>
          <li className="nav-item d-inline-flex align-items-center dropdown">
            <a
              className="nav-link dropdown-toggle text-light"
              href="#"
              id="hardware_dropdown"
              role="button"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              Hardware
            </a>
            <div className="dropdown-menu" aria-labelledby="hardware_dropdown">
              <Link className="dropdown-item" to="/product/door_lock">
                Door Lock
              </Link>
              <Link className="dropdown-item" to="/product/l_hinges">
                L-Hinges
              </Link>
              <Link className="dropdown-item" to="/product/cupboard_lock">
                Cupboard Lock
              </Link>
              <Link className="dropdown-item" to="/product/kitchen_basket">
                Kitchen Basket
              </Link>
              <Link className="dropdown-item" to="/product/door_handle">
                Door Handle
              </Link>
              <Link className="dropdown-item" to="/product/cupboard_handle">
                Cupboard Handle
              </Link>
              <Link className="dropdown-item" to="/product/auto_hinges">
                Auto Hinges
              </Link>
              <Link className="dropdown-item" to="/product/telescopic_channel">
                Telescopic Channel
              </Link>
              <Link className="dropdown-item" to="/product/tower_bolt">
                Tower Bolt
              </Link>
              <Link className="dropdown-item" to="/product/door_stopper">
                Door Stopper
              </Link>
              <Link className="dropdown-item" to="/product/magnet">
                Magnet
              </Link>
              <Link className="dropdown-item" to="/product/curtain_socket">
                Curtain Socket
              </Link>
              <Link className="dropdown-item" to="/product/mortice_lock">
                Mortice Lock
              </Link>
              <Link className="dropdown-item" to="/product/aldrop">
                Aldrop
              </Link>
              <Link className="dropdown-item" to="/product/adhesive">
                Adhesive
              </Link>
              <Link className="dropdown-item" to="/product/hinges">
                Hinges
              </Link>
              <Link className="dropdown-item" to="/product/masking_tape">
                Masking Tape
              </Link>
              <Link className="dropdown-item" to="/product/screw">
                Screw
              </Link>
              <Link className="dropdown-item" to="/product/bed_fitting">
                Bed Fitting
              </Link>
              <Link className="dropdown-item" to="/product/hydrolic_pump">
                Pump
              </Link>
              <Link className="dropdown-item" to="/product/khuti">
                Khuti
              </Link>
              <Link className="dropdown-item" to="/product/shelve_bottom">
                L-Button
              </Link>
              <Link className="dropdown-item" to="/product/table_bracket">
                Table Bracket
              </Link>
              <Link className="dropdown-item" to="/product/wheel">
                Wheel
              </Link>
              <Link className="dropdown-item" to="/product/other_hardware_items">
                Other Hardware Item
              </Link>
            </div>
          </li>
          <li className="nav-item d-inline-flex align-items-center dropdown">
            <a
              className="nav-link dropdown-toggle text-light"
              href="#"
              id="OtherDropdown"
              role="button"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              Others
            </a>
            <div className="dropdown-menu" aria-labelledby="OtherDropdown">
              <Link className="dropdown-item" to="/product/laminates">
                Laminates
              </Link>
              <Link className="dropdown-item" to="/product/bit">
                Bit
              </Link>
            </div>
          </li>
          <li className="nav-item d-inline-flex align-items-center"></li>
          {ManageDropDown}
          {/* <li className="nav-item d-inline-flex align-items-center dropdown"> */}
            {/* <a
              className="nav-link dropdown-toggle text-light"
              href="#"
              id="dueDropdown"
              role="button"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              Due Payment
            </a> */}
            {/* <div className="dropdown-menu" aria-labelledby="dueDropdown"> */}
              {/* <!-- <a className="dropdown-item" href="/salesDuePayment">Client Payment</a> --> */}
              {/* <!-- <a className="dropdown-item" href="/purchaseDuePayment">Distributor Payment</a> --> */}
            {/* </div> */}
          {/* </li> */}
          {/* <li className="nav-item">
            <div className="input-group mb-3">
              <div className="input-group-prepend">
                <label className="input-group-text" htmlFor="inputGroupSelect01">
                  <svg
                    width="1.2em"
                    height="1.2em"
                    viewBox="0 0 16 16"
                    className="bi bi-cart-dash-fill"
                    fill="#dc3545"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1H.5zM4 14a1 1 0 1 1 2 0 1 1 0 0 1-2 0zm7 0a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM6.5 7a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1h-4z"
                    />
                  </svg>
                </label>
              </div>
              <select
                className="custom-select"
                // onChange="javascript:location.href = this.value;"
              >
                <option value="">Choose</option>
                <% for( let index=1; index < 6; index++ ) { %>
                <option value="/cart/pos/<%= index %>">
                  <%= index %>
                </option>
                <% } %> 
              </select>
            </div>
          </li> */}
        </ul>
        <ul className="navbar-nav">
          <li className="nav-item">
              <button
                className="btn btn-dark btn-outline-light btn-sm "
                type="submit"
                onClick={logoutHandler}
              >
                Log Out
              </button>
          </li>
          <li className="nav-item">
            <Link to="/settings">
              <button className="ml-2 btn btn-sm btn-light">
                <img width="20px" src="/Images/settings_icon.png" alt="" />
              </button>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
    <Outlet />
    </>
  );
}

NavBar.propTypes = {};

export default NavBar;
