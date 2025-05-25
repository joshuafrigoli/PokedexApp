///API INTERFACES///
export interface GenericResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ResponseList[];
}

export interface ResponseList {
  name: string;
  url: string;
}
