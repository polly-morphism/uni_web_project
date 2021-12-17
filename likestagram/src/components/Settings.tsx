import { Button, Image, Upload, Form, Input, Typography } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import {
  useAppSelector,
  useAppDispatch,
  useImageUpload,
  useErrorMessage,
  useSuccessMessage,
} from '../app/hooks';
import { User } from '../app/types';
import {
  accountEditingErrorChanged,
  accountEditingSucceedMessageChanged,
  editAccount,
} from '../features/auth/authSlice';
import { useEffect } from 'react';
import Avatar from 'antd/lib/avatar/avatar';
import { UserOutlined } from '@ant-design/icons';

const { TextArea } = Input;

export const Settings = () => {
  const account = useAppSelector((state) => state.auth.account);
  const fieldsErrors = useAppSelector(
    (state) => state.auth.accountEditingFieldsErrors
  );
  const succeedMessage = useAppSelector(
    (state) => state.auth.accountEditingSucceedMessage
  );
  useSuccessMessage(succeedMessage, accountEditingSucceedMessageChanged);

  const error = useAppSelector((state) => state.auth.accountEditingError);
  useErrorMessage(error, accountEditingErrorChanged);
  const dispatch = useAppDispatch();

  const [form] = Form.useForm();
  const { img, beforeUpload, dummyRequest, handleChange, handleRemove } =
    useImageUpload();

  useEffect(() => {
    if (fieldsErrors) {
      const errorFields = (
        Object.keys(fieldsErrors) as Array<keyof typeof fieldsErrors>
      ).map((field) => ({
        name: field,
        errors: fieldsErrors[field],
      }));

      form.setFields(errorFields);
    }
  }, [fieldsErrors, form]);

  const resetHandler = () => {
    form.resetFields();
  };

  const submitHandler = (data: User) => {
    const formData = new FormData();

    (Object.keys(data) as Array<keyof typeof data>).forEach((item) => {
      formData.append(item, data[item]);
    });

    if (img) {
      formData.append('photo', img);
    }

    dispatch(editAccount(formData));
  };

  return (
    <div className="h-full flex justify-around">
      <div className="w-1/3 flex-shrink-0 flex flex-col justify-center items-center p-4">
        {account?.photo ? (
          <Image src={account.photo} width={190} />
        ) : (
          <Avatar
            className="bg-orange-300"
            size={190}
            shape="square"
            icon={<UserOutlined />}
          />
        )}

        <Upload
          className="w-48 flex flex-col justify-center mt-4"
          beforeUpload={beforeUpload}
          onChange={handleChange}
          onRemove={handleRemove}
          customRequest={dummyRequest}
        >
          <Button icon={<UploadOutlined />} className="w-full">
            Click to Upload
          </Button>
        </Upload>
      </div>
      <div className="w-1/2 h-full flex-shrink-0 p-4 flex flex-col items-center justify-center overflow-y-hidden">
        <Form
          form={form}
          className="w-full h-96 p-2 flex-grow overflow-y-scroll"
          layout="vertical"
          onFinish={submitHandler}
          requiredMark={false}
        >
          <Typography.Title level={3}>Information</Typography.Title>

          <Form.Item
            name="email"
            label="E-mail"
            initialValue={account?.email}
            rules={[
              {
                type: 'email',
                message: 'E-mail is not valid!',
              },
              {
                required: true,
                message: 'Please, enter your e-mail!',
                whitespace: true,
              },
              {
                max: 254,
                message: 'Email must be 254 characters or fewer!',
              },
            ]}
          >
            <Input placeholder="Your e-mail..." />
          </Form.Item>
          <Form.Item
            name="username"
            label="Username"
            initialValue={account?.username}
            rules={[
              {
                required: true,
                message: 'Please, enter your username!',
                whitespace: true,
              },
              {
                max: 150,
                message: 'Username must be 150 characters or fewer!',
              },
            ]}
          >
            <Input placeholder="Your username..." />
          </Form.Item>
          <Form.Item
            name="first_name"
            label="First name"
            initialValue={account?.first_name}
            rules={[
              {
                required: true,
                message: 'Please, enter your first name!',
                whitespace: true,
              },
              {
                max: 150,
                message: 'First name must be 150 characters or fewer!',
              },
            ]}
          >
            <Input placeholder="First name..." />
          </Form.Item>

          <Form.Item
            name="last_name"
            label="Last name"
            initialValue={account?.last_name}
            rules={[
              {
                required: true,
                message: 'Please, enter your last name!',
                whitespace: true,
              },
              {
                max: 150,
                message: 'Last name must be 150 characters or fewer!',
              },
            ]}
          >
            <Input placeholder="Your last name..." />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            initialValue={account?.description}
            rules={[
              {
                max: 2000,
                message: 'Description must be 2000 characters or fewer',
              },
            ]}
          >
            <TextArea rows={6} />
          </Form.Item>
          <Form.Item noStyle>
            <Button
              type="primary"
              htmlType="submit"
              className="bg-sky-500 mr-4"
            >
              Apply
            </Button>

            <Button onClick={resetHandler}>Reset</Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};
