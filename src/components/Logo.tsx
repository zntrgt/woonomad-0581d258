import { Link } from 'react-router-dom';
import woonomadLogo from '@/assets/woonomad-logo.png';

interface LogoProps {
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Logo({ showText = true, size = 'md', className = '' }: LogoProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl',
  };

  return (
    <Link to="/" className={`flex items-center gap-2 ${className}`} aria-label="WooNomad Ana Sayfa">
      <img 
        src={woonomadLogo} 
        alt="WooNomad Logo - Dünya haritası üzerinde W harfi" 
        className={`${sizeClasses[size]} object-contain`}
      />
      {showText && (
        <span className={`font-semibold text-foreground ${textSizeClasses[size]}`}>
          WooNomad
        </span>
      )}
    </Link>
  );
}
