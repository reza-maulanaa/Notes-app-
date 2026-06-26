import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--color-ink)] text-white hover:bg-[oklch(0.25_0.015_28)] shadow-sm hover:shadow-md active:scale-[0.98]",
        primary:
          "bg-[var(--color-primary)] text-white hover:bg-[oklch(0.48_0.21_28)] shadow-sm hover:shadow-md active:scale-[0.98]",
        outline:
          "border border-[var(--color-border)] bg-white text-[var(--color-ink)] hover:bg-[var(--color-surface)] hover:border-[var(--color-ink)] active:scale-[0.98]",
        ghost:
          "text-[var(--color-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface)]",
        link: "text-[var(--color-primary)] underline-offset-4 hover:underline p-0 h-auto",
        danger:
          "bg-[var(--color-danger)] text-white hover:opacity-90 active:scale-[0.98]",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        default: "h-10 px-5 py-2",
        lg: "h-12 px-8 text-base",
        icon: "h-9 w-9 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
