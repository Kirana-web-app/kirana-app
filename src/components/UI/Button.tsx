import React from "react";
import { classNames } from "../../utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg" | "padding_0";
  fullWidth?: boolean;
  asChild?: boolean;
  children: React.ReactNode;
}

const getVariantClasses = (
  variant: ButtonProps["variant"] = "primary"
): string => {
  const variants = {
    primary:
      "bg-primary text-white hover:bg-primary/60 focus-visible:ring-primary ",
    secondary:
      "bg-primary-lightest text-gray-900 hover:bg-primary-lightest/60 focus-visible:ring-gray-500 text-primary",
    outline:
      "border-2 border-primary text-primary bg-transparent hover:bg-primary hover:text-white focus-visible:ring-primary",
    ghost: "text-primary hover:bg-primary/10 focus-visible:ring-primary",
  };
  return variants[variant];
};

const getSizeClasses = (size: ButtonProps["size"] = "md"): string => {
  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-3 text-base",
    lg: "px-8 py-3 text-lg",
    padding_0: "px-0 py-0",
  };
  return sizes[size];
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      fullWidth = false,
      asChild = false,
      children,
      ...props
    },
    ref
  ) => {
    const baseClasses =
      "inline-flex items-center justify-center whitespace-nowrap rounded-full font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer duration-200";
    const variantClasses = getVariantClasses(variant);
    const sizeClasses = getSizeClasses(size);
    const widthClasses = fullWidth ? "w-full" : "w-auto";

    const buttonClasses = classNames(
      baseClasses,
      variantClasses,
      sizeClasses,
      widthClasses,
      className
    );

    if (asChild) {
      return <span className={buttonClasses}>{children}</span>;
    }

    return (
      <button className={buttonClasses} ref={ref} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
