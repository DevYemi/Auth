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
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential.accessToken;
          localStorage.setItem('koredeGoogleAuth', token)
          setUserToken(token)
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
  useEffect(() => { // keep user consisitent in local storage
    if (localStorage.koredeGoogleAuth) {
      const token = localStorage.getItem('koredeGoogleAuth')
      setUserToken(token)
      console.log(token)
      setLabel('Sign Out')
    }
  }, [])

  return (
    <div className="flex space-y-3 flex-col justify-center items-center h-screen">
      {
        userToken && <p> <span>your Token:</span> <span className="font-bold block max-w-[300px] break-words">{userToken}</span> </p>
      }

      <GoogleButton
        label={label}
        onClick={googleOnClick}
      />
    </div>
  );
}

export default App;
