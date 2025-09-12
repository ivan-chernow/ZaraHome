import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ResetRequestDto {
  @IsEmail({}, { message: 'Введите корректный email адрес' })
  @IsNotEmpty({ message: 'Email обязателен' })
  email: string;
}

export class ResetVerifyDto {
  @IsString({ message: 'Токен должен быть строкой' })
  @IsNotEmpty({ message: 'Токен обязателен' })
  token: string;
}

export class ResetSetDto {
  @IsString({ message: 'Токен должен быть строкой' })
  @IsNotEmpty({ message: 'Токен обязателен' })
  token: string;

  @IsString({ message: 'Пароль должен быть строкой' })
  @MinLength(8, { message: 'Пароль должен содержать минимум 8 символов' })
  @IsNotEmpty({ message: 'Пароль обязателен' })
  password: string;
}
