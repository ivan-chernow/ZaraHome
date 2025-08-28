import { JwtModuleOptions } from '@nestjs/jwt';
import { ConfigService } from './config.service';

export const getJwtConfig = (configService: ConfigService): JwtModuleOptions => {
  const jwtConfig = configService.jwt;
  
  return {
    secret: jwtConfig.secret,
    signOptions: {
      expiresIn: jwtConfig.accessExpiresIn,
    },
    verifyOptions: {
      ignoreExpiration: false,
    },
  };
};

