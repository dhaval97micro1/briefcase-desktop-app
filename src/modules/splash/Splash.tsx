import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import {
  OAuthProvider,
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
} from "firebase/auth";
import { getToken, setToken, storeUser } from "src/helpers/storage";
import { useCallback, useEffect, useState } from "react";
import auth from "src/helpers/http/auth";
import classNames from "classnames";
import { googleAuthProvider } from "../../firebase";
// const { ipcRenderer } = require("electron");
// import { ipcRenderer } from "electron";
// const ElectronGoogleOAuth2 =
//   require("@getstation/electron-google-oauth2").default;

const url = window.location.href;
const searchParams = new URLSearchParams(url);
const oauthToken = searchParams.get("access_token");

const firebaseConfig = {
  apiKey: "AIzaSyA_4LCImnqI8Oi7pS_RI6ewwV4014rQjzg",
  authDomain: "briefcase-b5d63.firebaseapp.com",
  databaseURL: "https://briefcase-b5d63-default-rtdb.firebaseio.com",
  projectId: "briefcase-b5d63",
  storageBucket: "briefcase-b5d63.appspot.com",
  messagingSenderId: "1017978940318",
  appId: "1:1017978940318:web:74d9927285b9fc2a7f448f",
  measurementId: "G-JJ3EBHFQXG",
};
const provider = new OAuthProvider("apple.com");
provider.addScope("email");
provider.addScope("name");

// if (!firebase.apps.length) {
//   firebase.initializeApp(firebaseConfig);
// }

// export const FAuth = firebase.auth();
// export const googleAuthProvider = new GoogleAuthProvider();
// export const appleProvider = new firebase.auth.OAuthProvider("apple.com");
// googleAuthProvider.setCustomParameters({
//   prompt: "select_account",
//   //   redirect_uri: "https://briefcase-b5d63.firebaseapp.com",
// });

const Splash = () => {
  const [oauthToken, setOAuthToken] = useState(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const myWindow: any = window;

  const fetchGoogleProfile = useCallback(async (token: string) => {
    try {
      const response = await fetch(
        "https://www.googleapis.com/oauth2/v1/userinfo",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const profileData = await response.json();
        const userInfo = {
          socialAccountType: "google",
          email: profileData?.email,
          socialId: profileData?.id,
          firstName: profileData?.givenName,
          lastName: profileData?.familyName,
          userImage: profileData?.picture,
        };
        loginWithApi(userInfo);
      } else {
        console.error("Failed to fetch Google profile:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching Google profile:", error);
    }
  }, []);

  useEffect(() => {
    // Listen for data from Electron
    if (myWindow.loginWGauth) {
      myWindow.loginWGauth.onDataFromElectron((data: any) => {
        // Update state with the received data
        fetchGoogleProfile(data);
      });

      // Cleanup the listener when the component unmounts
      // return () => {
      //   myWindow.loginWGauth.removeAllListeners("data-from-electron");
      // };
    }
  }, [fetchGoogleProfile, myWindow.loginWGauth]);

  const goToApp = useCallback(() => {
    window.location.replace("/#/documents");
  }, []);

  const validateAuthentication = useCallback(async () => {
    const token = await getToken();
    if (token) {
      goToApp();
    }
    setIsLoading(false);
  }, [goToApp]);

  useEffect(() => {
    setTimeout(() => {
      validateAuthentication();
    }, 1000);
  }, [validateAuthentication]);

  const { loginWGauth } = myWindow;

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    !!loginWGauth && loginWGauth.send("call-my-function", "Hellolo");
    // const myApiOauth = new ElectronGoogleOAuth2(
    //   "659220311316-1qh6kl8m9iamt58oh3dlgbg7j3qj93jh.apps.googleusercontent.com",
    //   "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",
    //   [
    //     "https://www.googleapis.com/auth/userinfo.email",
    //     "https://www.googleapis.com/auth/userinfo.profile",
    //   ]
    // );
    // myApiOauth.openAuthWindowAndGetTokens().then((token) => {
    //   console.log("TOKENN: " + token);
    //   // use your token.access_token
    // });
    // const GOOGLE_AUTH_URL =
    //   "https://accounts.google.com/o/oauth2/auth?client_id=659220311316-1qh6kl8m9iamt58oh3dlgbg7j3qj93jh.apps.googleusercontent.com&redirect_uri=http://localhost:3000&scope=profile email&response_type=code";
    // const oauthPopup: any = window.open(GOOGLE_AUTH_URL);
    // const pollPopup = () => {
    //   try {
    //     if (oauthPopup.location.href.startsWith("http://localhost:3000")) {
    //       console.log(
    //         "oauthPopup.location.search: " + oauthPopup.location.search
    //       );
    //       const oauthToken = oauthPopup.location.search.split("code=")[1];
    //       console.log(oauthToken);
    //       const token = oauthToken?.split("&scope")[0];
    //       console.log("token: " + token);
    //       clearInterval(pollInterval);
    //       // Send the OAuth token to the main Electron process using IPC.
    //       // ipcRenderer.send('oauth-callback', oauthToken);
    //       oauthPopup.close();
    //     }
    //   } catch (error) {
    //     // Ignore cross-origin security errors.
    //   }
    // };
    // const pollInterval = setInterval(pollPopup, 3000);
    // try {
    //   const auth = getAuth();
    //   const result: any = await signInWithPopup(auth, googleAuthProvider);
    //   console.log("result: " + JSON.stringify(result));
    //   const userInfo = result?.user;
    //   const user: any = {
    //     socialAccountType: "google",
    //     email: userInfo?.email,
    //     socialId: userInfo?.providerData[0]?.uid,
    //     firstName: result?._tokenResponse?.firstName,
    //     lastName: result?._tokenResponse?.lastName,
    //     userImage: userInfo?.photoURL,
    //   };
    //   loginWithApi(user);
    // } catch (error: any) {
    //   setIsLoading(false);
    //   console.log(error);
    //   alert(JSON.stringify(error));
    // }
  };

  const loginWithApi = async (user: any) => {
    auth
      .login(user)
      .then(async (res) => {
        console.log("api res: ", res);
        if (res?.statusCode) {
          if (res?.body?.accessToken) {
            await setToken(res?.body?.accessToken);
            console.log("user: " + JSON.stringify(user));
            await storeUser({
              ...user,
              userId: res?.body?.userId,
            });
            setIsLoading(false);
            window.location.replace("/#/documents");
          }
        } else {
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.log("err: " + JSON.stringify(err));
        setIsLoading(false);
      });
  };

  return (
    <div className="w-full h-[96vh] flex flex-col items-center justify-center">
      <img
        alt="logo"
        src="logo.png"
        className="h-[127px] w-[180px] transition-all zoom-in-zoom-out"
      />
      <button
        className={classNames(
          "flex items-center bg-black rounded-full p-2 pr-5 gap-2 mt-8",
          {
            "opacity-70": isLoading,
          }
        )}
        onClick={handleGoogleLogin}
        disabled={isLoading}
      >
        <GoogleIcon />{" "}
        <span className="text-white font-medium text-lg">
          {!isLoading ? "Continue with Google" : "Authenticating..."}
        </span>
      </button>
    </div>
  );
};

export default Splash;

const GoogleIcon = () => (
  <svg viewBox="0 0 48 48" width="35px" height="35px">
    <path
      fill="#FFC107"
      d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
    />
    <path
      fill="#FF3D00"
      d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
    />
    <path
      fill="#4CAF50"
      d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
    />
    <path
      fill="#1976D2"
      d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
    />
  </svg>
);
