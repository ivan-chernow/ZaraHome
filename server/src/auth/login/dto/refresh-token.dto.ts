import { IsOptional, IsString, IsNotEmpty } from 'class-validator';

export class RefreshTokenDto {
  @IsOptional()
  @IsString({ message: 'Refresh token должен быть строкой' })
  @IsNotEmpty({ message: 'Refresh token не может быть пустым' })
  refreshToken?: string;
}


