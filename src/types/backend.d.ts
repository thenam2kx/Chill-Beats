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
    _id: string;
    title: string;
    description: string;
    category: string;
    imgUrl: string;
    trackUrl: string;
    countLike: number;
    countPlay: number;
    uploader: {
      _id: string;
      email: string;
      name: string;
      role: string;
      type: string;
    };
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
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

  interface IShareTrack extends ITracksTop {
    isPlaying: boolean;
  }

  interface ITrackContext {
    currentTrack: IShareTrack;
    setCurrentTrack: (v: IShareTrack) => void;
  }

  interface ITrackComment {
    _id: string;
    content: string;
    createdAt: string;
    isDeleted: boolean;
    moment: number;
    track: string;
    user: {
      email: string;
      name: string;
      role: string;
      type: string;
      _id: string;
    };
  }

  interface ITracksLike {
    _id: string
    title: string
    description: string
    category: string
    imgUrl: string
    trackUrl: string
    countLike: number
    countPlay: number
  }
}
