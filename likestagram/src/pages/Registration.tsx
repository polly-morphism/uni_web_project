import { Button, Form, Input, Typography } from 'antd';
import { Link } from 'react-router-dom';
import { User, WithPassword } from '../app/types';
import { useAppDispatch, useAppSelector, useErrorMessage } from '../app/hooks';

import { register, registrationErrorChanged } from '../features/auth/authSlice';
import { useEffect } from 'react';

export const Registration: React.FC = () => {
  const fieldsErrors = useAppSelector(
    (state) => state.auth.registrationFieldsErrors
  );
  const error = useAppSelector((state) => state.auth.registrationError);
  const isLoading = useAppSelector((state) => state.auth.isRegistering);

  const dispatch = useAppDispatch();

  useErrorMessage(error, registrationErrorChanged);

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

  const submitHandler = (user: User & WithPassword) => {
    dispatch(register(user));
  };

  return (
    <div className="w-96">
      <Form
        form={form}
        name="registration"
        layout="vertical"
        requiredMark={false}
        onFinish={submitHandler}
      >
        <Form.Item
          name="email"
          label="E-mail"
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
          name="password"
          label="Password"
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

        <Form.Item
          name="username"
          label="Username"
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
          name="first_name"
          label="First name"
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
          rules={[
            {
              required: true,
              message: 'Please, enter your last name!',
              whitespace: true,
            },
            { max: 150, message: 'Last name must be 150 characters or fewer!' },
          ]}
        >
          <Input placeholder="Your last name..." />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="bg-sky-500 mr-4"
            loading={isLoading}
          >
            Sign Up
          </Button>
          <Link to="/login">
            <Typography.Text className="text-sky-500">Sign In</Typography.Text>
          </Link>
        </Form.Item>
      </Form>
    </div>
  );
};
