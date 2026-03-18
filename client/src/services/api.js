const RAW_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function resolveApiBaseUrl() {
  const fallback = "http://localhost:8000";

  // Handle missing or malformed env values that can produce URLs like "undefined/predict".
  if (!RAW_API_BASE_URL || RAW_API_BASE_URL === "undefined" || RAW_API_BASE_URL === "null") {
    return fallback;
  }

  return RAW_API_BASE_URL.replace(/\/+$/, "");
}

const API_BASE_URL = resolveApiBaseUrl();

const DEBUG = true;

function log(label, data) {
  if (DEBUG) {
    console.log(`[API] ${label}:`, data);
  }
}

async function apiRequest(path, options = {}) {
  log("Request Start", { path, baseURL: API_BASE_URL, method: options.method || "GET" });
  
  try {
    const fullUrl = `${API_BASE_URL}${path}`;
    log("Full URL", fullUrl);
    
    const response = await fetch(fullUrl, {
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      ...options,
    });

    log("Response Status", { status: response.status, ok: response.ok });

    const contentType = response.headers.get("content-type") || "";
    const data = contentType.includes("application/json")
      ? await response.json()
      : await response.text();

    log("Response Data", data);

    if (!response.ok) {
      const message = data?.detail || data?.message || response.statusText;
      const error = new Error(message || `Request failed with status ${response.status}`);
      log("Error", error.message);
      throw error;
    }

    return data;
  } catch (error) {
    log("Request Error", error.message);
    throw error;
  }
}

export async function predictNews(newsText) {
  return apiRequest("/predict", {
    method: "POST",
    body: JSON.stringify({ news: newsText }),
  });
}

export async function fetchAnalytics() {
  return apiRequest("/analytics");
}
