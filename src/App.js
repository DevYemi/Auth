import GoogleButton from 'react-google-button'
import { signInWithPopup } from "firebase/auth";
import { auth, getToken, messaging, deleteToken } from './firebase.js'
import { GoogleAuthProvider } from "firebase/auth";
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [userGoogleToken, setUserGoogleToken] = useState(null); // userGoogleToken
  const [userFcmToken, setUserFcmToken] = useState(null); // userFcmToken
  const [googleLabel, setGoogleLabel] = useState('Sign In With Google') // Google button label
  const [fcmLabel, setFcmLabel] = useState("Get FCM Token") // FCM button label
  const [fcmLoading, setFcmLoading] = useState(false) // FCM loading state
  const [googleLoading, setGoogleLoading] = useState(false) // FCM loading state


  const googleOnClick = () => {
    if (userGoogleToken) { // Log out if there is a user
      setUserGoogleToken(null)
      setGoogleLabel('Sign In With Google');
      toast.success("Google says Bye Bye")
      localStorage.removeItem('koredeGoogleAuth')
    } else { // Sign in user
      setGoogleLoading(true)
      const provider = new GoogleAuthProvider();
      signInWithPopup(auth, provider)
        .then((result) => {
          // This gives you a Google Access Token. You can use it to access the Google API.
          localStorage.setItem('koredeGoogleAuth', result.user.accessToken)
          setUserGoogleToken(result.user.accessToken)
          toast.success("Login Succesfully")
          setGoogleLabel('Sign Out')
          setGoogleLoading(false)
          console.log(result.user) // user infos
        }).catch((error) => {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          setGoogleLoading(false);
          alert(`An Error occured whie signing with google, error code is ${errorCode} and the error message is ${errorMessage}`)
          // ...
        });
    }

  }

  const getFcmToken = async () => {
    if (!userFcmToken) { // get a new fcm token if there is none
      try {
        setFcmLoading(true);
        const token = await getToken(messaging, { vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY })
        if (token) {
          toast.success("FCM Token Retrieved Successfully")
          setFcmLabel("Delete Fcm Token")
          setUserFcmToken(token)
          localStorage.setItem('koredeFCMAuth', token)
        } else {
          toast.error('Ooop, Your didnt grant access to get fcm token')
        }
        setFcmLoading(false);
      } catch (err) {
        toast.error(err.message)
        console.log(err)
        setFcmLoading(false);
      }
    } else { // delete the fcm token if there is one
      try {
        setFcmLoading(true);
        await deleteToken(messaging)
        setFcmLabel("Get New FCM Token");
        setUserFcmToken(null);
        toast.success("FCM Token Delete Successfully")
        localStorage.removeItem("koredeFCMAuth")
        setFcmLoading(false);
      } catch (err) {
        toast.error("An Error occurred while deleteing FCM Token")
        setFcmLoading(false);
        console.log(err);
      }

    }

  }

  const copyToClipboard = (e, type) => {
    /* Get the text */
    let copiedText = e.currentTarget.innerText


    /* Copy the text inside the text field */
    navigator.clipboard.writeText(copiedText);

    toast.success(`${type} Token Copied!!`)

  }
  useEffect(() => { // keep user consisitent in local storage
    if (localStorage.koredeGoogleAuth) {
      const token = localStorage.getItem('koredeGoogleAuth')
      setUserGoogleToken(token)
      setGoogleLabel('Sign Out')
    } else if (localStorage.koredeFCMAuth) {
      const token = localStorage.getItem('koredeFCMAuth')
      setUserFcmToken(token)
      setFcmLabel("Delete Fcm Token")
    }

    return () => {
      //clear local storage when component is unmounting
      localStorage.removeItem("koredeGoogleAuth")
      localStorage.removeItem("koredeFCMAuth")
    }
  }, [])

  return (
    <>
      <ToastContainer autoClose={'2000'} />
      <div className="text-center flex flex-col justify-center p-10 h-auto space-y-3">
        {
          userGoogleToken && <p> <span>your Google Token:</span> <span onClick={(e) => copyToClipboard(e, "Google")} className="font-bold cursor-pointer block break-all">{userGoogleToken}</span> </p>
        }
        <GoogleButton
          label={googleLoading ? "Loading...." : googleLabel}
          className='!mx-auto'
          onClick={googleOnClick}
          disabled={googleLoading}
        />
        {
          userFcmToken && <p> <span>your FCM Token:</span> <span onClick={(e) => copyToClipboard(e, "FCM")} className="font-bold cursor-pointer block break-all">{userFcmToken}</span> </p>
        }
        <GoogleButton
          label={fcmLoading ? "Loading...." : fcmLabel}
          className='!mx-auto'
          onClick={getFcmToken}
          disabled={fcmLoading}
        />



      </div>
    </>

  );
}

export default App;
