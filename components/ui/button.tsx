import * as React from "react";
import styles from "./button.module.css";
import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "outline";
  size?: "sm" | "md" | "lg";
  asChild?: boolean;
};

export function Button({ asChild, className, variant = "primary", size = "md", ...props }: ButtonProps) {
  const classes = cn(
    styles.button,
    styles[variant],
    styles[size],
    className
  );

  if (asChild && React.isValidElement(props.children)) {
    const child = props.children as React.ReactElement<{ className?: string }>;
    return React.cloneElement(props.children, {
      className: cn(classes, child.props.className)
    } as React.HTMLAttributes<HTMLElement>);
  }

  return <button className={classes} {...props} />;
}
