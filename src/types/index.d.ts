export {};

declare global {
  namespace Express {
    interface Request {
      user?: any; // 👈️ turn off type checking
    }
  }

  var _pathFileImages: string;
  var _pathFileVideo: string;
  var _pathFileImgTest: string;
}

declare module 'mongoose' {
  interface Query<ResultType, DocType, THelpers = {}, RawDocType = DocType> {
    cache: (key: any) => any;
    hashKey: any;
    useCache: boolean;
    mongooseCollection: any;
  }
}
