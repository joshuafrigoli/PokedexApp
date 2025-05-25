export interface ApiTranslate {
  responseData: ResponseData;
  quotaFinished: boolean;
  mtLangSupported?: any;
  responseDetails: string;
  responseStatus: number;
  responderId?: any;
  exception_code?: any;
  matches: Match[];
}

interface Match {
  id: number | string;
  segment: string;
  translation: string;
  source: string;
  target: string;
  quality: number | string;
  reference?: string;
  'usage-count': number;
  subject: boolean | string;
  'created-by': string;
  'last-updated-by': string;
  'create-date': string;
  'last-update-date': string;
  match: number;
  penalty?: number;
  model?: string;
}

interface ResponseData {
  translatedText: string;
  match: number;
}
