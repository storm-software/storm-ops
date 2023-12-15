import { REF_TOKEN_PREFIX, SYS_TOKEN_PREFIX, TOKEN_PREFIX } from "../types";

export const isSystemToken = (token: string) => {
  return token.startsWith(`${TOKEN_PREFIX}-${SYS_TOKEN_PREFIX}`);
};

export const isReferenceToken = (token: string) => {
  return token.startsWith(`${TOKEN_PREFIX}-${REF_TOKEN_PREFIX}`);
};

export const formatSystemToken = (token: string) => {
  return isSystemToken(token)
    ? token.replace(`${SYS_TOKEN_PREFIX}-`, "")
    : token;
};
