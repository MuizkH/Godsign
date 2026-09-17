/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#005ab6", // GodSign design primary blue
        "primary-container": "#1d73dc",
        "on-primary": "#ffffff",
        "on-primary-container": "#fefcff",
        secondary: "#386188",
        "on-secondary": "#ffffff",
        "secondary-container": "#aad3ff",
        "on-secondary-container": "#315b81",
        tertiary: "#545d65",
        "tertiary-container": "#6d767d",
        "on-tertiary-container": "#fcfcff",
        background: "#f9f9ff",
        "on-background": "#191c22",
        "custom-bg": "#EAF3FC", // Workspace background tint
        navy: "#0B3D62", // Deep Navy from brand guideline
        saffron: "#FF9933", // Saffron status accent
        "custom-green": "#138808", // Green success accent
        surface: "#f9f9ff",
        "surface-dim": "#d8d9e3",
        "surface-bright": "#f9f9ff",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f2f3fc",
        "surface-container": "#ecedf7",
        "surface-container-high": "#e6e8f1",
        "surface-container-highest": "#e1e2eb",
        "on-surface": "#191c22",
        "on-surface-variant": "#414753",
        "inverse-surface": "#2d3037",
        "inverse-on-surface": "#eff0fa",
        outline: "#727784",
        "outline-variant": "#c1c6d5",
        "surface-variant": "#e1e2eb",
      },
      fontFamily: {
        sans: [
          "Inter",
          "Noto Sans",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        "label-sm": ["Inter"],
        "headline-xl": ["Noto Sans"],
        "headline-lg": ["Noto Sans"],
        "headline-md": ["Noto Sans"],
        "body-lg": ["Noto Sans"],
        "body-md": ["Noto Sans"],
        "headline-lg-mobile": ["Noto Sans"],
        "label-md": ["Inter"]
      },
      fontSize: {
        "label-sm": ["12px", { lineHeight: "16px", fontWeight: "600" }],
        "headline-xl": ["40px", { lineHeight: "48px", letterSpacing: "-0.02em", fontWeight: "700" }],
        "headline-lg": ["32px", { lineHeight: "40px", fontWeight: "700" }],
        "headline-md": ["20px", { lineHeight: "28px", fontWeight: "600" }],
        "body-lg": ["18px", { lineHeight: "28px", fontWeight: "400" }],
        "body-md": ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "headline-lg-mobile": ["24px", { lineHeight: "32px", fontWeight: "700" }],
        "label-md": ["14px", { lineHeight: "20px", letterSpacing: "0.01em", fontWeight: "500" }]
      },
      spacing: {
        xs: "4px",
        md: "16px",
        unit: "4px",
        sm: "8px",
        "margin-mobile": "16px",
        xl: "40px",
        "container-max": "1200px",
        gutter: "24px",
        lg: "24px"
      },
      borderRadius: {
        'none': '0px',
        'sm': '2px',
        'DEFAULT': '4px',
        'md': '6px',
        'lg': '8px',
        'xl': '8px',
        '2xl': '8px',
        '3xl': '8px',
        'full': '9999px',
      },
      maxWidth: {
        "container-max": "1200px",
      },
    },
  },
  plugins: [],
}
