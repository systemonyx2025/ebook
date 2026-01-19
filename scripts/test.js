function classify(score) {
  if (score <= 6) return { title: "Preso no Modo Automático" };
  if (score <= 10) return { title: "Em Processo de Despertar" };
  return { title: "Pronto para Assumir o Controle" };
}

function assert(name, cond) {
  if (!cond) {
    console.error("FAIL:", name);
    process.exitCode = 1;
  } else {
    console.log("PASS:", name);
  }
}

assert("score 0 -> Preso", classify(0).title === "Preso no Modo Automático");
assert("score 6 -> Preso", classify(6).title === "Preso no Modo Automático");
assert("score 7 -> Em Processo", classify(7).title === "Em Processo de Despertar");
assert("score 10 -> Em Processo", classify(10).title === "Em Processo de Despertar");
assert("score 11 -> Pronto", classify(11).title === "Pronto para Assumir o Controle");

function trackEvent(name, params) {
  try {
    if (global.__CONFIG__ && global.__CONFIG__.gaAvailable && typeof global.gtag === "function") {
      global.gtag("event", name, params || {});
    }
  } catch (_) {}
  try {
    if (global.__CONFIG__ && global.__CONFIG__.pixelAvailable && typeof global.fbq === "function") {
      if (name === "page_view") global.fbq("track", "PageView");
      else if (name === "quiz_start") global.fbq("track", "PageView", { event: "QuizStart" });
      else if (name === "quiz_complete") global.fbq("track", "Lead");
      else if (name === "cta_click") global.fbq("track", "InitiateCheckout");
    }
  } catch (_) {}
}

let calls = [];
global.__CONFIG__ = { gaAvailable: true, pixelAvailable: true };
global.gtag = (...args) => calls.push(["gtag", ...args]);
global.fbq = (...args) => calls.push(["fbq", ...args]);

trackEvent("quiz_start");
trackEvent("quiz_complete");
trackEvent("cta_click");

assert("gtag quiz_start fired", calls.some(c => c[0]==="gtag" && c[1]==="event" && c[2]==="quiz_start"));
assert("fbq Lead fired", calls.some(c => c[0]==="fbq" && c[1]==="track" && c[2]==="Lead"));
assert("fbq InitiateCheckout fired", calls.some(c => c[0]==="fbq" && c[1]==="track" && c[2]==="InitiateCheckout"));

calls = [];
global.__CONFIG__ = { gaAvailable: false, pixelAvailable: false };
delete global.gtag;
delete global.fbq;
trackEvent("quiz_start");
assert("no events without scripts", calls.length === 0);
