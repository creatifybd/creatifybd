import { useSettings } from '../context/SettingsContext';

/**
 * Resolves SEO title/description for a given page key, preferring an
 * admin-configured override (settings.page_seo[pageKey]) over the
 * hardcoded fallback values defined in each page component.
 */
export const usePageSEO = (pageKey, fallback = {}) => {
  const { settings } = useSettings() || {};
  const override = settings?.page_seo?.[pageKey] || {};

  return {
    title: override.title?.trim() ? override.title : fallback.title,
    description: override.description?.trim() ? override.description : fallback.description
  };
};

export default usePageSEO;
