import { Link } from 'react-router-dom';

type Variant = 'primary' | 'ghost-light' | 'ghost-dark';

type Props = {
  to?: string;
  href?: string;
  variant?: Variant;
  children: React.ReactNode;
  onClick?: () => void;
};

const cls: Record<Variant, string> = {
  primary: 'pill pill-primary',
  'ghost-light': 'pill pill-ghost-light',
  'ghost-dark': 'pill pill-ghost-dark',
};

export function PillButton({ to, href, variant = 'primary', children, onClick }: Props) {
  const className = cls[variant];
  if (to) return <Link to={to} className={className}>{children}</Link>;
  if (href) return <a href={href} className={className}>{children}</a>;
  return <button type="button" onClick={onClick} className={className}>{children}</button>;
}
