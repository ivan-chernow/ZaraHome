import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegistrationInitiateDto {
  @IsEmail({}, { message: 'Введите корректный email адрес' })
  @IsNotEmpty({ message: 'Email обязателен' })
  email: string;
}

export class RegistrationVerifyDto {
  @IsEmail({}, { message: 'Введите корректный email адрес' })
  @IsNotEmpty({ message: 'Email обязателен' })
  email: string;

  @IsString({ message: 'Код подтверждения должен быть строкой' })
  @IsNotEmpty({ message: 'Код подтверждения обязателен' })
  code: string;
}

export class RegistrationCompleteDto {
  @IsString({ message: 'Токен сессии должен быть строкой' })
  @IsNotEmpty({ message: 'Токен сессии обязателен' })
  sessionToken: string;

  @IsString({ message: 'Пароль должен быть строкой' })
  @MinLength(8, { message: 'Пароль должен содержать минимум 8 символов' })
  @IsNotEmpty({ message: 'Пароль обязателен' })
  password: string;
}
