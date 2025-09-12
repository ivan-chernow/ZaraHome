'use client';
import React, { useState, useEffect } from 'react';
import {
  FormControl,
  Select,
  MenuItem,
  SelectChangeEvent,
  TextField,
  Alert,
  Fade,
  Box,
} from '@mui/material';
import HorizontalLine from '@/shared/ui/HorizontalLine';
import MainButton from '@/shared/ui/Button/MainButton';
import {
  useAddProductMutation,
  useGetCatalogQuery,
} from '@/entities/product/api/products.api';
import Image from 'next/image';
import CloseIcon from '@mui/icons-material/Close';

interface ProductParams {
  name_eng: string;
  name_ru: string;
  description: string;
  img: string[];
  colors: string[];
  size: { size: string; price: string }[];
  deliveryDate: string;
  isNew: boolean;
  discount: number;
}

const getToday = () => {
  const d = new Date();
  return d.toISOString().slice(0, 10);
};

// Добавляем константы для ограничений
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_TOTAL_SIZE = 50 * 1024 * 1024; // 50MB
const IMAGE_LIMIT = 12;

// Функция для сжатия изображения
const compressImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = event => {
      const img = new window.Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // МЕНЬШЕ размеры
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;

        // Изменяем размеры, сохраняя пропорции
        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        // Конвертируем в base64 с качеством 0.5
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.5);
        resolve(compressedBase64);
      };
      img.onerror = () => reject(new Error('Failed to load image'));
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
  });
};

const AdminAddProduct = () => {
  const { data: catalog, isLoading: isCatalogLoading } = useGetCatalogQuery();
  const [category, setCategory] = useState<string>('');
  const [subCategory, setSubCategory] = useState<string>('');
  const [type, setType] = useState<string>('');
  const [showParams, setShowParams] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [productParams, setProductParams] = useState<ProductParams>({
    name_eng: '',
    name_ru: '',
    description: '',
    img: [],
    colors: [''],
    size: [{ size: '', price: '' }],
    deliveryDate: getToday(),
    isNew: false,
    discount: 0,
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });
  const [addProduct, { isLoading: isAdding }] = useAddProductMutation();

  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  // Инициализация значений при загрузке каталога
  useEffect(() => {
    if (catalog && catalog.length > 0) {
      const firstCat = catalog[0];
      setCategory(firstCat.id.toString());
      if (firstCat.subCategories.length > 0) {
        const firstSub = firstCat.subCategories[0];
        setSubCategory(firstSub.id.toString());
        if (firstSub.types.length > 0) {
          setType(firstSub.types[0].id.toString());
        } else {
          setType('');
        }
      } else {
        setSubCategory('');
        setType('');
      }
    }
  }, [catalog]);

  const handleCategoryChange = (event: SelectChangeEvent<string>) => {
    const newCatId = event.target.value;
    setCategory(newCatId);
    const selectedCat = catalog?.find(cat => cat.id.toString() === newCatId);
    if (selectedCat && selectedCat.subCategories.length > 0) {
      const firstSub = selectedCat.subCategories[0];
      setSubCategory(firstSub.id.toString());
      if (firstSub.types.length > 0) {
        setType(firstSub.types[0].id.toString());
      } else {
        setType('');
      }
    } else {
      setSubCategory('');
      setType('');
    }
  };

  const handleSubCategoryChange = (event: SelectChangeEvent<string>) => {
    const newSubId = event.target.value;
    setSubCategory(newSubId);
    const selectedCat = catalog?.find(cat => cat.id.toString() === category);
    const selectedSub = selectedCat?.subCategories.find(
      sub => sub.id.toString() === newSubId
    );
    if (selectedSub && selectedSub.types.length > 0) {
      setType(selectedSub.types[0].id.toString());
    } else {
      setType('');
    }
  };

  const handleTypeChange = (event: SelectChangeEvent<string>) => {
    const newType = event.target.value;
    if (isValidType(category, subCategory, newType)) {
      setType(newType);
    }
  };

  const handleParamChange =
    (field: keyof ProductParams) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setProductParams(prev => ({
        ...prev,
        [field]: event.target.value,
      }));
    };

  const handleAddClick = () => {
    if (category) {
      setShowParams(true);
      setFormVisible(true);
    }
  };

  const handleAddColor = () => {
    setProductParams(prev => ({
      ...prev,
      colors: [...prev.colors, ''],
    }));
  };

  const handleColorNameChange = (index: number, value: string) => {
    const newColors = [...productParams.colors];
    newColors[index] = value;
    setProductParams(prev => ({ ...prev, colors: newColors }));
  };

  const handleAddSize = () => {
    setProductParams(prev => ({
      ...prev,
      size: [...prev.size, { size: '', price: '' }],
    }));
  };

  const handleSizeChange = (
    idx: number,
    field: 'size' | 'price',
    value: string
  ) => {
    setProductParams(prev => {
      const newSize = [...prev.size];
      if (field === 'price') {
        newSize[idx] = { ...newSize[idx], price: value };
      } else {
        newSize[idx] = { ...newSize[idx], size: value };
      }
      return { ...prev, size: newSize };
    });
  };

  const handleRemoveColor = (index: number) => {
    setProductParams(prev => ({
      ...prev,
      colors: prev.colors.filter((_, i) => i !== index),
    }));
  };

  const handleRemoveSize = (idx: number) => {
    setProductParams(prev => ({
      ...prev,
      size: prev.size.filter((_, i) => i !== idx),
    }));
  };

  const handleImagesChange = (files: FileList | null) => {
    if (!files) return;
    const validFiles = Array.from(files).filter(file =>
      file.type.startsWith('image/')
    );
    const newFiles = validFiles.slice(0, IMAGE_LIMIT - images.length);
    setImages(prev => [...prev, ...newFiles]);
    setImagePreviews(prev => [
      ...prev,
      ...newFiles.map(file => URL.createObjectURL(file)),
    ]);
  };

  const handleRemoveImage = (idx: number) => {
    setImages(prev => prev.filter((_, i) => i !== idx));
    setImagePreviews(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async () => {
    try {
      // Проверяем, что все необходимые поля заполнены
      if (
        !productParams.name_eng ||
        !productParams.name_ru ||
        !productParams.description
      ) {
        setSnackbar({
          open: true,
          message: 'Пожалуйста, заполните все обязательные поля',
          severity: 'error',
        });
        return;
      }

      // Проверяем, что выбрана категория и подкатегория
      if (!category || !subCategory) {
        setSnackbar({
          open: true,
          message: 'Пожалуйста, выберите категорию и подкатегорию',
          severity: 'error',
        });
        return;
      }

      // Проверяем, что есть хотя бы один цвет
      if (productParams.colors.length === 0) {
        setSnackbar({
          open: true,
          message: 'Добавьте хотя бы один цвет',
          severity: 'error',
        });
        return;
      }

      // Проверяем, что есть хотя бы один размер
      if (productParams.size.length === 0) {
        setSnackbar({
          open: true,
          message: 'Добавьте хотя бы один размер',
          severity: 'error',
        });
        return;
      }

      // Проверяем, что есть хотя бы одно изображение
      if (imagePreviews.length === 0) {
        setSnackbar({
          open: true,
          message: 'Добавьте хотя бы одно изображение',
          severity: 'error',
        });
        return;
      }

      const formData = new FormData();
      formData.append('categoryId', category);
      formData.append('subCategoryId', subCategory);
      formData.append('name_eng', productParams.name_eng);
      formData.append('name_ru', productParams.name_ru);
      formData.append('description', productParams.description);
      if (type) formData.append('typeId', type);

      formData.append('colors', JSON.stringify(productParams.colors));
      formData.append(
        'size',
        JSON.stringify(
          productParams.size.map(item => ({
            ...item,
            price: item.price === '' ? 0 : Number(item.price),
          }))
        )
      );
      formData.append('deliveryDate', productParams.deliveryDate);
      formData.append('isNew', String(productParams.isNew));
      formData.append('discount', String(productParams.discount));
      formData.append('isAvailable', 'true');

      // Добавляем файлы
      images.forEach(file => {
        formData.append('images', file);
      });

      await addProduct(formData).unwrap();

      setSnackbar({
        open: true,
        message: 'Товар успешно добавлен',
        severity: 'success',
      });

      // Сбрасываем форму
      setCategory('');
      setSubCategory('');
      setType('');
      setShowParams(false);
      setProductParams({
        name_eng: '',
        name_ru: '',
        description: '',
        img: [],
        colors: [''],
        size: [{ size: '', price: '' }],
        deliveryDate: getToday(),
        isNew: false,
        discount: 0,
      });
      setImages([]);
      setImagePreviews([]);
    } catch (error: any) {
      console.error('Ошибка при добавлении товара:', {
        raw: error,
        status: error?.status,
        data: error?.data,
        message: error?.error || error?.message,
      });
      setSnackbar({
        open: true,
        message:
          'Ошибка при добавлении товара. Проверьте все поля и попробуйте снова.',
        severity: 'error',
      });
    }
  };

  // Добавляем функцию для проверки валидности типа
  const isValidType = (
    categoryId: string,
    subCategoryId: string,
    typeId: string
  ) => {
    const category = catalog?.find(cat => cat.id.toString() === categoryId);
    const subCategory = category?.subCategories.find(
      subCat => subCat.id.toString() === subCategoryId
    );
    return subCategory?.types.some(t => t.id.toString() === typeId);
  };

  if (isCatalogLoading) {
    return (
      <div className="animate-pulse">
        <div className="flex flex-col items-center">
          <div className="h-[42px] bg-gray-200 rounded w-[300px] mb-[37px]"></div>
          <div className="flex items-center justify-center mb-[28px] w-full">
            <div className="h-[20px] bg-gray-200 rounded w-[200px] mr-[5px]"></div>
            <div className="h-[2px] bg-gray-200 rounded w-[615px]"></div>
          </div>
          <div className="flex flex-col w-full max-w-[1000px]">
            <div className="flex flex-wrap gap-6 mb-[23px] justify-center">
              <div className="flex flex-col flex-1 min-w-[300px] max-w-[400px]">
                <div className="h-[20px] bg-gray-200 rounded w-[100px] mb-[5px] ml-[20px]"></div>
                <div className="h-[48px] bg-gray-200 rounded w-full"></div>
              </div>
              <div className="flex flex-col flex-1 min-w-[300px] max-w-[400px]">
                <div className="h-[20px] bg-gray-200 rounded w-[140px] mb-[5px] ml-[20px]"></div>
                <div className="h-[48px] bg-gray-200 rounded w-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Fade in={true} timeout={700}>
      <div className="flex flex-col items-center">
        <h4 className="font-light text-[42px] mb-[37px] text-center">
          Добавление товара
        </h4>
        <div className="flex items-center justify-center mb-[28px] w-full">
          <p className="font-medium text-[#0000004D] mr-[5px]">
            Выберите категорию
          </p>
          <HorizontalLine width="615px" />
        </div>

        {snackbar.open && (
          <Alert
            severity={snackbar.severity}
            className="mb-4 w-full max-w-[800px]"
          >
            {snackbar.message}
          </Alert>
        )}

        <div className="flex flex-col w-full max-w-[1000px]">
          <div className="flex flex-wrap gap-6 mb-[23px] justify-center">
            <div className="flex flex-col flex-1 min-w-[300px] max-w-[400px]">
              <label className="mb-[5px] pl-[20px] font-medium text-[14px] text-[#00000099]">
                Категория
              </label>
              <FormControl fullWidth>
                <Select
                  value={category}
                  onChange={handleCategoryChange}
                  displayEmpty
                  sx={{
                    height: '48px',
                    backgroundColor: '#fff',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#D1D5DB',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#000',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#000',
                    },
                  }}
                >
                  {catalog?.map(cat => (
                    <MenuItem key={cat.id} value={cat.id.toString()}>
                      {cat.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div className="flex flex-col flex-1 min-w-[300px] max-w-[400px]">
              <label className="mb-[5px] pl-[20px] font-medium text-[14px] text-[#00000099]">
                Подкатегория
              </label>
              <FormControl fullWidth>
                <Select
                  value={subCategory}
                  onChange={handleSubCategoryChange}
                  displayEmpty
                  disabled={!category}
                  sx={{
                    height: '48px',
                    backgroundColor: '#fff',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#D1D5DB',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#000',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#000',
                    },
                    '&.Mui-disabled': {
                      backgroundColor: '#F3F4F6',
                    },
                  }}
                >
                  {catalog
                    ?.find(cat => cat.id.toString() === category)
                    ?.subCategories.map(subCat => (
                      <MenuItem key={subCat.id} value={subCat.id.toString()}>
                        {subCat.name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </div>
            <div className="flex flex-col flex-1 min-w-[300px] max-w-[400px]">
              <label className="mb-[5px] pl-[20px] font-medium text-[14px] text-[#00000099]">
                Тип
              </label>
              <FormControl fullWidth>
                <Select
                  value={type}
                  onChange={handleTypeChange}
                  displayEmpty
                  disabled={
                    !(() => {
                      const selectedCat = catalog?.find(
                        cat => cat.id.toString() === category
                      );
                      const selectedSub = selectedCat?.subCategories.find(
                        sub => sub.id.toString() === subCategory
                      );
                      return selectedSub && selectedSub.types.length > 0;
                    })()
                  }
                  sx={{
                    height: '48px',
                    backgroundColor: '#fff',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#D1D5DB',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#000',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#000',
                    },
                    '&.Mui-disabled': {
                      backgroundColor: '#F3F4F6',
                    },
                  }}
                >
                  {(() => {
                    const selectedCat = catalog?.find(
                      cat => cat.id.toString() === category
                    );
                    const selectedSub = selectedCat?.subCategories.find(
                      sub => sub.id.toString() === subCategory
                    );
                    if (selectedSub && selectedSub.types.length > 0) {
                      return selectedSub.types.map(t => (
                        <MenuItem key={t.id} value={t.id.toString()}>
                          {t.name}
                        </MenuItem>
                      ));
                    } else {
                      return (
                        <MenuItem value="" disabled>
                          Нет типов
                        </MenuItem>
                      );
                    }
                  })()}
                </Select>
              </FormControl>
            </div>
          </div>
        </div>

        <div className="flex justify-center mb-[23px] w-full">
          <MainButton
            text="Добавить"
            disabled={!category || showParams}
            onClick={handleAddClick}
            type="button"
            width="358px"
            height="56px"
          />
        </div>

        {showParams && (
          <Fade in={formVisible} timeout={500}>
            <div className="mt-[40px] w-full max-w-[1000px]">
              <div className="flex items-center justify-center mb-[28px]">
                <p className="font-medium text-[#0000004D] mr-[5px]">
                  Параметры товара
                </p>
                <HorizontalLine width="615px" />
              </div>

              <div className="flex flex-col gap-[23px] items-center">
                <div className="flex flex-wrap gap-6 justify-center w-full">
                  <div className="flex flex-col flex-1 min-w-[300px] max-w-[400px]">
                    <label className="mb-[5px] pl-[20px] font-medium text-[14px] text-[#00000099]">
                      Название (EN)
                    </label>
                    <TextField
                      fullWidth
                      value={productParams.name_eng}
                      onChange={handleParamChange('name_eng')}
                      required
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          height: '48px',
                          backgroundColor: '#fff',
                        },
                      }}
                    />
                  </div>
                  <div className="flex flex-col flex-1 min-w-[300px] max-w-[400px]">
                    <label className="mb-[5px] pl-[20px] font-medium text-[14px] text-[#00000099]">
                      Название (RU)
                    </label>
                    <TextField
                      fullWidth
                      value={productParams.name_ru}
                      onChange={handleParamChange('name_ru')}
                      required
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          height: '48px',
                          backgroundColor: '#fff',
                        },
                      }}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-6 justify-center w-full">
                  <div className="flex flex-col flex-1 min-w-[300px] max-w-[400px]">
                    <label className="mb-[5px] pl-[20px] font-medium text-[14px] text-[#00000099]">
                      Цвета
                    </label>
                    <div className="flex flex-col gap-4">
                      {productParams.colors.map((color, colorIdx) => (
                        <div
                          key={colorIdx}
                          className="relative flex items-center"
                        >
                          <TextField
                            label="Название цвета"
                            value={color}
                            onChange={e =>
                              handleColorNameChange(colorIdx, e.target.value)
                            }
                            sx={{
                              width: '100%',
                              border: '1px solid #D1D5DB',
                              borderRadius: '8px',
                              background: '#fff',
                            }}
                          />
                          {colorIdx > 0 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveColor(colorIdx)}
                              className="absolute top-1/2 right-2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors bg-white rounded-full p-1 shadow"
                              style={{ cursor: 'pointer' }}
                              tabIndex={-1}
                            >
                              <CloseIcon fontSize="small" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-center mt-6">
                      <button
                        onClick={handleAddColor}
                        className="w-[220px] h-[44px] bg-gradient-to-r from-gray-100 to-gray-200 border border-gray-300 rounded-lg flex items-center justify-center shadow hover:from-gray-200 hover:to-gray-300 transition-all"
                        type="button"
                        style={{ cursor: 'pointer' }}
                      >
                        <span className="text-gray-700 text-base font-medium">
                          + Добавить цвет
                        </span>
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col flex-1 min-w-[300px] max-w-[400px]">
                    <label className="mb-[5px] pl-[20px] font-medium text-[14px] text-[#00000099]">
                      Размеры
                    </label>
                    <div className="flex flex-col gap-4">
                      {productParams.size.map((item, idx) => (
                        <div
                          key={idx}
                          className="relative flex items-center gap-4"
                        >
                          <TextField
                            label="Размер"
                            value={item.size}
                            onChange={e =>
                              handleSizeChange(idx, 'size', e.target.value)
                            }
                            sx={{
                              width: '100%',
                              border: '1px solid #D1D5DB',
                              borderRadius: '8px',
                              background: '#fff',
                            }}
                          />
                          <TextField
                            label="Цена"
                            type="number"
                            value={item.price}
                            onChange={e =>
                              handleSizeChange(idx, 'price', e.target.value)
                            }
                            sx={{
                              width: '100%',
                              border: '1px solid #D1D5DB',
                              borderRadius: '8px',
                              background: '#fff',
                            }}
                          />
                          {idx > 0 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveSize(idx)}
                              className="absolute top-1/2 right-2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors bg-white rounded-full p-1 shadow"
                              style={{ cursor: 'pointer' }}
                              tabIndex={-1}
                            >
                              <CloseIcon fontSize="small" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-center mt-6">
                      <button
                        onClick={handleAddSize}
                        className="w-[220px] h-[44px] bg-gradient-to-r from-gray-100 to-gray-200 border border-gray-300 rounded-lg flex items-center justify-center shadow hover:from-gray-200 hover:to-gray-300 transition-all"
                        type="button"
                        style={{ cursor: 'pointer' }}
                      >
                        <span className="text-gray-700 text-base font-medium">
                          + Добавить размер
                        </span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col w-full max-w-[800px] bg-white p-6 rounded-lg shadow-sm">
                  <label className="mb-[5px] pl-[20px] font-medium text-[14px] text-[#00000099]">
                    Статус товара
                  </label>
                  <div className="flex flex-wrap gap-6 justify-center">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={productParams.isNew}
                        onChange={e =>
                          setProductParams(prev => ({
                            ...prev,
                            isNew: e.target.checked,
                          }))
                        }
                        className="w-4 h-4"
                      />
                      <span>Новинка</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="number"
                        value={productParams.discount}
                        onChange={e =>
                          setProductParams(prev => ({
                            ...prev,
                            discount: Number(e.target.value),
                          }))
                        }
                        className="w-20 h-8 border rounded px-2"
                        min="0"
                        max="100"
                      />
                      <span>Скидка (%)</span>
                    </label>
                  </div>
                </div>

                <div className="flex flex-col w-full max-w-[800px]">
                  <label className="mb-[5px] pl-[20px] font-medium text-[14px] text-[#00000099]">
                    Дата доставки
                  </label>
                  <TextField
                    type="date"
                    value={productParams.deliveryDate}
                    onChange={handleParamChange('deliveryDate')}
                    required
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: '48px',
                        backgroundColor: '#fff',
                      },
                    }}
                  />
                </div>

                <div className="flex flex-col w-full max-w-[800px]">
                  <label className="mb-[5px] pl-[20px] font-medium text-[14px] text-[#00000099]">
                    Описание
                  </label>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    value={productParams.description}
                    onChange={handleParamChange('description')}
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: '#fff',
                      },
                    }}
                  />
                </div>

                <div className="flex flex-col w-full max-w-[800px]">
                  <label className="mb-[5px] pl-[20px] font-medium text-[14px] text-[#00000099]">
                    Изображения
                  </label>
                  <Box className="flex flex-wrap gap-4 justify-left">
                    {imagePreviews.map((img, idx) => (
                      <Box key={idx} className="relative w-[120px] h-[120px]">
                        <Image
                          src={img}
                          alt={`Preview ${idx + 1}`}
                          fill
                          className="object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute top-1 right-1 bg-white bg-opacity-80 rounded-full p-1 text-gray-500 hover:text-red-500"
                        >
                          <CloseIcon
                            fontSize="small"
                            sx={{ cursor: 'pointer' }}
                          />
                        </button>
                      </Box>
                    ))}
                    {images.length < IMAGE_LIMIT && (
                      <label className="w-[120px] h-[120px] border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-400">
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={e => handleImagesChange(e.target.files)}
                          className="hidden"
                        />
                        <span className="text-gray-500 text-3xl">+</span>
                      </label>
                    )}
                  </Box>
                  <div className="mt-8">
                    <MainButton
                      text="Подтвердить"
                      disabled={isAdding}
                      onClick={handleSubmit}
                      type="button"
                      width="358px"
                      height="56px"
                    />
                  </div>
                </div>
              </div>
            </div>
          </Fade>
        )}
      </div>
    </Fade>
  );
};

export default AdminAddProduct;
