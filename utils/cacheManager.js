// Centralized cache management utility
// This provides a consistent caching interface across all services

class CacheManager {
  constructor() {
    this.caches = new Map();
    this.DEFAULT_DURATION = 5 * 60 * 1000; // 5 minutes
  }

  /**
   * Create a new cache instance
   * @param {string} name - Cache name
   * @param {number} duration - Cache duration in milliseconds
   */
  createCache(name, duration = this.DEFAULT_DURATION) {
    this.caches.set(name, {
      data: null,
      timestamp: null,
      duration: duration
    });
  }

  /**
   * Get cached data if valid
   * @param {string} name - Cache name
   * @returns {any|null} Cached data or null if expired/not found
   */
  get(name) {
    const cache = this.caches.get(name);
    if (!cache || !cache.data || !cache.timestamp) {
      return null;
    }

    const isExpired = Date.now() - cache.timestamp > cache.duration;
    if (isExpired) {
      this.clear(name);
      return null;
    }

    return cache.data;
  }

  /**
   * Set cache data
   * @param {string} name - Cache name
   * @param {any} data - Data to cache
   */
  set(name, data) {
    const cache = this.caches.get(name);
    if (cache) {
      cache.data = data;
      cache.timestamp = Date.now();
    } else {
      // Create cache if it doesn't exist
      this.createCache(name);
      this.set(name, data);
    }
  }

  /**
   * Clear specific cache
   * @param {string} name - Cache name
   */
  clear(name) {
    const cache = this.caches.get(name);
    if (cache) {
      cache.data = null;
      cache.timestamp = null;
    }
  }

  /**
   * Clear all caches
   */
  clearAll() {
    for (const [name] of this.caches) {
      this.clear(name);
    }
  }

  /**
   * Get cache status for debugging
   * @param {string} name - Cache name
   * @returns {object} Cache status information
   */
  getStatus(name) {
    const cache = this.caches.get(name);
    if (!cache) {
      return { exists: false };
    }

    const age = cache.timestamp ? Date.now() - cache.timestamp : null;
    const isExpired = age ? age > cache.duration : true;

    return {
      exists: true,
      hasData: !!cache.data,
      age: age,
      duration: cache.duration,
      isExpired: isExpired,
      expiresIn: isExpired ? 0 : cache.duration - age
    };
  }
}

// Create singleton instance
const cacheManager = new CacheManager();

// Pre-create caches for known services
cacheManager.createCache('menuItems', 5 * 60 * 1000); // 5 minutes
cacheManager.createCache('categories', 5 * 60 * 1000); // 5 minutes
cacheManager.createCache('heroImage', 5 * 60 * 1000); // 5 minutes

export default cacheManager;
