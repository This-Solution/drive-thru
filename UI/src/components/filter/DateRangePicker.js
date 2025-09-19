import { useState, useEffect } from 'react';
import { TextField } from '@mui/material';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dateHelper from 'utils/dateHelper';

export default function CjDateRangePicker({ showDateRangePicker, onDateChanges, minDate, maxDate, resetDuration }) {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [textValue, setTextValue] = useState('dd/mm/yyyy - dd/mm/yyyy');
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  useEffect(() => {
    setDates();
  }, [showDateRangePicker, resetDuration]);

  useEffect(() => {
    if (showDateRangePicker && resetDuration) {
      setStartDate(null);
      setEndDate(null);
    }
  }, [showDateRangePicker, resetDuration]);

  const setDates = () => {
    if (!showDateRangePicker) {
      setIsDatePickerOpen(false);
    } else {
      setIsDatePickerOpen(true);
    }
  };

  const onDateChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    if (start && end) {
      setIsDatePickerOpen(false);
      setTextValue(`${dateHelper.formatDate(start)} - ${dateHelper.formatDate(end)}`);
      onDateChanges(start, end);
    }
  };

  if (showDateRangePicker) {
    return (
      <>
        <DatePicker
          open={isDatePickerOpen}
          selected={startDate}
          onChange={onDateChange}
          startDate={startDate}
          endDate={endDate}
          minDate={minDate}
          maxDate={maxDate}
          dateFormat={'dd/MM/YYYY'}
          selectsRange
          showYearDropdown
          showMonthDropdown
          customInput={
            <TextField
              label='Between'
              variant='standard'
              value={textValue}
              sx={{ width: 180 }}
              InputProps={{
                onFocus: () => setIsDatePickerOpen(true)
              }}
            />
          }
        />
      </>
    );
  }
  return null;
}
