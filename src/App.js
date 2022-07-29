import GoogleButton from 'react-google-button'
import { signInWithPopup } from "firebase/auth";
import { auth } from './firebase.js'
import { GoogleAuthProvider } from "firebase/auth";
import { useEffect, useState } from 'react';

function App() {
  const [userToken, setUserToken] = useState(null); // userToken
  const [label, setLabel] = useState('Sign In With Google') // 
  const googleOnClick = () => {
    if (userToken) { // Log out if there is a user
      setUserToken(null)
      setLabel('Sign In With Google')
      localStorage.removeItem('koredeGoogleAuth')
    } else { // Sign in user
      const provider = new GoogleAuthProvider();
      signInWithPopup(auth, provider)
        .then((result) => {
          // This gives you a Google Access Token. You can use it to access the Google API.
          localStorage.setItem('koredeGoogleAuth', result.user.accessToken)
          setUserToken(result.user.accessToken)
          setLabel('Sign Out')
          console.log(result.user) // user infos
        }).catch((error) => {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          alert(`An Error occured whie signing with google, error code is ${errorCode} and the error message is ${errorMessage}`)
          // ...
        });
    }

  }

  const copyToClipboard = (e) => {
    /* Get the text */
    let copiedText = e.currentTarget.innerText


    /* Copy the text inside the text field */
    navigator.clipboard.writeText(copiedText);

  }
  useEffect(() => { // keep user consisitent in local storage
    if (localStorage.koredeGoogleAuth) {
      const token = localStorage.getItem('koredeGoogleAuth')
      setUserToken(token)
      console.log(token)
      setLabel('Sign Out')
    }
  }, [])

  return (
    <div className="text-center flex flex-col justify-center p-10 h-auto space-y-3">
      {
        userToken && <p> <span>your Token:</span> <span onClick={copyToClipboard} className="font-bold cursor-pointer block break-all">{userToken}</span> </p>
      }

      <GoogleButton
        label={label}
        className='!mx-auto'
        onClick={googleOnClick}
      />
    </div>
  );
}

export default App;
