import { ActionCreatorWithPayload } from '@reduxjs/toolkit';
import { message } from 'antd';
import { useEffect, useState } from 'react';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';
import { UploadRequestOption } from 'rc-upload/lib/interface';
import { UploadFile } from 'antd/lib/upload/interface';
import { UploadChangeParam } from 'antd/lib/upload';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useErrorMessage = (
  error: string | null,
  removeAction?: ActionCreatorWithPayload<null | string>
) => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (error) {
      message.error(error);
      if (removeAction) {
        dispatch(removeAction(null));
      }
    }
  }, [error, dispatch, removeAction]);
};

export const useSuccessMessage = (
  msg: string | null,
  removeAction?: ActionCreatorWithPayload<null | string>
) => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (msg) {
      message.success(msg);
      if (removeAction) {
        dispatch(removeAction(null));
      }
    }
  }, [dispatch, removeAction, msg]);
};

export const useImageUpload = () => {
  const [img, setImg] = useState<File | null>(null);

  const handleChange = (info: UploadChangeParam<UploadFile<any>>) => {
    if (info.file.status === 'done' && info.file.originFileObj) {
      setImg(info.file.originFileObj);
    }
  };

  const handleRemove = () => {
    setImg(null);
  };

  const dummyRequest = ({ onSuccess }: UploadRequestOption<any>) => {
    setTimeout(() => {
      if (onSuccess) {
        onSuccess('ok');
      }
    }, 0);
  };

  const beforeUpload = (file: File) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('Please, upload either JPG or PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  };

  return {
    img,
    handleChange,
    handleRemove,
    beforeUpload,
    dummyRequest,
  };
};
