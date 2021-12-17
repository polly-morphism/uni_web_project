export type Id = string;

export type Token = string;

export interface User {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  description: string;
}

export interface WithPhoto {
  photo: string | null;
}

export interface WithId {
  id: Id;
}

export interface WithPassword {
  password: string;
}

export interface WithIsLiked {
  is_liked: boolean;
}

export interface LikeInfo {
  id: number;
  liked_on: string;
  liked_user_id: Id;
  user_id: Id;
}

export type DetailMessage = {
  detail: string;
};

export type ValidationErrors<T> = {
  [key in keyof T]: string[];
};

type NonFieldErrors = {
  non_field_errors?: string[];
};

export type RegistationValidationErrors = ValidationErrors<
  Partial<User & WithPhoto & WithPassword>
>;

export type Credentials = Pick<
  User & WithPassword,
  'username' | 'email' | 'password'
>;

export type LoginValidationErrors = ValidationErrors<
  Partial<Credentials> & NonFieldErrors
>;

export type EditingProfileValidationErrors = ValidationErrors<
  Partial<User> & NonFieldErrors
>;
