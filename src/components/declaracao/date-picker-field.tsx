import { TextFieldProps } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { CalendarToday as CalendarIcon } from '@mui/icons-material';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/pt-br';
import { COLORS } from 'src/constants/declaracao';

interface DatePickerFieldProps extends Omit<TextFieldProps, 'value' | 'onChange'> {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CalendarIconComponent = () => (
  <CalendarIcon
    sx={{
      color: COLORS.primary,
      fontSize: 22,
    }}
  />
);

export function DatePickerField({ value, onChange, label, required, ...props }: Readonly<DatePickerFieldProps>) {
  const dayjsValue = value ? dayjs(value) : null;

  const handleChange = (newValue: Dayjs | null) => {
    if (newValue) {
      const formattedDate = newValue.format('YYYY-MM-DD');
      const syntheticEvent = {
        target: { value: formattedDate },
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(syntheticEvent);
    } else {
      const syntheticEvent = {
        target: { value: '' },
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(syntheticEvent);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
      <DatePicker
        label={label}
        value={dayjsValue}
        onChange={handleChange}
        minDate={dayjs('2000-01-01')}
        maxDate={dayjs()}
        slotProps={{
          textField: {
            fullWidth: true,
            required,
            InputLabelProps: { shrink: true },
            ...props,
            sx: {
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: COLORS.grey100,
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  backgroundColor: '#FFFFFF',
                  '& fieldset': {
                    borderColor: COLORS.primary,
                    borderWidth: 2,
                  },
                },
                '&.Mui-focused': {
                  backgroundColor: '#FFFFFF',
                  '& fieldset': {
                    borderColor: COLORS.primary,
                    borderWidth: 2,
                  },
                },
                '& fieldset': {
                  borderColor: COLORS.grey200,
                  borderWidth: 1.5,
                },
              },
              '& .MuiInputLabel-root': {
                fontWeight: 600,
                color: COLORS.grey600,
                '&.Mui-focused': {
                  color: COLORS.primary,
                  fontWeight: 700,
                },
              },
            },
          },
        }}
        sx={{
          width: '100%',
          '& .MuiPickersPopper-root': {
            zIndex: 9999,
          },
        }}
        slots={{
          openPickerIcon: CalendarIconComponent,
        }}
        format="DD/MM/YYYY"
      />
    </LocalizationProvider>
  );
}
