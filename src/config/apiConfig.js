/**
 * API Configuration
 * Toggle between using real API endpoints and localStorage fallback
 */

export const API_CONFIG = {
  // Set to true when API endpoints are available
  USE_REFUND_API: false,
  
  // Set to true when API endpoints are available
  USE_CUSTOMER_API: true,
  
  // Manager password (should be moved to environment variables in production)
  MANAGER_PASSWORD: '1234',
};

/**
 * Helper function to check if API should be used
 */
export function shouldUseApi (feature) {
  if (feature === 'refund') return API_CONFIG.USE_REFUND_API;
  if (feature === 'customer') return API_CONFIG.USE_CUSTOMER_API;
  return false;
}
