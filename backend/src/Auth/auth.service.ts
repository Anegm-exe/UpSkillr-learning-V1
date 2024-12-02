import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Types } from 'mongoose';
import { User } from 'src/schemas/user.schema';
@Injectable()
export class AuthService {
    constructor(
        private usersService: UserService,
        private jwtService: JwtService
    ) { }
    async register(user: Partial<User>): Promise<string> {
        const existingUser = await this.usersService.findByEmail(user.email);
        if (existingUser) {
          throw new ConflictException('email already exists');
        }
        const hashedPassword = await bcrypt.hash(user.password, 10);
        const newUser:  Partial<User> = { ...user, password: hashedPassword };
        await this.usersService.create(newUser);
        return 'registered successfully';
      }

    async signIn(email: string, password: string): Promise< {access_token:string,payload:{ user:{userid:string, role:string}}}> {
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            throw new NotFoundException('User not found');
          }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
          }

        const payload = { user:{userid: user._id, role: user.role} };

        return {
            access_token: await this.jwtService.signAsync(payload),
            payload
        };
    }
}
