import { forwardRef } from 'react';
import { Link as RouterLinkBase, LinkProps } from 'react-router-dom';


export const RouterLink = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ ...other }, ref) => <RouterLinkBase ref={ref} {...other} />
);

RouterLink.displayName = 'RouterLink';

