const getAppParams = () => {
  if (typeof window === "undefined") {
    return {
      appId: import.meta.env.VITE_APP_ID ?? null,
      token: null,
      fromUrl: null,
      functionsVersion: import.meta.env.VITE_FUNCTIONS_VERSION ?? null,
      appBaseUrl: import.meta.env.VITE_APP_BASE_URL ?? null,
    };
  }

  const urlParams = new URLSearchParams(window.location.search);

  return {
    appId: urlParams.get("app_id") ?? import.meta.env.VITE_APP_ID ?? null,
    token: urlParams.get("access_token") ?? null,
    fromUrl: urlParams.get("from_url") ?? window.location.href,
    functionsVersion:
      urlParams.get("functions_version") ??
      import.meta.env.VITE_FUNCTIONS_VERSION ??
      null,
    appBaseUrl:
      urlParams.get("app_base_url") ??
      import.meta.env.VITE_APP_BASE_URL ??
      null,
  };
};

export const appParams = getAppParams();
