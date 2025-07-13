import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    './src/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  safelist: [
    "bg-green-light",
    "bg-cyan-light",
    "bg-orange-light",
    "bg-purple-light",
    "bg-blue-light",
    "bg-teal-light",
    "bg-yellow-light",
    "bg-red-light",
    "bg-green-medium",
    "bg-cyan-medium",
    "bg-orange-medium",
    "bg-purple-medium",
    "bg-blue-medium",
    "bg-teal-medium",
    "bg-yellow-medium",
    "bg-red-medium",
    "bg-magenta-light",
    "bg-magenta-medium",
    "bg-magenta-dark",
    "bg-silver-light",
    "bg-silver-medium",
    "bg-silver-dark",
    "bg-gray-light",
    "bg-gray-medium",
    "bg-gray-dark",
    "bg-bronze-light",
    "bg-bronze-medium",
    "bg-bronze-dark",
    "bg-cream-medium",
    "bg-ivory-dark",
    "bg-misty-blue-light",
    "bg-pale-lavender-medium",
    "bg-light-mint-dark",
    "w-[620px]",
    "h-[620px]",
    "sm:w-[620px]",
    "sm:h-[620px]",
    "md:w-[920px]",
    "md:h-[920px]",
    "-top-36",
    "-left-36",
    "md:-top-56",
    "md:-left-72",
    "lg:-top-56",
    "lg:-left-64",
    // Blur classes for AppleCards component
    "blur-sm",
    "blur-0",
    "backdrop-blur-lg",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontSize: {
        tiny: "0.775rem", // 10px
      },
      aspectRatio: {
        "21": "21",
        "32": "32",
        "64": "64",
      },
      screens: {
        xxs: "320px",
        xs: "375px",
        xxsm: "475px",
        xsm: "625px",
        sm: "768px",
        lsm: "868px",
        md: "1024px",
        lmd: "1124px",
        lg: "1280px",
        xl: "1440px",
        "2xl": "1536px",
        "3xl": "1765px",
        "4xl": "1920px",
      },
      fontFamily: {
        inter: ["var(--font-inter)", "sans-serif"],
      },
      boxShadow: {
        md: "inset 0 4px 6px rgba(0, 0, 0, 0.1)",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        green: {
          light: "hsl(var(--green-light))",
          medium: "hsl(var(--green-medium))",
          dark: "hsl(var(--green-dark))",
        },
        yellow: {
          light: "hsl(var(--yellow-light))",
          medium: "hsl(var(--yellow-medium))",
          dark: "hsl(var(--yellow-dark))",
        },
        blue: {
          light: "hsl(var(--blue-light))",
          medium: "hsl(var(--blue-medium))",
          dark: "hsl(var(--blue-dark))",
        },
        red: {
          light: "hsl(var(--red-light))",
          medium: "hsl(var(--red-medium))",
          dark: "hsl(var(--red-dark))",
        },
        purple: {
          light: "hsl(var(--purple-light))",
          medium: "hsl(var(--purple-medium))",
          dark: "hsl(var(--purple-dark))",
        },
        orange: {
          light: "hsl(var(--orange-light))",
          medium: "hsl(var(--orange-medium))",
          dark: "hsl(var(--orange-dark))",
        },
        teal: {
          light: "hsl(var(--teal-light))",
          medium: "hsl(var(--teal-medium))",
          dark: "hsl(var(--teal-dark))",
        },
        cyan: {
          light: "hsl(var(--cyan-light))",
          medium: "hsl(var(--cyan-medium))",
          dark: "hsl(var(--cyan-dark))",
        },
        magenta: {
          light: "hsl(var(--magenta-light))",
          medium: "hsl(var(--magenta-medium))",
          dark: "hsl(var(--magenta-dark))",
        },
        brown: {
          light: "hsl(var(--brown-light))",
          medium: "hsl(var(--brown-medium))",
          dark: "hsl(var(--brown-dark))",
        },
        silver: {
          light: "hsl(var(--silver-light))",
          medium: "hsl(var(--silver-medium))",
          dark: "hsl(var(--silver-dark))",
        },
        gray: {
          light: "hsl(var(--gray-light))",
          medium: "hsl(var(--gray-medium))",
          dark: "hsl(var(--gray-dark))",
        },
        bronze: {
          light: "hsl(var(--bronze-light))",
          medium: "hsl(var(--bronze-medium))",
          dark: "hsl(var(--bronze-dark))",
        },
        cream: "hsl(var(--cream))",
        ivory: "hsl(var(--ivory))",
        "misty-blue": "hsl(var(--misty-blue))",
        "pale-lavender": "hsl(var(--pale-lavender))",
        "powder-pink": "hsl(var(--powder-pink))",
        "soft-peach": "hsl(var(--soft-peach))",
        "light-mint": "hsl(var(--light-mint))",
        "frosted-teal": "hsl(var(--frosted-teal))",
        "dewy-green": "hsl(var(--dewy-green))",
      },
      animation: {
        scroll:
          "scroll var(--animation-duration, 40s) var(--animation-direction, forwards) linear infinite",
        "ping-large": "ping-large 1s ease-in-out infinite",
        "move-left": "move-left 1s linear infinite",
        "move-right": "move-right 1s linear infinite",
        "loop-scroll": "loop-scroll 30s linear infinite",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "loop-scroll": {
          "0%": {
            transform: "translateX(0%)",
          },
          "100%": {
            transform: "translateX(-50%)",
          },
        },
        scroll: {
          to: {
            transform: "translate(calc(-50% - 0.5rem))",
          },
        },
        "move-left": {
          "0%": {
            transform: "translateX(0)",
          },
          "100%": {
            transform: "translateX(-50%)",
          },
        },
        "move-right": {
          "0%": {
            transform: "translateX(-50%)",
          },
          "100%": {
            transform: "translateX(0%)",
          },
        },
        rotateGradient: {
          "0%": {
            backgroundPosition: "0% 0%",
          },
          "100%": {
            backgroundPosition: "100% 100%",
          },
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("@tailwindcss/aspect-ratio")],
} satisfies Config;
