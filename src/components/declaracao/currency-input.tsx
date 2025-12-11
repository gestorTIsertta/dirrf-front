import { TextField, TextFieldProps } from '@mui/material';
import { useState, useEffect, useRef } from 'react';

interface CurrencyInputFieldProps extends Omit<TextFieldProps, 'value' | 'onChange'> {
  value: string;
  onChange: (value: string | undefined) => void;
}

export function CurrencyInputField({ value, onChange, ...textFieldProps }: CurrencyInputFieldProps) {
  const { InputProps: textFieldInputProps, ...restTextFieldProps } = textFieldProps;
  const [displayValue, setDisplayValue] = useState('');
  const isInternalChange = useRef(false);

  // Converte valor formatado (R$ 1.000,50) para número
  const parseValue = (val: string): number => {
    if (!val || val.trim() === '') return 0;
    const cleaned = val.replace(/R\$\s?/g, '').replace(/\./g, '').replace(/,/g, '.').trim();
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
  };

  // Formata número para string brasileira (R$ 1.000,50)
  const formatValue = (num: number): string => {
    if (num === 0) return '';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(num);
  };

  // Converte número para formato raw (ex: 1000,50)
  const toRawValue = (num: number): string => {
    if (num === 0) return '';
    return num.toFixed(2).replace('.', ',');
  };

  // Inicializa o valor de exibição
  useEffect(() => {
    if (!isInternalChange.current) {
      if (value) {
        const num = parseValue(value);
        setDisplayValue(num > 0 ? toRawValue(num) : '');
      } else {
        setDisplayValue('');
      }
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Permite apagar completamente
    if (inputValue === '') {
      setDisplayValue('');
      return;
    }

    // Remove tudo exceto números e vírgula
    const cleaned = inputValue.replace(/[^\d,]/g, '');
    
    // Garante que há apenas uma vírgula
    const parts = cleaned.split(',');
    let normalized = parts[0] || '';
    if (parts.length > 1) {
      // Limita a 2 casas decimais
      normalized += ',' + parts.slice(1).join('').substring(0, 2);
    }

    // Se não há nada válido, limpa
    if (normalized === '' || normalized === ',') {
      setDisplayValue('');
      return;
    }

    // Atualiza apenas o display durante a digitação (sem formatar)
    setDisplayValue(normalized);
  };

  const handleBlur = () => {
    // Formata o valor ao sair do campo e atualiza o callback
    if (displayValue) {
      const num = parseValue(displayValue.replace(',', '.'));
      if (num > 0) {
        const formatted = formatValue(num);
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
