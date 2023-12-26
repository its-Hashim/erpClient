
import {redirect} from 'react-router-dom'

export const rootLoader = async ({request, params})=>{
  // console.log('------------------FROM THE ROOT LOADER-------------------------');
  const res = await fetch(process.env.REACT_APP_NODE_ENV+'/loginReact', {
    credentials: "include",
  });
  const ret = await res.json();
  if (ret.authenticated) {
    return ret;
  }else{
    console.log('redirecting');
    return redirect('/loginApp')
  }
}

export function getTokenDuration() {
  const storedExpirationDate = localStorage.getItem('expiration');
  const expirationDate = new Date(storedExpirationDate);
  const now = new Date();
  const duration = expirationDate.getTime() - now.getTime();
  return duration;
}

export function getAuthToken() {
  const token = localStorage.getItem('token');

  if (!token) {
    return null;
  }

  const tokenDuration = getTokenDuration();

  if (tokenDuration < 0) {
    return null;
  }

  return token;
}

export async function tokenLoader() {
  const token = getAuthToken();
  if (token === null) {
    return redirect('/loginApp');
  } else {

    let userData;
    await fetch(process.env.REACT_APP_NODE_ENV+"/getUserData", {
      headers: {
        'Authorization': 'Bearer ' + token
      },
    }).then(async res=>{
      // console.warn(res.status)
      // console.warn(res.statusText)
      if (res.statusText != 'OK') {
        throw res;
      }
      userData = await res.json()
      // console.log(userData);
      // return {token, userData};
    }).catch(e=>{
      throw {msg:"No network connection"};
      // console.log(e);
    });
    return {token, userData};
  }
}

export function checkAuthLoader() {
  const token = getAuthToken();

  if (!token) {
    return redirect('/loginApp');
  }
}