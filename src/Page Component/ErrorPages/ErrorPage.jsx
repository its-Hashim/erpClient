import React from 'react'
import {useRouteError} from 'react-router-dom';
import ErrorSection from './ErrorSection/ErrorSection';

export default function ErrorPage() {
  const error = useRouteError();

  // console.log('from error page');
  // console.log(error);  
  // console.log('from error page');
  let header = 'An error occured!'
  let msg = 'Something went wrong!'
  let status = '404'

  if(error.header){
    header = error.header
    msg = error.msg
    status = error.msg

  }else if(error.status){
    status = error.status;
    header = error.statusText;
    msg = "";
  }else{
    status = '404'
    header = 'Page Not Found!'
    // msg = error.data
  }

  return (
    <ErrorSection header={header} msg={msg} status={status} />
  )
}
