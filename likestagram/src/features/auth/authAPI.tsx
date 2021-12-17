import { template } from '../../app/api';
import {
  Credentials,
  DetailMessage,
  Token,
  User,
  WithId,
  WithPassword,
  WithPhoto,
} from '../../app/types';

export const authAPI = {
  register: (user: User & WithPassword) => {
    return template.post<User & WithId & WithPhoto>('/registration/', user);
  },

  logIn: (credentials: Credentials) => {
    return template.post<{ key: Token }>('/api/login/', credentials);
  },

  logOut: () => {
    return template.post<DetailMessage>('/api/logout/');
  },

  getAccount: () => {
    return template.get<User & WithId & WithPhoto>('/user/');
  },

  editAccount: (user: FormData) => {
    return template.put<User & WithId & WithPhoto>('/user/', user, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};
