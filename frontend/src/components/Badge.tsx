import React from "react";

export type BadgeVariant = "info" | "exito" | "riesgo";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Variante del badge: info (default), exito, o riesgo */
  variant?: BadgeVariant;
  /** Contenido o texto a mostrar dentro del badge */
  children: React.ReactNode;
}

const variantStyles: Record<BadgeVariant, string> = {
  info: "bg-primary-50 text-primary-800 border-primary-100",
  exito: "bg-exito-50 text-exito-800 border-exito-200",
  riesgo: "bg-riesgo-50 text-riesgo-800 border-riesgo-200",
};

/**
 * Componente Badge para resaltar etiquetas, estados o categorías cortas.
 * Cumple WCAG AA y usa los tokens del tema.
 */
export function Badge({
  variant = "info",
  children,
  className = "",
  ...props
}: BadgeProps) {
  const baseStyles =
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2";
  const selectedVariantStyles = variantStyles[variant] || variantStyles.info;

  return (
    <span
      className={`${baseStyles} ${selectedVariantStyles} ${className}`.trim()}
      {...props}
    >
      {children}
    </span>
  );
}

export default Badge;
