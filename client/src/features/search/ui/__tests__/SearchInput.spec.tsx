import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchInput from '../SearchInput';

// Мокаем next/image для среды тестов (JSDOM)
jest.mock('next/image', () => {
  const NextImage = (props: any) => {
    // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
    return <img {...props} />;
  };
  NextImage.displayName = 'NextImageMock';
  return NextImage;
});

describe('SearchInput', () => {
  it('рендерит плейсхолдер, вызывает onChange при вводе и содержит линию', async () => {
    const handleChange = jest.fn();

    const placeholder = 'Что хотите найти?';
    const { container, rerender } = render(
      <SearchInput value="" onChange={handleChange} placeholder={placeholder} />
    );

    const input = screen.getByPlaceholderText(placeholder) as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input.value).toBe('');

    fireEvent.change(input, { target: { value: 'плед' } });
    expect(handleChange).toHaveBeenCalledTimes(1);

    // Компонент контролируемый: меняем проп value и убеждаемся, что input обновился
    rerender(<SearchInput value="плед" onChange={handleChange} placeholder={placeholder} />);
    expect((screen.getByPlaceholderText(placeholder) as HTMLInputElement).value).toBe('плед');

    // Проверяем наличие иконки поиска (next/image → img в моках)
    expect(screen.getByAltText('search')).toBeInTheDocument();
  });
});


