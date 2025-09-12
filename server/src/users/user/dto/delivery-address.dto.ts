import { IsString, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDeliveryAddressDto {
  @ApiProperty({
    description: 'Имя получателя',
    example: 'Иван',
    maxLength: 100,
  })
  @IsString()
  @MaxLength(100)
  firstName: string;

  @ApiProperty({
    description: 'Фамилия получателя',
    example: 'Иванов',
    maxLength: 100,
  })
  @IsString()
  @MaxLength(100)
  lastName: string;

  @ApiPropertyOptional({
    description: 'Отчество получателя',
    example: 'Иванович',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  patronymic?: string;

  @ApiProperty({
    description: 'Номер телефона',
    example: '+7 (999) 123-45-67',
    maxLength: 20,
  })
  @IsString()
  @MaxLength(20)
  phone: string;

  @ApiProperty({
    description: 'Регион/область',
    example: 'Московская область',
    maxLength: 100,
  })
  @IsString()
  @MaxLength(100)
  region: string;

  @ApiProperty({
    description: 'Город',
    example: 'Москва',
    maxLength: 100,
  })
  @IsString()
  @MaxLength(100)
  city: string;

  @ApiProperty({
    description: 'Улица',
    example: 'ул. Пушкина',
    maxLength: 200,
  })
  @IsString()
  @MaxLength(200)
  street: string;

  @ApiPropertyOptional({
    description: 'Строение/корпус',
    example: 'корп. 1',
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  building?: string;

  @ApiProperty({
    description: 'Дом',
    example: '10',
    maxLength: 50,
  })
  @IsString()
  @MaxLength(50)
  house: string;

  @ApiPropertyOptional({
    description: 'Квартира',
    example: '5',
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  apartment?: string;

  @ApiPropertyOptional({
    description: 'Дополнительная информация',
    example: 'Код домофона: 1234',
  })
  @IsOptional()
  @IsString()
  additionalInfo?: string;
}

export class UpdateDeliveryAddressDto {
  @ApiPropertyOptional({
    description: 'Имя получателя',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  firstName?: string;

  @ApiPropertyOptional({
    description: 'Фамилия получателя',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  lastName?: string;

  @ApiPropertyOptional({
    description: 'Отчество получателя',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  patronymic?: string;

  @ApiPropertyOptional({
    description: 'Номер телефона',
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @ApiPropertyOptional({
    description: 'Регион/область',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  region?: string;

  @ApiPropertyOptional({
    description: 'Город',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  city?: string;

  @ApiPropertyOptional({
    description: 'Улица',
  })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  street?: string;

  @ApiPropertyOptional({
    description: 'Строение/корпус',
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  building?: string;

  @ApiPropertyOptional({
    description: 'Дом',
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  house?: string;

  @ApiPropertyOptional({
    description: 'Квартира',
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  apartment?: string;

  @ApiPropertyOptional({
    description: 'Дополнительная информация',
  })
  @IsOptional()
  @IsString()
  additionalInfo?: string;
}
