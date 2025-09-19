import logoIcon from 'assets/images/logos/cj_star_logo.png';
import orderKeyIcon from 'assets/images/logos/logo_dark _short.png';
import { useSelector } from 'react-redux';

// ==============================|| LOGO ICON SVG ||============================== //

const LogoIcon = () => {

  const flavour = useSelector((state) => state.auth.flavour);
  const isExternal = false;

  return <img src={isExternal == false ? orderKeyIcon : logoIcon} alt='Logo' width='40' />;
};

export default LogoIcon;
