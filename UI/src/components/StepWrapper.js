// material-ui
import { Box } from '@mui/material';

// third-part
import PropTypes from 'prop-types';

export default function StepWrapper({ children, value, index, ...other }) {
  return (
    <div role='tabpanel' hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

StepWrapper.propTypes = {
  children: PropTypes.node,
  value: PropTypes.number,
  index: PropTypes.number
};
