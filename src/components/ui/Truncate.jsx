import Tooltip from '@mui/material/Tooltip';
import { truncate } from '../../utils/string';

const Truncate = ({ text = '', max = 300, addEllipsis = '...' }) => {
  return (
    <Tooltip title={text}>
      <span>
        {truncate(text, max, addEllipsis)}
      </span>
    </Tooltip>
  );
};

export default Truncate;