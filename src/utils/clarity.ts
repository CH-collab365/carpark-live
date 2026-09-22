import { NavTab } from '../components/BottomNav';

export interface TabClarityConfig {
  url: string;
  identifier: string;
  title: string;
}

// Real fixed values for page.url and page.identifier across the SPA routes
export const CLARITY_PAGE_CONFIGS: Record<NavTab, TabClarityConfig> = {
  heatmap: {
    url: 'https://ais-pre-4yf5wohrjsasx2uchikxzf-777047883511.asia-east1.run.app/#heatmap',
    identifier: 'parksg-heatmap-view',
    title: 'ParkSG - Carpark Occupancy Heatmap & Clarity Analytics'
  },
  explore: {
    url: 'https://ais-pre-4yf5wohrjsasx2uchikxzf-777047883511.asia-east1.run.app/#explore',
    identifier: 'parksg-explore-view',
    title: 'ParkSG - Explore Singapore Carparks'
  },
  map: {
    url: 'https://ais-pre-4yf5wohrjsasx2uchikxzf-777047883511.asia-east1.run.app/#map',
    identifier: 'parksg-map-view',
    title: 'ParkSG - Interactive Singapore Map View'
  },
  saved: {
    url: 'https://ais-pre-4yf5wohrjsasx2uchikxzf-777047883511.asia-east1.run.app/#saved',
    identifier: 'parksg-saved-view',
    title: 'ParkSG - Saved Favorite Carparks'
  },
  rates: {
    url: 'https://ais-pre-4yf5wohrjsasx2uchikxzf-777047883511.asia-east1.run.app/#rates',
    identifier: 'parksg-rates-view',
    title: 'ParkSG - SG Parking Rates & API Docs'
  }
};

export const CLARITY_PROJECT_ID = 'ym3p7bnb8t';

// Declare global types for window
declare global {
  interface Window {
    clarity?: (...args: any[]) => void;
    clarity_config?: any;
    page?: {
      url: string;
      identifier: string;
    };
  }
}

/**
 * Ensures the Clarity snippet script is loaded and active in the document.
 */
export function ensureClarityLoaded(projectId = CLARITY_PROJECT_ID): void {
  if (typeof window === 'undefined') return;

  // Initialize clarity stub if not present
  if (!window.clarity) {
    const clarityStub: any = function (...args: any[]) {
      (clarityStub.q = clarityStub.q || []).push(args);
    };
    window.clarity = clarityStub;
  }

  // Check if script tag already exists
  const existingScript = document.querySelector(`script[src*="clarity.ms/tag/${projectId}"]`);
  if (!existingScript) {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = `https://www.clarity.ms/tag/${projectId}`;
    const firstScript = document.getElementsByTagName('script')[0];
    if (firstScript && firstScript.parentNode) {
      firstScript.parentNode.insertBefore(script, firstScript);
    } else {
      document.head.appendChild(script);
    }
  }
}

export interface ClaritySyncResult {
  tab: NavTab;
  url: string;
  identifier: string;
  title: string;
  timestamp: string;
  reloaded: boolean;
}

/**
 * Updates Clarity's page context when switching tabs in a single-page app.
 * Replaces placeholders with real fixed values and signals route changes to Clarity.
 */
export function syncClaritySPARoute(tab: NavTab): ClaritySyncResult {
  if (typeof window === 'undefined') {
    return {
      tab,
      url: CLARITY_PAGE_CONFIGS[tab].url,
      identifier: CLARITY_PAGE_CONFIGS[tab].identifier,
      title: CLARITY_PAGE_CONFIGS[tab].title,
      timestamp: new Date().toLocaleTimeString(),
      reloaded: true
    };
  }

  const config = CLARITY_PAGE_CONFIGS[tab] || CLARITY_PAGE_CONFIGS.heatmap;
  const now = new Date().toLocaleTimeString();

  // 1. Set real fixed values on window.page
  window.page = {
    url: config.url,
    identifier: config.identifier
  };

  // 2. Set clarity_config function with fixed properties (not commented out or placeholders)
  window.clarity_config = function () {
    (this as any).page = (this as any).page || {};
    (this as any).page.url = config.url;
    (this as any).page.identifier = config.identifier;
  };

  // 3. Make sure the script is initialized
  ensureClarityLoaded(CLARITY_PROJECT_ID);

  // 4. Send SPA virtual page updates to Microsoft Clarity via the Clarity API
  if (typeof window.clarity === 'function') {
    try {
      // Set page dimensions and identifiers
      window.clarity('set', 'page.url', config.url);
      window.clarity('set', 'page.identifier', config.identifier);
      window.clarity('set', 'active_tab', tab);

      // Identify the page view with custom-page-id for Clarity's Identify API
      window.clarity('identify', 'visitor_user', undefined, config.identifier, config.title);

      // Trigger custom Clarity navigation event for session recordings
      window.clarity('event', 'spa_tab_navigated', {
        tab,
        pageUrl: config.url,
        pageIdentifier: config.identifier,
        time: now
      });
    } catch (err) {
      console.warn('Clarity tracker event error:', err);
    }
  }

  // 5. Update browser history & URL hash so Clarity's built-in SPA mutation observer detects the route
  try {
    if (window.location.hash !== `#${tab}`) {
      window.history.pushState({ tab }, config.title, `#${tab}`);
    }
    document.title = config.title;
  } catch {
    // ignore iframe cross-origin / sandbox restrictions
  }

  const result: ClaritySyncResult = {
    tab,
    url: config.url,
    identifier: config.identifier,
    title: config.title,
    timestamp: now,
    reloaded: true
  };

  // 6. Dispatch custom event for UI listeners (e.g. diagnostics in Heatmap tab)
  window.dispatchEvent(
    new CustomEvent('clarity-spa-reload', {
      detail: result
    })
  );

  return result;
}

/**
 * Manually forces a reload / refresh of the Clarity tracker for the active tab.
 */
export function reloadClarityTracker(tab: NavTab): ClaritySyncResult {
  return syncClaritySPARoute(tab);
}

/**
 * Logs custom behavioral events to Clarity (useful for heatmap interactions).
 */
export function recordClarityInteraction(eventName: string, data?: Record<string, any>): void {
  if (typeof window !== 'undefined' && typeof window.clarity === 'function') {
    try {
      window.clarity('event', eventName, data);
    } catch (e) {
      console.warn('Error recording clarity interaction:', e);
    }
  }
}
