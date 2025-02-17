/* eslint-disable @typescript-eslint/no-explicit-any */
export {};

declare global {
  interface IRequest {
    url: string;
    method: string;
    body?: { [key: string]: any };
    queryParams?: any;
    useCredentials?: boolean;
    headers?: any;
    nextOption?: any;
  }

  interface ITracksTop {
    _id: string
    title: string
    description: string
    category: string
    imgUrl: string
    trackUrl: string
    countLike: string
    countPlay: string
    uploader: {
        _id: string,
        email: string,
        name: string
        role: string
        type: string
    }
    isDeleted: false
    createdAt: string
    updatedAt: string
  }

  interface IBackendRes<T> {
    error?: string | string[];
    message: string;
    statusCode: number | string;
    data?: T;
  }

  interface IModelPaginate<T> {
    meta: {
      current: number;
      pageSize: number;
      pages: number;
      total: number;
    };
    result: T[];
  }

}
