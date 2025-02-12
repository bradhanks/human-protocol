import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthConfigService {
  constructor(private configService: ConfigService) {}
  get jwtPrivateKey(): string {
    return this.configService.get<string>('JWT_PRIVATE_KEY', '');
  }
  get jwtPublicKey(): string {
    return this.configService.get<string>('JWT_PUBLIC_KEY', '');
  }
  get accessTokenExpiresIn(): number {
    return +this.configService.get<number>('JWT_ACCESS_TOKEN_EXPIRES_IN', 600);
  }
  get refreshTokenExpiresIn(): number {
    return +this.configService.get<number>('REFRESH_TOKEN_EXPIRES_IN', 3600);
  }
  get verifyEmailTokenExpiresIn(): number {
    return +this.configService.get<number>(
      'VERIFY_EMAIL_TOKEN_EXPIRES_IN',
      86400,
    );
  }
  get forgotPasswordExpiresIn(): number {
    return +this.configService.get<number>(
      'FORGOT_PASSWORD_TOKEN_EXPIRES_IN',
      86400,
    );
  }
  get apiKeyIterations(): number {
    return +this.configService.get<number>('APIKEY_ITERATIONS', 1000);
  }
  get apiKeyLength(): number {
    return +this.configService.get<number>('APIKEY_KEY_LENGTH', 64);
  }
  get hCaptchaSiteKey(): string {
    return this.configService.get<string>('HCAPTCHA_SITE_KEY', '');
  }
  get hCaptchaSecret(): string {
    return this.configService.get<string>('HCAPTCHA_SECRET', '');
  }
  get hcaptchaProtectionUrl(): string {
    return this.configService.get<string>(
      'HCAPTCHA_PROTECTION_URL',
      'https://api.hcaptcha.com',
    );
  }
}
