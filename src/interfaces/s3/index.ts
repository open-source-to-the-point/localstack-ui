export interface IBucket {
  key: string;
  name: string;
  creationDate?: Date;
}

export enum ObjectType {
  FOLDER = "Folder",
  FILE = "File",
}

export interface IFileObject {
  key: number;
  name: string;
  type: ObjectType;
  extension: string;
  size: number;
  eTag: string;
  storageClass: string;
  lastModified: Date;
}

export interface IFolderObject {
  key: number;
  name: string;
  type: ObjectType;
  path: string;
}

export type IObject = IFileObject | IFolderObject;

export interface IUploadFile {
  key: string;
  name: string;
  folder: string;
  type: string;
  size: number;
  file: File;
}
