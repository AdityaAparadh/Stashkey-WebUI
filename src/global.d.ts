interface Window {
  turnstile: {
    render: (
      element: HTMLElement,
      options: {
        sitekey: string;
        callback: (token: string) => void;
        "expired-callback": () => void;
        "error-callback": () => void;
      },
    ) => void;
    reset: () => void;
  };
  turnstileOnLoad: () => void;
}
