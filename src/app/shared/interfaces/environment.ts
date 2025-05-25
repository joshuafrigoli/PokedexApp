export interface BaseEnvironment {
  API: Api;
  DB_URL: string;
  TRANSLATE: Api;
}

interface Api {
  BASE_URL: string;
}

export interface Environment extends BaseEnvironment {
  NAME: string;
}
