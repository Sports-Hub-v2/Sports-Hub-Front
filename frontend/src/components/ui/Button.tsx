import React from 'react';
import { cn } from '@/lib/utils'; // 공통 유틸리티로 className 병합 함수가 있다면 사용

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'danger';
}

const Button: React.FC<ButtonProps> = ({ 
  className, 
  children, 
  variant = 'default', 
  ...props 
}) => {
  const base =
    'px-4 py-1.5 rounded-md text-sm font-semibold transition-colors';

  const variants = {
    default: 'bg-yellow-400 text-black hover:bg-yellow-300',
    outline: 'border border-white text-white hover:bg-white hover:text-black',
    danger: 'bg-red-500 text-white hover:bg-red-600',
  };

  return (
    <button
      className={cn(base, variants[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
