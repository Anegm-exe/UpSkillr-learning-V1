import { User } from "src/user/model/user.schema";

export class CreateUserDto {
  name: string;
  email: string;
  password: string;
  dateOfBirth: Date;
  profile_picture_url: string;
  role: string;
  categories?: string[];
}

export class updateUserDto {
  name?: string;
  email?: string;
  password?: string;
  dateOfBirth?: Date;
  profile_picture_url?: string;
  categories?: string[];
}

export class UserDto {
  constructor(user: User) {
    const userDto: UserDto = {
      _id: user._id,
      name: user.name,
      profile_picture_url: user.profile_picture_url,
      dateOfBirth: user?.dateOfBirth,
      role: user?.role,
    };
    return userDto;
  }
  _id: string;
  name: string;
  profile_picture_url: string;
  dateOfBirth?: Date;
  email?: string;
  role?: string;
}
