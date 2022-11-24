import Perfume from "perfume.js";
import UAParser from "ua-parser-js";

import { post } from "./request";

function sendBeacon(data: Record<string, unknown>) {
  const options = {
    headers: { "Content-Type": "application/json" },
    data: data,
  };

  post("https://api.skynet.hackday.live/metrics", options);
}

enum Metrics {
  "fp" = "fp",
  "fcp" = "fcp",
  "fid" = "fid",
  "lcp" = "lcp",
  "cls" = "cls",
  "tbt" = "tbt",
}

const metricMap = {
  [Metrics.fp]: "first_paint",
  [Metrics.fcp]: "first_contentful_paint",
  [Metrics.fid]: "first_input_delay",
  [Metrics.lcp]: "largest_contentful_paint",
  [Metrics.tbt]: "total_blocking_time",
  [Metrics.cls]: "cumulative_layout_shift",
};

function detectMob() {
  const toMatch = [
    /Android/i,
    /webOS/i,
    /iPhone/i,
    /iPad/i,
    /iPod/i,
    /BlackBerry/i,
    /Windows Phone/i,
  ];

  return toMatch.some((toMatchItem) => {
    return navigator.userAgent.match(toMatchItem);
  });
}

const allowedMetrics: Metrics[] = [
  Metrics.fp,
  Metrics.fcp,
  Metrics.fid,
  Metrics.lcp,
  Metrics.cls,
  Metrics.tbt,
];

const allowedBrowsers = [
  "Chrome",
  "Firefox",
  "Safari",
  "Brave",
  "Edge",
  "Opera",
  "Samsung",
];

new Perfume({
  resourceTiming: false,
  analyticsTracker: (options) => {
    const { metricName, data, navigatorInformation } = options;

    let parser = new UAParser(navigator.userAgent);
    let uaData = parser.getResults();

    if (allowedMetrics.includes(metricName as Metrics)) {
      const name = metricMap[metricName as Metrics];
      sendBeacon({
        metrics: {
          [name]: data,
        },
        metadata: {
          browser_name: allowedBrowsers.includes(uaData.browser.name)
            ? uaData.browser.name
            : "Other",
          browser_version: allowedBrowsers.includes(uaData.browser.name)
            ? uaData.browser.name
            : "",
          operating_system: uaData.os.name,
          device_memory: navigatorInformation.deviceMemory,
          hardware_concurrency: navigatorInformation.hardwareConcurrency,
          service_worker_status: navigatorInformation.serviceWorkerStatus,
          route: window.location.pathname,
          is_low_end_device: navigatorInformation.isLowEndDevice,
          is_mobile_device: detectMob(),
          is_low_end_experience: navigatorInformation.isLowEndExperience,
        },
      });
    }
  },
});
