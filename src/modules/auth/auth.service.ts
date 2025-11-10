import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { hashPassword, comparePassword } from '../../common/utils/password.utils';
import { getExpirationDate } from '../../common/utils/time.utils';
import {
  UnauthorizedError,
  ConflictError,
  BadRequestError,
} from '../../common/filters/error.filter';
import { RegisterDto, LoginDto, AuthResponse } from './dto/auth.dto';
import appConfig from '../../config/app.config';
import { randomBytes } from 'crypto';

export class AuthService {
  constructor(
    private prisma: PrismaClient,
    private fastify: FastifyInstance
  ) {}

  async register(dto: RegisterDto): Promise<AuthResponse> {
    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictError('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await hashPassword(dto.password);

    // Create user with default USER role
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        firstName: dto.firstName,
        lastName: dto.lastName,
        provider: 'LOCAL',
      },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

    // Assign default USER role
    const userRole = await this.prisma.role.findUnique({
      where: { name: 'USER' },
    });

    if (userRole) {
      await this.prisma.userRole.create({
        data: {
          userId: user.id,
          roleId: userRole.id,
        },
      });
    }

    // Fetch user with roles
    const userWithRoles = await this.prisma.user.findUnique({
      where: { id: user.id },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

    // Generate tokens
    const tokens = await this.generateTokens(userWithRoles!);

    return this.buildAuthResponse(userWithRoles!, tokens);
  }

  async login(dto: LoginDto): Promise<AuthResponse> {
    // Find user by email
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!user || !user.password) {
      throw new UnauthorizedError('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await comparePassword(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid credentials');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new UnauthorizedError('Account is disabled');
    }

    // Generate tokens
    const tokens = await this.generateTokens(user);

    return this.buildAuthResponse(user, tokens);
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    // Verify refresh token
    try {
      const decoded = this.fastify.jwt.verify(refreshToken, {
        key: appConfig.jwt.refreshSecret,
      }) as { userId: string };

      // Check if refresh token exists in database
      const storedToken = await this.prisma.refreshToken.findUnique({
        where: { token: refreshToken },
        include: {
          user: {
            include: {
              roles: {
                include: {
                  role: true,
                },
              },
            },
          },
        },
      });

      if (!storedToken || storedToken.expiresAt < new Date()) {
        throw new UnauthorizedError('Invalid or expired refresh token');
      }

      // Delete old refresh token
      await this.prisma.refreshToken.delete({
        where: { id: storedToken.id },
      });

      // Generate new tokens
      const tokens = await this.generateTokens(storedToken.user);

      return this.buildAuthResponse(storedToken.user, tokens);
    } catch (error) {
      throw new UnauthorizedError('Invalid refresh token');
    }
  }

  async logout(refreshToken: string): Promise<void> {
    await this.prisma.refreshToken.deleteMany({
      where: { token: refreshToken },
    });
  }

  async handleOAuthCallback(
    provider: 'GOOGLE' | 'GITHUB',
    profile: any
  ): Promise<AuthResponse> {
    const email = profile.email || profile.emails?.[0]?.value;
    
    if (!email) {
      throw new BadRequestError('Email not provided by OAuth provider');
    }

    // Find or create user
    let user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!user) {
      // Create new user
      user = await this.prisma.user.create({
        data: {
          email,
          provider,
          providerId: profile.id,
          firstName: profile.given_name || profile.name?.givenName,
          lastName: profile.family_name || profile.name?.familyName,
          avatar: profile.picture || profile.avatar_url,
          isEmailVerified: true,
        },
        include: {
          roles: {
            include: {
              role: true,
            },
          },
        },
      });

      // Assign default USER role
      const userRole = await this.prisma.role.findUnique({
        where: { name: 'USER' },
      });

      if (userRole) {
        await this.prisma.userRole.create({
          data: {
            userId: user.id,
            roleId: userRole.id,
          },
        });

        // Reload user with roles
        user = (await this.prisma.user.findUnique({
          where: { id: user.id },
          include: {
            roles: {
              include: {
                role: true,
              },
            },
          },
        }))!;
      }
    }

    // Generate tokens
    const tokens = await this.generateTokens(user);

    return this.buildAuthResponse(user, tokens);
  }

  private async generateTokens(user: any): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const roles = user.roles.map((ur: any) => ur.role.name);

    // Generate access token
    const accessToken = this.fastify.jwt.sign(
      {
        userId: user.id,
        email: user.email,
        roles,
      },
      {
        expiresIn: appConfig.jwt.expiresIn,
      }
    );

    // Generate refresh token
    const refreshTokenValue = randomBytes(64).toString('hex');
    const refreshToken = this.fastify.jwt.sign(
      { userId: user.id },
      {
        key: appConfig.jwt.refreshSecret,
        expiresIn: appConfig.jwt.refreshExpiresIn,
      }
    );

    // Store refresh token in database
    await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: getExpirationDate(appConfig.jwt.refreshExpiresIn),
      },
    });

    return { accessToken, refreshToken };
  }

  private buildAuthResponse(user: any, tokens: any): AuthResponse {
    const roles = user.roles.map((ur: any) => ur.role.name);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
        roles,
      },
      tokens,
    };
  }
}


