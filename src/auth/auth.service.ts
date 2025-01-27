import { Injectable } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private jwtService: JwtService,
    ) { }

    async validateUser(email: string, password: string): Promise<{ status: boolean, payload?: User, message?: string } | null> {
        const user = await this.userService.findByEmail(email);
        if (user && await bcrypt.compare(password, user.password)) {
            return { "status": true, "payload": user }; // Password matches
        } else {
            return { "status": false, "message": "Invalid email or password!" };
        }
    }

    async login(loginDto: LoginDto, res) {
        const user = await this.validateUser(loginDto.email, loginDto.password);
        if (!user.status) {
            res.status(401).send(user.message);
            return;
        }
        const payload = { sub: user.payload.user_id, name: user.payload.name, role: user.payload.role };
        const access_token = await this.jwtService.signAsync(payload, {
            expiresIn: process.env.JWT_EXPIRESIN,
            secret: process.env.JWT_SECRET,
        });
        // Send the JWT in a secure, httpOnly cookie
        res.cookie('access_token', access_token, {
            httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
            secure: true, // Ensures the cookie is sent over HTTPS
        });
        res.send('Login Successful!');
    }
}