import { ArrayElement } from '@models';
import { DefaultFieldArgs, DefaultFieldStruture, FormFieldArgs } from '../fields.base';

export enum UploadType {
  'Image' = 'image',
  'Video' = 'video',
  'Audio' = 'audio',
  'File' = 'file',
  'Gif' = 'gif',
  'Mixed' = 'mixed',
}

// Upload ---------------------------------------------------------
export interface UploadArgs<TValue extends File = File, TInitial = string>
  extends FormFieldArgs<TValue, TInitial> {
  uploadType?: UploadType;
  displayType?: 'upload' | 'avatar';
  acceptedTypes?: string[];
}
export class UploadField<
  TValue extends File = File,
  TInitial extends string = string
> extends DefaultFieldStruture<TValue, TInitial> {
  public inForm = true;
  public uploadType?: UploadType;
  public displayType?: 'upload' | 'avatar';
  public acceptedTypes?: string[];
  constructor({ uploadType, displayType, acceptedTypes, ...fields }: UploadArgs<TValue, TInitial>) {
    super(fields);
    this.component = 'UploadElement';
    this.uploadType = uploadType || UploadType.Image;
    this.displayType = displayType || 'upload';
    this.acceptedTypes = acceptedTypes;
  }
}

// Upload multiple ---------------------------------------------------------

export interface UploadMultiplePayload<TValue extends File[], TInitial = TValue>
  extends FormFieldArgs<TValue, TInitial> {
  uploadType?: UploadType;
  onDelete?: (value: ArrayElement<TInitial>) => Promise<boolean> | void | boolean;
}
export class UploadMultipleField<
  TValue extends File[] = File[],
  TInitial extends any = TValue
> extends DefaultFieldStruture<TValue, TInitial> {
  public uploadType?: UploadType;
  public onDelete?: (value: ArrayElement<TInitial>) => Promise<boolean> | void | boolean;
  constructor({ onDelete, uploadType, ...fields }: UploadMultiplePayload<TValue, TInitial>) {
    super(fields);
    this.component = 'UploadMultipleElement';
    this.uploadType = uploadType ?? UploadType.Image;
    this.onDelete = onDelete;
  }
}
