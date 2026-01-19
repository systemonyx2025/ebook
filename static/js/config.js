window.__CONFIG__ = (function(){
  var defaults = {
    GA_ID: "",
    META_PIXEL_ID: "",
    CHECKOUT_URL: "https://pay.cakto.com.br/33emkhp_732561"
  };
  try {
    var params = new URLSearchParams(window.location.search);
    if (params.get("ga")) defaults.GA_ID = params.get("ga");
    if (params.get("pixel")) defaults.META_PIXEL_ID = params.get("pixel");
    if (params.get("checkout")) defaults.CHECKOUT_URL = params.get("checkout");
  } catch (_) {}
  return defaults;
})();
