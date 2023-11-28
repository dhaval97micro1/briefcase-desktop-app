import { useCallback, useEffect, useState } from "react";
import classNames from "classnames";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { getToken, setToken, storeUser } from "src/helpers/storage";
import auth from "src/helpers/http/auth";
import { useNavigate } from "react-router";

const myWindow: any = window;

const Splash = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(true);
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
          firstName: profileData?.given_name,
          lastName: profileData?.family_name,
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
        fetchGoogleProfile(data);
      });

      // Cleanup the listener when the component unmounts
      // return () => {
      //   myWindow.loginWGauth.removeAllListeners("data-from-electron");
      // };
    }
  }, [fetchGoogleProfile]);

  const goToApp = useCallback(() => {
    navigate("/docs");
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
    console.log("loginWGauth", loginWGauth);
    if (loginWGauth) {
      setIsLoading(true);
      loginWGauth.send("call-my-function", "G-auth");
    } else {
    }
  };

  const loginWithApi = async (user: any) => {
    auth
      .login(user)
      .then(async (res) => {
        if (res?.statusCode) {
          if (res?.body?.accessToken) {
            await setToken(res?.body?.accessToken);
            await storeUser({
              ...user,
              userId: res?.body?.userId,
            });
            setIsLoading(false);
            goToApp();
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
