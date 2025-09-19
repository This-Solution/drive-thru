// material-ui
import logoIcon from 'assets/images/logos/cj_logo.svg';
import orderKeyIcon from 'assets/images/logos/logo_dark.png';
import { useSelector } from 'react-redux';

// ==============================|| LOGO SVG ||============================== //

const LogoMain = () => {

  const flavour = useSelector((state) => state.auth.flavour);
  const isExternal = false;

  return <img src={isExternal ? logoIcon : orderKeyIcon} alt='Logo' width={orderKeyIcon ? 170 : 120} height={'auto'} />;
};

export default LogoMain;
