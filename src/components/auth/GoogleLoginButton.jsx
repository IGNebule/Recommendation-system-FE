import { useEffect, useRef, useState } from "react";
import { GoogleLogin } from "@react-oauth/google";

import useAuth from "../../hooks/useAuth";

const GoogleLoginButton = ({ onSuccessRedirect, onError }) => {
  const { loginWithGoogle } = useAuth();

  const wrapperRef = useRef(null);
  const [buttonWidth, setButtonWidth] = useState(360);

  useEffect(() => {
    const element = wrapperRef.current;

    if (!element) return;

    const updateWidth = () => {
      const width = element.getBoundingClientRect().width;

      setButtonWidth(Math.max(220, Math.floor(width)));
    };

    updateWidth();

    const observer = new ResizeObserver(updateWidth);
    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={wrapperRef} className="w-full">
      <div className="flex w-full justify-center overflow-hidden rounded-lg">
        <GoogleLogin
          onSuccess={async (credentialResponse) => {
            try {
              if (!credentialResponse?.credential) {
                throw new Error("Google credential was not returned.");
              }

              await loginWithGoogle({
                credential: credentialResponse.credential,
              });

              if (typeof onSuccessRedirect === "function") {
                onSuccessRedirect();
              }
            } catch (err) {
              if (typeof onError === "function") {
                onError(err.message || "Google login failed");
              }
            }
          }}
          onError={() => {
            if (typeof onError === "function") {
              onError("Google login failed");
            }
          }}
          theme="filled_black"
          size="large"
          shape="rectangular"
          text="signin_with"
          logo_alignment="left"
          width={buttonWidth}
        />
      </div>
    </div>
  );
};

export default GoogleLoginButton;
