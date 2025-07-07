import { useEffect } from 'react';
import { formatPageTitle, truncateDescription } from '@/utils/page-titles';

interface UsePageTitleOptions {
  title: string;
  description?: string;
  appendSiteName?: boolean;
  siteName?: string;
}

export function usePageTitle({
  title,
  description,
  appendSiteName = true,
  siteName = 'Veevent'
}: UsePageTitleOptions) {
  useEffect(() => {
    const fullTitle = appendSiteName ? formatPageTitle(title, siteName) : title;
    
    // Mettre à jour le titre de la page
    document.title = fullTitle;
    
    // Mettre à jour la meta description si fournie
    if (description) {
      const truncatedDescription = truncateDescription(description);
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', truncatedDescription);
      } else {
        const newMetaDescription = document.createElement('meta');
        newMetaDescription.name = 'description';
        newMetaDescription.content = truncatedDescription;
        document.head.appendChild(newMetaDescription);
      }
    }
    
    // Cleanup function pour restaurer le titre par défaut
    return () => {
      document.title = siteName;
    };
  }, [title, description, appendSiteName, siteName]);
} 