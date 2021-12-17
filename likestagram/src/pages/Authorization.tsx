import { Button, Form, Input, Typography } from 'antd';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector, useErrorMessage } from '../app/hooks';
import { Credentials } from '../app/types';
import { loggingInErrorChanged, logIn } from '../features/auth/authSlice';

export const Authorization: React.FC = () => {
  const dispatch = useAppDispatch();

  const fieldsErrors = useAppSelector(
    (state) => state.auth.loggingInFieldsErrors
  );
  const isLoading = useAppSelector((state) => state.auth.isLoggingIn);
  const error = useAppSelector((state) => state.auth.loggingInError);

  useErrorMessage(error, loggingInErrorChanged);

  const [form] = Form.useForm();

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

  const submitHandler = (data: Credentials) => {
    dispatch(logIn(data));
  };

  return (
    <div className="w-96">
      <Form name="authorization" form={form} onFinish={submitHandler}>
        <Form.Item
          name="email"
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
          rules={[
            {
              required: true,
              message: 'Please, enter your username!',
              whitespace: true,
            },
            { max: 150, message: 'Username must be 150 characters or fewer!' },
          ]}
        >
          <Input placeholder="Your username..." />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: 'Please, enter your password!',
              whitespace: true,
            },
          ]}
        >
          <Input.Password placeholder="Your password..." />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="bg-sky-500 mr-4"
            loading={isLoading}
          >
            Sign In
          </Button>
          <Link to="/register">
            <Typography.Text className="text-sky-500">Sign Up</Typography.Text>
          </Link>
        </Form.Item>
      </Form>
    </div>
  );
};
