export const emailValidation = {
	required: 'Email обязателен для заполнения',
	pattern: {
		value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
		message: 'Введите корректный email'
	}
};

export const getPasswordValidation = () => ({
	required: 'Пароль обязателен для заполнения',
	validate: (value: string) => {
		if (!value) return true;
		return /^[A-Za-z\d]{12,}$/.test(value) || 'Пароль должен содержать минимум 12 символов, только буквы и цифры!';
	}
});

export const getRepeatPasswordValidation = (getValues: () => { password: string }) => ({
	required: 'Повторите пароль',
	validate: (value: string) => 
		value === getValues().password || 'Пароли не совпадают!'
});

