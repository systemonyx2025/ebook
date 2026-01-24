function trackEvent(eventName, params = {}) {
  if (window.gtag) {
    gtag('event', eventName, params);
  }
  if (window.fbq) {
    fbq('trackCustom', eventName, params);
  }
}
