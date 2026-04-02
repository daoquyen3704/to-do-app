export interface LoginFormData {
    username: string,
    password: string,
}

export interface RegisterFormData {
    last_name: string,
    first_name: string,
    username: string,
    email: string,
    password: string,
    re_password: string,
}

export type RegisterPayload = {
  email: string;
  password: string;
  re_password: string;
  username?: string;
  first_name?: string;
  last_name?: string;
};

export type UpdateProfilePayload = {
  first_name?: string;
  last_name?: string;
  username?: string;
  email?: string;
};