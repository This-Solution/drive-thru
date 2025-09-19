import DownloadOutlined from '@mui/icons-material/DownloadOutlined';
import { CircularProgress, IconButton } from '@mui/material';
import { useState } from 'react';
import ExcelHelper from 'utils/export';

const ExportToExcel = ({ columns, data, fileName }) => {
  const [loading, setLoading] = useState(false);
  const handleExport = async () => {
    setLoading(true);
    const fetchData = await data();
    setLoading(false);
    if (fetchData && fetchData.length > 0) {
      ExcelHelper.exportExcel(columns, fetchData, `CjSales ${fileName}`);
    }
  };
  return (
    <IconButton title={`Export ${fileName}`} color='secondary' variant='outlined' size='small' onClick={handleExport}>
      {loading ? <CircularProgress size={24} color='secondary' /> : <DownloadOutlined />}
    </IconButton>
  );
};

export default ExportToExcel;
