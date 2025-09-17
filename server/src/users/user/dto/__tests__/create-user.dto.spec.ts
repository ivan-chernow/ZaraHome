import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateUserDto } from '../create-user.dto';
import { USERS_CONSTANTS } from '../../../users.constants';
import { UserRole } from 'src/shared/shared.interfaces';

const build = async (payload: Partial<CreateUserDto>) => {
	const dto = plainToInstance(CreateUserDto, payload);
	const errors = await validate(dto);
	return { dto, errors };
};

describe('CreateUserDto', () => {
	it('валидно при корректных данных', async () => {
		const { errors } = await build({ email: 'user@example.com', password: 'a'.repeat(USERS_CONSTANTS.MIN_PASSWORD_LENGTH) });
		expect(errors.length).toBe(0);
	});

	it.each([
		{ email: 'bad', password: 'goodpass' },
		{ email: 'user@example.com', password: 'short' },
		{ email: 'user@example.com', password: 'a'.repeat(USERS_CONSTANTS.MAX_PASSWORD_LENGTH + 1) },
		{ email: 'x'.repeat(USERS_CONSTANTS.MAX_EMAIL_LENGTH + 1) + '@e.com', password: 'goodpass' },
	])('некорректные базовые поля: %j', async (payload) => {
		const { errors } = await build(payload as any);
		expect(errors.length).toBeGreaterThan(0);
	});

	it('опциональные строки валидируются по длине', async () => {
		const long = 'x'.repeat(USERS_CONSTANTS.MAX_NAME_LENGTH + 1);
		const { errors } = await build({ email: 'user@example.com', password: 'password123', firstName: long, lastName: long, defaultAddress: 'x'.repeat(USERS_CONSTANTS.MAX_ADDRESS_LENGTH + 1) });
		expect(errors.length).toBeGreaterThan(0);
	});

	it('валидирует роль и булев флаг', async () => {
		const ok = await build({ email: 'user@example.com', password: 'password123', role: UserRole.USER, isEmailVerified: false });
		expect(ok.errors.length).toBe(0);
		const bad = await build({ email: 'user@example.com', password: 'password123', role: 'ADMINNN' as any, isEmailVerified: 'yes' as any });
		expect(bad.errors.length).toBeGreaterThan(0);
	});
});
