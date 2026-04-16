import React from "react";

interface TextBreakProps {
  /** Main text to display */
  text: string;
  /** Optional subtitle */
  subtitle?: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Simple text section similar to Intro/Outro.
 * Can be inserted between sections to break up scrolling.
 */
const TextBreak: React.FC<TextBreakProps> = ({ text, subtitle, className = "" }) => {
  return (
    <section className={`text-break ${className}`}>
      <h1>{text}</h1>
      {subtitle && <p>{subtitle}</p>}
    </section>
  );
};

export default TextBreak;
