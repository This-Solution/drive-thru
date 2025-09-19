import React from "react";
import { TextField, InputLabel, FormHelperText, Stack } from "@mui/material";
import PropTypes from "prop-types";

export default function CjTextField({
  label,
  name ,
  autoComplete = "off",
  id,
  value,
  onChange,
  error,
  inputProps = {},
  placeholder,
  helperText,
  ...props
}) {
  return (
    <Stack spacing={1}>
      <InputLabel sx={{ fontSize: 12 }} htmlFor={id}>
        {label}
      </InputLabel>
      <TextField
        fullWidth
        name={name}
        id={id}
        autoComplete={autoComplete}
        value={value}
        inputProps={inputProps}
        placeholder={placeholder}
        onChange={onChange}
        error={Boolean(error)}
        {...props}
      />
      <FormHelperText error={Boolean(error)}>{helperText}</FormHelperText>
    </Stack>
  );
}

CjTextField.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string,
  id: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
  inputProps: PropTypes.object,
  placeholder: PropTypes.string,
  helperText: PropTypes.string,
};
