import { GoogleLogin } from "@react-oauth/google";

import useAuth from "../../hooks/useAuth";

const GoogleLoginButton = ({ onSuccessRedirect, onError }) => {
  const { loginWithGoogle } = useAuth();

  return (
    <div className="w-full overflow-hidden rounded-lg">
      <GoogleLogin
        onSuccess={async (credentialResponse) => {
          try {
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
        width="100%"
      />
    </div>
  );
};

export default GoogleLoginButton;
