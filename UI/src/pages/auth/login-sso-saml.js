import { useEffect } from 'react';

// ==============================|| LOGIN SSO-SAML - MAIN ||============================== //

function LoginSsoSaml() {
  useEffect(() => {
    setTimeout(() => {
      window.location.href = process.env.REACT_APP_SSO_SAML_URL;
    }, 1000);
  }, []);

  return <div>Redirecting...</div>;
}

export default LoginSsoSaml;
