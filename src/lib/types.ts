export type LogoPosition = "left" | "right";

export type TemplateSettings = {
  name: string;
  primaryColor: string;
  secondaryColor: string;
  showLogo: boolean;
  logoDataUrl: string | null;
  logoPosition: LogoPosition;
  headingLabel: string;
  showDescription: boolean;
  showTerms: boolean;
  terms: string;
  showStatement: boolean;
  statement: string;
};

export type ColorPreset = {
  id: string;
  label: string;
  primary: string;
  secondary: string;
};

export const COLOR_PRESETS: ColorPreset[] = [
  { id: "ink", label: "Ink", primary: "#1c1c1e", secondary: "#8e8e93" },
  { id: "cobalt", label: "Cobalt", primary: "#2f4bff", secondary: "#8a9bff" },
  { id: "forest", label: "Forest", primary: "#1f6f4a", secondary: "#8fc8a6" },
  { id: "ember", label: "Ember", primary: "#d9481f", secondary: "#f4a582" },
  { id: "plum", label: "Plum", primary: "#6b2fb3", secondary: "#c3a4ec" },
  { id: "sand", label: "Sand", primary: "#8c6a2f", secondary: "#d8bf8a" },
];

export const DEFAULT_SETTINGS: TemplateSettings = {
  name: "Standard Template",
  primaryColor: "#1c1c1e",
  secondaryColor: "#8e8e93",
  showLogo: true,
  logoDataUrl: null,
  logoPosition: "right",
  headingLabel: "Invoice",
  showDescription: true,
  showTerms: true,
  terms:
    "All services provided are non-refundable. For any disputes, please contact us within 7 days of receiving this invoice.",
  showStatement: true,
  statement: "Thank you for your business. We look forward to working with you again!",
};

export const STORAGE_KEY = "invoice-template-studio:v1";
