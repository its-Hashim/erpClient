import React, { useEffect, useState } from 'react'
import TableForUseState from '../Components/TableForUseState'
import { useNavigate, useParams } from 'react-router-dom'

export default function PurchaseDetails() {

  const {id} = useParams();
  const [filterItems, setFilterItems] = useState(<></>)
  const [purchaseList, setPurchaseList] = useState([])
  const navigate = useNavigate();

  useEffect(async () => {
    let res = await fetch(process.env.REACT_APP_NODE_ENV+'/getPurchaseDetails?'+ new URLSearchParams({purchaseId: id}));
    res = await res.json()
    console.log(res);
    setPurchaseList(res.purchaseDetails[0])
    
    const subTotal = res.purchaseDetails[2][0].subTotal;
    const shipping = res.purchaseDetails[1][0].shipping;
    const disc     = res.purchaseDetails[1][0].summery_discount;
    const tax      = Math.round(res.purchaseDetails[2][0].subTotal*res.purchaseDetails[1][0].tax*0.18);
    const total    = subTotal+shipping-disc+tax;
    setFilterItems(
      <>
        <p className='lead mb-0 '>{res.purchaseDetails[1][0]["name"]}</p>
        <span className='' style={{fontSize: "1.2em"}}>Purchase Total: <strong className='text-danger text-monospace mr-4'>₹{subTotal}</strong>
        Shipping: <strong className='text-danger text-monospace mr-4'>₹{shipping}</strong>
        Discount: <strong className='text-danger text-monospace mr-4'>₹{disc}</strong>
        Tax: <strong className='text-danger text-monospace mr-4'>₹{tax}</strong>
        Total: <strong className='text-danger text-monospace mr-4'>₹{total}</strong>
        <br />
        Previous Due: <strong className='text-danger text-monospace mr-4'>₹{res.purchaseDetails[1][0].previous_due}</strong>
        Paid: <strong className='text-danger text-monospace mr-4'>₹{res.purchaseDetails[1][0].paid}</strong>
        New Due: <strong className='text-danger text-monospace mr-4'>₹{res.purchaseDetails[1][0].new_due}</strong>
        Due Date: <strong className=' text-monospace mr-4'>{res.purchaseDetails[1][0].duedate.split("T")[0]}</strong>
        </span>
      </>
    )
  }, [])

  const configureLabelBtnHandler = ()=>{
    navigate('printLabel', {state: purchaseList})
  }

  const headerItems = (<button className='btn btn-dark' onClick={configureLabelBtnHandler}>Configure Label</button>);

  return (
    <div className="container">

      <TableForUseState
        title={"Purchase Details"}
        headerItems={headerItems}
        filterItems={filterItems}
        thData={["Sl.", "Name","Quantity","Rate","Disc.","Price","Amount"]}
        trData={purchaseList}
        setPageNo={()=>{}}
        pageNo={0}
        noOfPages={1}
        />
    </div>
  )
}
