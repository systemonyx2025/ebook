function trackEvent(name, params) {
  try {
    if (window.__CONFIG__ && window.__CONFIG__.gaAvailable && typeof window.gtag === "function") {
      window.gtag("event", name, params || {});
    }
  } catch (_) {}

  try {
    if (window.__CONFIG__ && window.__CONFIG__.pixelAvailable && typeof window.fbq === "function") {
      if (name === "page_view") {
        window.fbq("track", "PageView");
      } else if (name === "quiz_start") {
        window.fbq("track", "PageView", { event: "QuizStart" });
      } else if (name === "quiz_complete") {
        window.fbq("track", "Lead");
      } else if (name === "cta_click") {
        window.fbq("track", "InitiateCheckout");
      }
    }
  } catch (_) {}
}

document.addEventListener("DOMContentLoaded", function() {
  trackEvent("page_view");
});
