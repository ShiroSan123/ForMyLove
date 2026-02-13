import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { pagesConfig } from "@/pages.config";

export default function NavigationTracker() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { Pages, mainPage } = pagesConfig;
  const mainPageKey = mainPage ?? Object.keys(Pages)[0];

  // Log user activity when navigating to a page
  useEffect(() => {
    // Extract page name from pathname
    const pathname = location.pathname;
    let pageName;

    if (pathname === "/" || pathname === "") {
      pageName = mainPageKey;
    } else {
      // Remove leading slash and get the first segment
      const pathSegment = pathname.replace(/^\//, "").split("/")[0];

      // Try case-insensitive lookup in Pages config
      const pageKeys = Object.keys(Pages);
      const matchedKey = pageKeys.find(
        (key) => key.toLowerCase() === pathSegment.toLowerCase(),
      );

      pageName = matchedKey || null;
    }

    if (isAuthenticated && pageName && typeof window !== "undefined") {
      try {
        const key = "for_my_love_navigation_logs";
        const current = JSON.parse(localStorage.getItem(key) || "[]");
        const next = [
          ...current.slice(-99),
          { pageName, pathname, timestamp: new Date().toISOString() },
        ];
        localStorage.setItem(key, JSON.stringify(next));
      } catch {
        // Silently fail - logging shouldn't break the app
      }
    }
  }, [location, isAuthenticated, Pages, mainPageKey]);

  return null;
}
