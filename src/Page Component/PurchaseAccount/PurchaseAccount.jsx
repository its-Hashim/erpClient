import React, { useEffect, useState } from 'react'
import TableForUseState from '../Components/TableForUseState';

function PurchaseAccount() {

  const [pageNo, setPageNo] = useState(0);
  const [noOfPages, setNoOfPages] = useState(0);

  const [purchaseList, setPurchaseList] = useState([]);
  

  useEffect(async () => {
    let res = await fetch(process.env.REACT_APP_NODE_ENV+'/getPurchaseList?'+ new URLSearchParams({pageNo}));
    res = await res.json()
    // console.log(res);
    setPurchaseList(res.purchaseList);
    setNoOfPages(res.noOfPages);
    
  }, [pageNo])


  return (
    <div className="container">
      <TableForUseState
      title='Purchased Account'
      rowURL="/purchase/"
      thData={["ID","Date","Distributors","Total Amount","Paid"]}
      trData={purchaseList}
      pageNo={pageNo}
      setPageNo={setPageNo}
      noOfPages={noOfPages}
      />
    </div>
  )
}
export default PurchaseAccount