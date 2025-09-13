import React from 'react';
import { cn } from '../../utils/cn';
import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

const Alert = React.forwardRef(({ className, variant = 'default', ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(
      'relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground',
      {
        'border-border bg-background text-foreground': variant === 'default',
        'border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive': variant === 'destructive',
        'border-yellow-500/50 text-yellow-600 bg-yellow-50 dark:bg-yellow-900/10 dark:text-yellow-400 [&>svg]:text-yellow-600 dark:[&>svg]:text-yellow-400': variant === 'warning',
        'border-green-500/50 text-green-600 bg-green-50 dark:bg-green-900/10 dark:text-green-400 [&>svg]:text-green-600 dark:[&>svg]:text-green-400': variant === 'success',
        'border-blue-500/50 text-blue-600 bg-blue-50 dark:bg-blue-900/10 dark:text-blue-400 [&>svg]:text-blue-600 dark:[&>svg]:text-blue-400': variant === 'info'
      },
      className
    )}
    {...props}
  />
));
Alert.displayName = 'Alert';

const AlertDescription = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('text-sm [&_p]:leading-relaxed', className)}
    {...props}
  />
));
AlertDescription.displayName = 'AlertDescription';

const AlertTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn('mb-1 font-medium leading-none tracking-tight', className)}
    {...props}
  />
));
AlertTitle.displayName = 'AlertTitle';

// Alert with icon variants
const AlertWithIcon = ({ variant = 'default', title, children, className, ...props }) => {
  const icons = {
    default: Info,
    destructive: AlertCircle,
    warning: AlertTriangle,
    success: CheckCircle,
    info: Info
  };

  const Icon = icons[variant];

  return (
    <Alert variant={variant} className={className} {...props}>
      <Icon className="h-4 w-4" />
      {title && <AlertTitle>{title}</AlertTitle>}
      <AlertDescription>{children}</AlertDescription>
    </Alert>
  );
};

export { Alert, AlertDescription, AlertTitle, AlertWithIcon };
