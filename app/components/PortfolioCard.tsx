import React from "react";
import Portfolio from "./Portfolio";

interface PortfolioCardProps {
  /** Array of photo data to display */
  data: {
    index: number;
    src: string;
    title: string;
    category: string;
    width: number;
    height: number;
    gridArea: string;
  }[];
  /** Unique identifier for this portfolio card (used by ScrollTrigger) */
  id: string;
  /** Grid layout variant: "11", "7", "7sq" */
  gridVariant?: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Reusable portfolio card component that can be inserted between main cards.
 * Each instance needs a unique `id` for ScrollTrigger to target it correctly.
 */
const PortfolioCard: React.FC<PortfolioCardProps> = ({ data, id, gridVariant = "11", className = "" }) => {
  return (
    <section
      className={`portfolio-break portfolio-card-${id} relative bg-background dark:bg-[#050505] overflow-hidden ${className}`}
      data-portfolio-id={id}
    >
      <div className="portfolio-wrapper">
        <Portfolio data={data} fullWidth waitForTrigger gridVariant={gridVariant} />
      </div>
    </section>
  );
};

export default PortfolioCard;
