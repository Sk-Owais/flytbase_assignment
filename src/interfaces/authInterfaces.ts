export interface UserRegistrationParams {
  email: string;
  password: string;
  full_name: string;
  contact:string
}

export interface UserLoginParams {
  email: string;
  password: string;
}
