import { type ButtonHTMLAttributes } from "react";

type ButtonPillProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "filled" | "outline";
};

function ButtonPill({
  variant = "filled",
  className = "",
  children,
  ...rest
}: ButtonPillProps) {
  const baseClasses =
    "inline-flex items-center justify-center rounded-full px-4 py-1 text-xs font-medium tracking-[0.01em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300/60";

  const variantClasses =
    variant === "filled"
      ? "bg-orange-200 text-orange-700 shadow-sm hover:bg-orange-300/80"
      : "bg-orange-50 text-orange-500 border border-orange-200 hover:bg-orange-100";

  return (
    <button
      className={`${baseClasses} ${variantClasses} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

export default ButtonPill;
