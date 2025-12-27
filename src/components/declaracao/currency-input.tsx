import { TextField, TextFieldProps } from '@mui/material';
import { useState, useEffect, useRef } from 'react';
import { parseCurrencyValue } from 'src/utils/format';

interface CurrencyInputFieldProps extends Omit<TextFieldProps, 'value' | 'onChange'> {
  value: string;
  onChange: (value: string | undefined) => void;
}

export function CurrencyInputField({ value, onChange, ...textFieldProps }: CurrencyInputFieldProps) {
  const { InputProps: textFieldInputProps, ...restTextFieldProps } = textFieldProps;
  const [displayValue, setDisplayValue] = useState('');
  const isInternalChange = useRef(false);

  const formatValue = (num: number): string => {
    if (num === 0) return '';
    const normalized = Math.round(num * 100) / 100;
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(normalized);
  };

  const toRawValue = (num: number): string => {
    if (num === 0) return '';
    const normalized = Math.round(num * 100) / 100;
    return normalized.toFixed(2).replace('.', ',');
  };

  useEffect(() => {
    if (!isInternalChange.current) {
      if (value) {
        const num = parseCurrencyValue(value);
        setDisplayValue(num > 0 ? toRawValue(num) : '');
      } else {
        setDisplayValue('');
      }
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    if (inputValue === '') {
      setDisplayValue('');
      return;
    }

    const cleaned = inputValue.replace(/[^\d,]/g, '');
    
    const parts = cleaned.split(',');
    let normalized = parts[0] || '';
    if (parts.length > 1) {
      normalized += ',' + parts.slice(1).join('').substring(0, 2);
    }

    if (normalized === '' || normalized === ',') {
      setDisplayValue('');
      return;
    }

    setDisplayValue(normalized);
  };

  const handleBlur = () => {
    if (displayValue) {
      const num = parseCurrencyValue(displayValue);
      if (num > 0) {
        const normalized = Math.round(num * 100) / 100;
        const formatted = formatValue(normalized);
        setDisplayValue(formatted);
        isInternalChange.current = true;
        onChange(formatted);
        setTimeout(() => {
          isInternalChange.current = false;
        }, 0);
      } else {
        setDisplayValue('');
        isInternalChange.current = true;
        onChange(undefined);
        setTimeout(() => {
          isInternalChange.current = false;
        }, 0);
      }
    } else {
      isInternalChange.current = true;
      onChange(undefined);
      setTimeout(() => {
        isInternalChange.current = false;
      }, 0);
    }
  };

  return (
    <TextField
      {...restTextFieldProps}
      value={displayValue}
      onChange={handleChange}
      onBlur={handleBlur}
      placeholder={textFieldProps.placeholder || '0,00'}
      InputProps={{
        ...textFieldInputProps,
        inputProps: {
          inputMode: 'decimal',
          ...textFieldInputProps?.inputProps,
        },
      }}
    />
  );
}
