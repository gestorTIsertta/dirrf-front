import React, { ReactNode } from 'react';
import {
  Paper,
  Stack,
  Typography,
  Button,
  Breadcrumbs,
  Link,
  Box,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';

interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  actionButton?: {
    label: string;
    onClick: () => void;
    variant?: 'contained' | 'outlined' | 'text';
  };
  onBack?: () => void;
  backLabel?: string;
  children?: ReactNode;
}

const COLORS = {
  primary: '#2563EB',
  grey600: '#4B5563',
};

export function PageHeader({
  title,
  subtitle,
  breadcrumbs,
  actionButton,
  onBack,
  backLabel = 'Voltar',
  children,
}: PageHeaderProps) {
  return (
    <Paper sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
          {breadcrumbs.map((item, index) => {
            const isLast = index === breadcrumbs.length - 1;
            if (isLast) {
              return (
                <Typography key={index} variant="body2" color="text.primary">
                  {item.label}
                </Typography>
              );
            }
            if (item.onClick) {
              return (
                <Link
                  key={index}
                  component="button"
                  variant="body2"
                  onClick={item.onClick}
                  sx={{ cursor: 'pointer', textDecoration: 'none' }}
                >
                  {item.label}
                </Link>
              );
            }
            if (item.href) {
              return (
                <Link
                  key={index}
                  href={item.href}
                  variant="body2"
                  sx={{ textDecoration: 'none' }}
                >
                  {item.label}
                </Link>
              );
            }
            return (
              <Typography key={index} variant="body2" color="text.secondary">
                {item.label}
              </Typography>
            );
          })}
        </Breadcrumbs>
      )}

      <Stack 
        direction={{ xs: 'column', sm: 'row' }} 
        justifyContent="space-between" 
        alignItems={{ xs: 'stretch', sm: 'center' }}
        spacing={{ xs: 2, sm: 0 }}
      >
        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          spacing={{ xs: 1, sm: 2 }} 
          alignItems={{ xs: 'flex-start', sm: 'center' }} 
          flex={1}
          sx={{ width: { xs: '100%', sm: 'auto' } }}
        >
          {onBack && (
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={onBack}
              variant="outlined"
              sx={{ width: { xs: '100%', sm: 'auto' } }}
            >
              {backLabel}
            </Button>
          )}
          <Box sx={{ width: { xs: '100%', sm: 'auto' } }}>
            <Typography 
              variant="h5" 
              fontWeight={700}
              sx={{ 
                fontSize: { xs: '1.25rem', sm: '1.5rem' },
                wordBreak: 'break-word'
              }}
            >
              {title}
            </Typography>
            {subtitle && (
              <Typography 
                variant="body2" 
                color={COLORS.grey600}
                sx={{
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  wordBreak: 'break-word',
                  mt: { xs: 0.5, sm: 0 }
                }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>
        </Stack>
        {actionButton && (
          <Button
            variant={actionButton.variant || 'contained'}
            sx={{ 
              bgcolor: actionButton.variant === 'contained' ? COLORS.primary : undefined,
              width: { xs: '100%', sm: 'auto' }
            }}
            onClick={actionButton.onClick}
          >
            {actionButton.label}
          </Button>
        )}
        {children}
      </Stack>
    </Paper>
  );
}

