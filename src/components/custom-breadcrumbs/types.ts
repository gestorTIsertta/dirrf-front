import { BreadcrumbsProps } from '@mui/material/Breadcrumbs';
import { TypographyProps } from '@mui/material/Typography';


export type BreadcrumbsLinkProps = {
  name?: string;
  href?: string;
  icon?: React.ReactElement;
};

export interface CustomBreadcrumbsProps extends BreadcrumbsProps {
  heading?: string;
  headingProps?: TypographyProps;
  moreLink?: string[];
  activeLast?: boolean;
  action?: React.ReactNode;
  links: BreadcrumbsLinkProps[];
  onGoBack?: boolean;
}
