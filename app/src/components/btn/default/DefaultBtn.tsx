import { Link } from 'react-router-dom';
import React from 'react';
import './DefaultBtn.scss';

type DefaultBtnProps = {
  children: React.ReactNode;
  to?: string;
  href?: string;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  target?: '_blank' | '_self' | '_parent' | '_top';
  rel?: string;
  size?: 'small' | 'medium' | 'large'| 'custom'; 
  className?: string; 
} & React.HTMLAttributes<HTMLElement>;

function DefaultBtn({
  children,
  to,
  href,
  onClick,
  type = 'button',
  disabled = false,
  target,
  rel,
  size = 'medium', 
  className = '',
  ...rest
}: DefaultBtnProps) {
  const classes = `default-btn default-btn--${size} ${className}`.trim();

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={classes} target={target} rel={rel} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={classes}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
}

export default DefaultBtn;
