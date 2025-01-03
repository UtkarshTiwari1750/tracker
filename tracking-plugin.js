/**
 * OncoClarity Tracking Plugin
 * Version: 1.0.0
 *
 * Usage:
 * <script src="https://your-domain.com/tracking-plugin.js"></script>
 * <script>
 *   OncoTracker.init({
 *     apiEndpoint: 'https://api.your-domain.com/tracking',
 *     siteId: 'your-site-id',
 *     debugMode: true // Enable 2s tracking for testing
 *   });
 * </script>
 */

const OncoTracker = (function () {
  let config = {
    apiEndpoint: "",
    siteId: "",
    debugMode: false,
  };

  let userData = {
    phoneNumber: null,
    sessionStart: null,
    sessionId: null,
    pageVisits: [],
    currentPage: null,
    currentPageStartTime: null,
    lastSentTime: null,
    capture: {},
  };

  let trackingInterval;

  // Generate a unique session ID
  function generateSessionId() {
    return "sess_" + Math.random().toString(36).substr(2, 9);
  }

  // Track page visit
  function trackPageVisit() {
    // If there was a previous page visit, record its duration
    if (userData.currentPage) {
      const duration = Date.now() - userData.currentPageStartTime;
      userData.pageVisits.push({
        path: userData.currentPage,
        startTime: userData.currentPageStartTime,
        duration: duration,
      });
    }

    // Update current page info
    userData.currentPage = window.location.pathname + window.location.hash;
    userData.currentPageStartTime = Date.now();
  }

  // Listen for phone number input
  function setupPhoneNumberTracking() {
    document.addEventListener("change", function (e) {
      const element = e.target;
      // Look for input fields that might contain phone numbers
      if (
        element.tagName === "INPUT" &&
        (element.type === "tel" ||
          element.id.toLowerCase().includes("phone") ||
          element.name.toLowerCase().includes("phone"))
      ) {
        userData.phoneNumber = element.value;
      }
    });
  }

  // Send tracking data to server
  async function sendTrackingData() {
    if (!userData.phoneNumber) return; // Only send data if we have a phone number

    // Add the last page visit duration
    const currentPageDuration = Date.now() - userData.currentPageStartTime;
    const trackingData = {
      siteId: config.siteId,
      sessionId: userData.sessionId,
      phoneNumber: userData.phoneNumber,
      sessionStart: userData.sessionStart,
      sessionEnd: Date.now(),
      currentPage: {
        path: userData.currentPage,
        duration: currentPageDuration,
      },
      pageVisits: [...userData.pageVisits],
      timeSinceLastSent: userData.lastSentTime
        ? Date.now() - userData.lastSentTime
        : null,
      isDebugMode: config.debugMode,
      capture: userData.capture,
    };

    try {
      const response = await fetch(config.apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(trackingData),
      });

      if (!response.ok) {
        console.error("Failed to send tracking data");
      } else {
        userData.lastSentTime = Date.now();
      }
    } catch (error) {
      console.error("Error sending tracking data:", error);
    }
  }

  // Initialize the tracker
  function init(userConfig) {
    // Merge configurations
    config = { ...config, ...userConfig };

    if (!config.apiEndpoint || !config.siteId) {
      console.error("OncoTracker: apiEndpoint and siteId are required");
      return;
    }

    // Initialize session data
    userData.sessionId = generateSessionId();
    userData.sessionStart = Date.now();
    userData.lastSentTime = null;

    // Setup tracking
    setupPhoneNumberTracking();
    trackPageVisit();

    // Track page changes (for SPAs)
    let lastUrl = window.location.href;
    new MutationObserver(() => {
      const url = window.location.href;
      if (url !== lastUrl) {
        lastUrl = url;
        trackPageVisit();
      }
    }).observe(document, { subtree: true, childList: true });

    // Handle page navigation
    window.addEventListener("popstate", trackPageVisit);

    // Send data before page unload
    window.addEventListener("beforeunload", function () {
      sendTrackingData();
    });

    // Start tracking interval based on mode
    startTracking(config.debugMode);
  }

  // Start tracking with specified interval
  function startTracking(debugMode) {
    // Clear existing interval if any
    if (trackingInterval) {
      clearInterval(trackingInterval);
    }

    // Set interval based on mode
    const interval = debugMode ? 2000 : 30000;
    trackingInterval = setInterval(sendTrackingData, interval);

    // Update config
    config.debugMode = debugMode;
  }

  // Toggle debug mode
  function toggleDebugMode() {
    startTracking(!config.debugMode);
    return config.debugMode;
  }

  function capture(eventName, data) {
    if (config.debugMode) {
      if (!userData.capture[eventName]) {
        userData.capture[eventName] = [];
      }
      userData.capture[eventName].push({ name: eventName, data: data, time: Date.now() });
    }
  }
  // Public API
  return {
    init: init,
    toggleDebugMode: toggleDebugMode,
    // Expose internal data for debugging
    debug: {
      getData: () => ({
        config: { ...config },
        userData: { ...userData },
        currentTime: Date.now(),
      }),
    },
    capture: capture,
    
  };
})();

// Make it available globally
window.OncoTracker = OncoTracker;