import Button from '@mui/material/Button';
import { useSelector } from 'react-redux';

function FlavourButton({ ...props }) {
  const { flavour } = useSelector((state) => state.auth);

  if (flavour.isExternal) return null;

  return (
    <Button {...props}>
      {props.children}
    </Button>
  );
}

export default FlavourButton;
