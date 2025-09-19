import * as React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

export default function AutoCompleteCheckBox() {
  return (
    <Autocomplete
      multiple
      limitTags={2}
      id='multiple-limit-tags'
      options={'Null'}
      getOptionLabel={(option) => option.title}
      defaultValue={'Null'}
      renderInput={(params) => <TextField {...params} label='limitTags' placeholder='Favorites' />}
      sx={{ width: '500px' }}
    />
  );
}
