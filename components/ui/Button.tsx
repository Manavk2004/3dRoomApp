import React from 'react'

interface ButtonProps {
    onClick: () => void | Promise<void>
    children: React.ReactNode
    className?: string
    size?: 'sm' | 'md' | 'lg'
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
}

const sizeClasses = {
    sm: 'btn-sm',
    md: 'btn-md',
    lg: 'btn-lg',
}

const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    outline: 'btn-outline',
    ghost: 'btn-ghost',
}

const Button = ({ onClick, children, className, size = 'md', variant = 'primary' }: ButtonProps) => {
  return (
    <button onClick={onClick} className={`${sizeClasses[size]} ${variantClasses[variant]}${className ? ` ${className}` : ''}`}>
        {children}
    </button>
  )
}

export default Button
