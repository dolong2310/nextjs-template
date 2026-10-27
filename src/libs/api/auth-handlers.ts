export type TokenGetter = () => string | null | undefined;
export type TokenRefresher = () => Promise<string>;
export type UnauthorizedHandler = () => void;

export interface AuthHandlers {
  getAccessToken: TokenGetter;
  refreshAccessToken?: TokenRefresher;
  onUnauthorized?: UnauthorizedHandler;
}

const defaultAuthHandlers: Readonly<AuthHandlers> = {
  getAccessToken: () => null,
};

let currentAuthHandlers: Readonly<AuthHandlers> = defaultAuthHandlers;

export function getAuthHandlers(): Readonly<AuthHandlers> {
  return currentAuthHandlers;
}

export function registerAuthHandlers(handlers: AuthHandlers): () => void {
  const registeredHandlers: Readonly<AuthHandlers> = {
    getAccessToken: handlers.getAccessToken,
    refreshAccessToken: handlers.refreshAccessToken,
    onUnauthorized: handlers.onUnauthorized,
  };

  currentAuthHandlers = registeredHandlers;

  return () => {
    if (currentAuthHandlers === registeredHandlers) {
      currentAuthHandlers = defaultAuthHandlers;
    }
  };
}
