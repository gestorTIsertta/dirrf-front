import { Icon, IconifyIcon } from '@iconify/react';
import { Box, BoxProps } from '@mui/material';

interface IconifyProps extends BoxProps {
  icon: IconifyIcon | string;
  width?: number;
  height?: number;
}

export default function Iconify({ icon, width = 20, height = 20, sx, ...other }: IconifyProps) {
  return (
    <Box
      component={Icon}
      icon={icon}
      sx={{
        width,
        height,
        ...sx,
      }}
      {...other}
    />
  );
}

