// import * as React from "react";
// import { forwardRef } from "react"; // Explicitly import forwardRef
// import { cn } from "@/app/lib/utils";

// // Use explicit types for React.forwardRef
// interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}
// interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}
// interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}
// interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}
// interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}
// interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

// const Card = forwardRef<HTMLDivElement, CardProps>(({ className, ...props }, ref) => (
//   <div
//     ref={ref}
//     className={cn(
//       "rounded-xl border bg-card text-card-foreground shadow",
//       className
//     )}
//     {...props}
//   />
// ));
// Card.displayName = "Card";

// const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(({ className, ...props }, ref) => (
//   <div
//     ref={ref}
//     className={cn("flex flex-col space-y-1.5 p-6", className)}
//     {...props}
//   />
// ));
// CardHeader.displayName = "CardHeader";

// const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(({ className, ...props }, ref) => (
//   <h3
//     ref={ref}
//     className={cn("font-semibold leading-none tracking-tight", className)}
//     {...props}
//   />
// ));
// CardTitle.displayName = "CardTitle";

// const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(({ className, ...props }, ref) => (
//   <p
//     ref={ref}
//     className={cn("text-sm text-muted-foreground", className)}
//     {...props}
//   />
// ));
// CardDescription.displayName = "CardDescription";

// const CardContent = forwardRef<HTMLDivElement, CardContentProps>(({ className, ...props }, ref) => (
//   <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
// ));
// CardContent.displayName = "CardContent";

// const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(({ className, ...props }, ref) => (
//   <div
//     ref={ref}
//     className={cn("flex items-center p-6 pt-0", className)}
//     {...props}
//   />
// ));
// CardFooter.displayName = "CardFooter";

// export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
