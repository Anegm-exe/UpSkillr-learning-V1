import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/model/user.schema';
import { AuthenticationLogService } from 'src/authenticationlog/authenticationlog.service';
import { CreateUserDto } from 'src/user/dtos/user.dto';
@Injectable()
export class AuthService {
    constructor(
        private usersService: UserService,
        private jwtService: JwtService,
        private readonly authenticationlogService: AuthenticationLogService
    ) { }
    async register(user: CreateUserDto): Promise<string> {
        const existingUser = await this.usersService.findByEmail(user.email);
        if (existingUser) {
          this.authenticationlogService.create({user_id:existingUser._id,event:"Email already exists",status:"Failure"})
          throw new ConflictException('email already exists');
        }
        const hashedPassword = await bcrypt.hash(user.password, 10);
        const newUser:  CreateUserDto = { ...user, password: hashedPassword };
        const USER = await this.usersService.create(newUser);
        this.authenticationlogService.create({user_id:USER._id,event:"Registered successfully",status:"Success"})
        return 'registered successfully';
      }

    async signIn(email: string, password: string): Promise< {access_token:string,payload:{ user:{userid:string, role:string}}}> {
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            throw new NotFoundException('User not found');
          }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          this.authenticationlogService.create({user_id:user._id,event:"Wrong Password Entered",status:"Failure"})
            throw new UnauthorizedException('Invalid credentials');
          }

        const payload = { user:{userid: user._id, role: user.role,name:user.name} };
        this.authenticationlogService.create({user_id:user._id,event:"Login successful",status:"Success"})
        return {
            access_token: await this.jwtService.signAsync(payload),
            payload
        };
    }
}
