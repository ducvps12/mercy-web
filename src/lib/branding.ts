/**
 * Branding helpers
 * Stores admin-customizable logo settings (desktop / mobile, light / dark variants)
 * in localStorage so the Header and other components can pick them up.
 *
 * Empty string for any logo field means "use the bundled default" — the Header is
 * responsible for falling back to its own imported defaults.
 */
import logoWhiteDefault from "@/assets/logo/logowhite.png";
import logoBlackDefault from "@/assets/logo/logoBlack.png";

export const BRANDING_STORAGE_KEY = "mercy_branding";
export const BRANDING_UPDATED_EVENT = "mercy:branding-updated";

/** Resolved fallback URLs for components that want a non-empty value */
export const builtInLogos = {
  light: logoWhiteDefault,
  dark: logoBlackDefault,
};

export interface BrandingSettings {
  /** Logo on dark/red header (desktop). Empty = use bundled default */
  logoLight: string;
  /** Logo on light/dark theme (desktop). Empty = use bundled default */
  logoDark: string;
  /** Optional override for mobile header — empty falls back to logoLight (or bundled default) */
  logoLightMobile: string;
  /** Optional override for mobile header — empty falls back to logoDark (or bundled default) */
  logoDarkMobile: string;
  /** Logo height in px on desktop header */
  logoHeightDesktop: number;
  /** Logo height in px on mobile header (top red bar) */
  logoHeightMobile: number;
  /** Logo height in px in mobile sidebar header */
  logoHeightSidebar: number;
  /** Background style of mobile sidebar header: "red" (brand) or "white" (clean) */
  sidebarHeaderStyle: "red" | "white";
  /** Height of the top mobile header bar (red bar) in px */
  headerHeightMobile: number;
  /** Height of the top desktop header bar in px */
  headerHeightDesktop: number;
}

export const defaultBranding: BrandingSettings = {
  logoLight: "",
  logoDark: "",
  logoLightMobile: "",
  logoDarkMobile: "",
  logoHeightDesktop: 80,
  logoHeightMobile: 64,
  logoHeightSidebar: 80,
  sidebarHeaderStyle: "white",
  headerHeightMobile: 68,
  headerHeightDesktop: 88,
};

export function getBranding(): BrandingSettings {
  try {
    const saved = localStorage.getItem(BRANDING_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as Partial<BrandingSettings>;
      // Migrate ugly default Vite import paths from older versions to empty
      const isViteAssetPath = (s?: string) =>
        !!s && (s.startsWith("/src/assets/") || s.includes("/assets/logo/logowhite") || s.includes("/assets/logo/logoBlack"));
      if (isViteAssetPath(parsed.logoLight)) parsed.logoLight = "";
      if (isViteAssetPath(parsed.logoDark)) parsed.logoDark = "";
      if (isViteAssetPath(parsed.logoLightMobile)) parsed.logoLightMobile = "";
      if (isViteAssetPath(parsed.logoDarkMobile)) parsed.logoDarkMobile = "";
      // Migrate old defaults (56px) → new defaults (64px) so existing users get the bigger mobile logo
      if (parsed.logoHeightMobile === 56) parsed.logoHeightMobile = defaultBranding.logoHeightMobile;
      if (parsed.logoHeightSidebar === 56) parsed.logoHeightSidebar = defaultBranding.logoHeightSidebar;
      return { ...defaultBranding, ...parsed };
    }
  } catch {}
  return defaultBranding;
}

export function saveBranding(b: BrandingSettings) {
  localStorage.setItem(BRANDING_STORAGE_KEY, JSON.stringify(b));
  window.dispatchEvent(new Event(BRANDING_UPDATED_EVENT));
}

/**
 * Resolve a branding settings record into a guaranteed-non-empty set of URLs
 * to render. Components should prefer this helper over reading the raw fields.
 */
export function resolveBranding(b: BrandingSettings) {
  const logoLight = b.logoLight || builtInLogos.light;
  const logoDark = b.logoDark || builtInLogos.dark;
  return {
    ...b,
    logoLight,
    logoDark,
    logoLightMobile: b.logoLightMobile || logoLight,
    logoDarkMobile: b.logoDarkMobile || logoDark,
  };
}
