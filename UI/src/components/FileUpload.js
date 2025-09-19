import { AddAPhotoOutlined } from '@mui/icons-material';
import { Tooltip, Typography } from '@mui/material';
import { useRef, useState } from 'react';
import utils from 'utils/utils';
import LoadingButton from './@extended/LoadingButton';

export const FileUpload = ({ width, height, handleFile, page }) => {
  const hiddenFileInput = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    hiddenFileInput.current.click();
  };

  const handleChange = async (event) => {
    setIsLoading(true);
    let file = event.target.files[0];
    const fileType = file.type;
    if (fileType.startsWith('image/')) {
      file = await utils.resizeFile(file, width, height);
    }
    handleFile(file)
      .then(() => setIsLoading(false))
      .catch(() => setIsLoading(false));
  };

  return page === 'screenSaver' ? (
    <LoadingButton loading={isLoading} variant='contained' onClick={handleClick}>
      <input type='file' onChange={handleChange} ref={hiddenFileInput} accept='image/*,video/*' style={{ display: 'none' }} />
      <Typography mx={isLoading ? 1.5 : 0}>Select Image or Video</Typography>
    </LoadingButton>
  ) : page === 'menu' ? (
    <Tooltip title='Upload Image'>
      <LoadingButton loading={isLoading} onClick={handleClick} shape='rounded'>
        <input type='file' onChange={handleChange} ref={hiddenFileInput} accept='image/png' style={{ display: 'none' }} />
        <AddAPhotoOutlined />
      </LoadingButton>
    </Tooltip>
  ) : (
    <LoadingButton loading={isLoading} variant='contained' loadingPosition='start' onClick={handleClick}>
      <input type='file' onChange={handleChange} ref={hiddenFileInput} accept='image/png' style={{ display: 'none' }} />
      <Typography mx={isLoading ? 1.5 : 0}>Select Image</Typography>
    </LoadingButton>
  );
};
