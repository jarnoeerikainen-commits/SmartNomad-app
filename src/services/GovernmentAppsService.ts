import { CountryGovernmentApp, GovernmentService } from '@/types/governmentApps';
import { governmentApps, governmentServices } from '@/data/governmentApps';

class GovernmentAppsService {
  /**
   * Get all government apps
   */
  getAllApps(): CountryGovernmentApp[] {
    return governmentApps;
  }

  /**
   * Get government app by country code
   */
  getAppByCountryCode(countryCode: string): CountryGovernmentApp | undefined {
    return governmentApps.find(
      (app) => app.countryCode.toLowerCase() === countryCode.toLowerCase()
    );
  }

  /**
   * Search government apps by country name
   */
  searchAppsByCountry(query: string): CountryGovernmentApp[] {
    const lowerQuery = query.toLowerCase();
    return governmentApps.filter((app) =>
      app.countryName.toLowerCase().includes(lowerQuery) ||
      app.countryCode.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Filter apps by region
   */
  getAppsByRegion(region: string): CountryGovernmentApp[] {
    return governmentApps.filter(
      (app) => app.region.toLowerCase() === region.toLowerCase()
    );
  }

  /**
   * Get apps with English support
   */
  getAppsWithEnglishSupport(): CountryGovernmentApp[] {
    return governmentApps.filter((app) => app.englishSupport);
  }

  /**
   * Get apps with mobile apps available
   */
  getAppsWithMobileApp(): CountryGovernmentApp[] {
    return governmentApps.filter(
      (app) => app.appStoreUrl !== null || app.playStoreUrl !== null
    );
  }

  /**
   * Get all government services
   */
  getAllServices(): GovernmentService[] {
    return governmentServices;
  }

  /**
   * Get services by country code
   */
  getServicesByCountryCode(countryCode: string): GovernmentService[] {
    return governmentServices.filter(
      (service) => service.countryCode.toLowerCase() === countryCode.toLowerCase()
    );
  }

  /**
   * Get services by category
   */
  getServicesByCategory(category: string): GovernmentService[] {
    return governmentServices.filter(
      (service) => service.serviceCategory.toLowerCase() === category.toLowerCase()
    );
  }

  /**
   * Get digital services only
   */
  getDigitalServices(): GovernmentService[] {
    return governmentServices.filter((service) => service.digitalAvailability);
  }

  /**
   * Detect country from user location (mock implementation)
   */
  async detectUserCountry(): Promise<string | null> {
    // This would integrate with actual geolocation in production
    // For now, return null to indicate no auto-detection
    return null;
  }

  /**
   * Validate app store URLs
   */
  validateAppUrls(app: CountryGovernmentApp): boolean {
    if (!app.appStoreUrl && !app.playStoreUrl) {
      return false;
    }
    return true;
  }
}

export default new GovernmentAppsService();
