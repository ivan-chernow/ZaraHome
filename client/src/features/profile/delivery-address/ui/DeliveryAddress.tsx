import React, { useState, useEffect, useRef, useMemo } from "react";
import ModeEditOutlinedIcon from "@mui/icons-material/ModeEditOutlined";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import {
  Fade,
  TextField,
  Alert,
  Snackbar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import MainButton from "@/shared/ui/Button/MainButton";
import { useForm } from "react-hook-form";
import {
  ChangeDeliveryAddressDto,
  DeliveryAddressDto,
} from "@/entities/user/model/profile.types";
import { motion, AnimatePresence } from "framer-motion";
import {
  useGetDeliveryAddressesQuery,
  useAddDeliveryAddressMutation,
  useUpdateDeliveryAddressMutation,
  useDeleteDeliveryAddressMutation,
} from "@/entities/user/api/profile.api";
import { profileApi } from "@/entities/user/api/profile.api";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/shared/config/store/store";
import {
  setSelectedAddress,
  clearSelectedAddress,
} from "@/entities/user/model/delivery.slice";

const emptyAddress: ChangeDeliveryAddressDto = {
  firstName: "",
  lastName: "",
  patronymic: "",
  phone: "",
  region: "",
  city: "",
  street: "",
  building: "",
  house: "",
  apartment: "",
  additionalInfo: "",
};

const MAX_ADDRESSES = 3;

const hasChanges = (
  newData: ChangeDeliveryAddressDto,
  oldData: DeliveryAddressDto
) => {
  return Object.keys(newData).some((key) => {
    const typedKey = key as keyof ChangeDeliveryAddressDto;
    return newData[typedKey] !== oldData[typedKey];
  });
};

interface DeliveryAddressProps {
  hideHeader?: boolean;
  hideLimitInfo?: boolean;
  compact?: boolean;
}

const DeliveryAddress = ({ hideHeader = false, hideLimitInfo = false, compact = false }: DeliveryAddressProps) => {


  const dispatch = useDispatch();

  const { selectedAddressIndex, selectedAddress } = useSelector(
    (state: RootState) => state.delivery
  );
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(
    selectedAddressIndex
  );
  const [addMode, setAddMode] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [addressToDelete, setAddressToDelete] = useState<number | null>(null);
  const prevTokenRef = useRef<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<ChangeDeliveryAddressDto>({
    mode: "onBlur",
    defaultValues: emptyAddress,
  });

  const {
    data: addresses = [],
    isLoading,
    refetch,
  } = useGetDeliveryAddressesQuery();
  const [addAddress, { isLoading: isAdding }] = useAddDeliveryAddressMutation();
  const [updateAddress, { isLoading: isUpdating }] =
    useUpdateDeliveryAddressMutation();
  const [deleteAddress, { isLoading: isDeleting }] =
    useDeleteDeliveryAddressMutation();

  const canAddNewAddress = addresses.length < MAX_ADDRESSES;

  const watchedFields = watch();

  // Мемоизированное вычисление наличия изменений
  const isChanged = useMemo(() => {
    if (editingIndex === null) return true; // Для добавления всегда true
    return hasChanges(watchedFields, addresses[editingIndex] || emptyAddress);
  }, [editingIndex, watchedFields, addresses]);

  // Инициализируем выбранный адрес при первой загрузке адресов
  // Важно: восстанавливаем по сохраненному адресу (id), даже если индекс не сохранен
  useEffect(() => {
    if (addresses.length === 0) return;

    // Если в Redux уже есть сохраненный адрес — пытаемся найти его индекс в свежем списке
    if (selectedAddress) {
      const savedIndex = addresses.findIndex(
        (addr) => addr.id === selectedAddress.id
      );
      if (savedIndex !== -1) {
        setSelectedIndex(savedIndex);
        return;
      }
      // Если сохраненный адрес отсутствует в списке (удален/изменился) — выбираем первый
      setSelectedIndex(0);
      dispatch(setSelectedAddress({ address: addresses[0], index: 0 }));
      return;
    }

    // Если сохраненного адреса нет вообще — выбираем первый один раз
    if (selectedIndex === null) {
      setSelectedIndex(0);
      dispatch(setSelectedAddress({ address: addresses[0], index: 0 }));
    }
  }, [addresses, selectedAddress, selectedIndex, dispatch]);

  // Очистка при размонтировании
  useEffect(() => {
    return () => {
      reset(emptyAddress);
      setEditingIndex(null);
      setAddMode(false);
      setSelectedIndex(null);
      setError(null);
      setSuccess(null);
    };
  }, [reset]);

  // Синхронизируем локальное состояние с Redux
  useEffect(() => {
    if (
      selectedAddressIndex !== null &&
      selectedAddressIndex !== selectedIndex
    ) {
      setSelectedIndex(selectedAddressIndex);
    }
  }, [selectedAddressIndex, selectedIndex]);

  // Отслеживание изменения токена
  useEffect(() => {
    const currentToken = localStorage.getItem("accessToken");

    // Если токен изменился (включая случай, когда он стал null)
    if (currentToken !== prevTokenRef.current) {
      // Сбрасываем кэш RTK Query
      dispatch(profileApi.util.resetApiState());

      // Очищаем локальное состояние
      reset(emptyAddress);
      setEditingIndex(null);
      setError(null);
      setSuccess(null);

      // Если есть новый токен, делаем рефетч
      if (currentToken) {
        refetch();
      }

      // Обновляем реф с текущим токеном
      prevTokenRef.current = currentToken;
    }
  }, [reset, dispatch, refetch]);

  const onSubmit = async (data: ChangeDeliveryAddressDto) => {
    try {
      console.log("Submitting form data:", data);
      console.log("Current token:", localStorage.getItem("accessToken"));
      console.log(
        "Request URL:",
        "http://localhost:5000/api/user/delivery-addresses"
      );

      if (editingIndex !== null) {
        // Проверяем, есть ли изменения
        if (!hasChanges(data, addresses[editingIndex])) {
          setSuccess("Нет изменений для сохранения");
          setEditingIndex(null);
          reset(emptyAddress);
          return;
        }

        console.log("Updating address with id:", addresses[editingIndex].id);
        await updateAddress({
          id: addresses[editingIndex].id,
          address: data,
        }).unwrap();
        console.log("Update result:", data);
        setSuccess("Адрес успешно обновлен");
      } else {
        console.log("Adding new address");
        await addAddress(data).unwrap();
        console.log("Add result:", data);
        setSuccess("Адрес успешно добавлен");
      }
      setEditingIndex(null);
      setAddMode(false);
      reset(emptyAddress);
    } catch (error: any) {
      console.error("Error details:", error);
      console.error("Error status:", error.status);
      console.error("Error data:", error.data);
      console.error("Error message:", error.message);
      console.error("Error originalStatus:", error.originalStatus);
      console.error("Error originalError:", error.originalError);

      if (error.status === "FETCH_ERROR") {
        setError(
          "Ошибка соединения с сервером. Проверьте, запущен ли сервер на порту 3001 и доступен ли он"
        );
      } else if (error.status === "PARSING_ERROR") {
        setError("Ошибка обработки ответа сервера");
      } else if (error.data?.message) {
        setError(error.data.message);
      } else if (error.error) {
        setError(error.error);
      } else {
        setError("Произошла ошибка при сохранении адреса");
      }
    }
  };

  const handleEditClick = (index: number) => {
    setAddMode(false);
    if (editingIndex === index) {
      // Повторный клик по карандашу: скрываем инпуты
      setEditingIndex(null);
      reset(emptyAddress);
      return;
    }
    setEditingIndex(index);
    reset(addresses[index]);
  };

  const handleCloseSnackbar = () => {
    setError(null);
    setSuccess(null);
  };

  const handleDeleteClick = (addressId: number) => {
    setAddressToDelete(addressId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (addressToDelete === null) return;

    try {
      await deleteAddress(addressToDelete).unwrap();

      // Если удаляемый адрес был выбранным, очищаем выбор
      if (selectedAddress && selectedAddress.id === addressToDelete) {
        dispatch(clearSelectedAddress());
        setSelectedIndex(null);
      }

      setSuccess("Адрес успешно удален");
      setDeleteDialogOpen(false);
      setAddressToDelete(null);
    } catch (error: any) {
      setError(error.data?.message || "Ошибка при удалении адреса");
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setAddressToDelete(null);
  };

  const handleCancelAdd = () => {
    setAddMode(false);
    setEditingIndex(null);
    reset(emptyAddress);
  };

  if (isLoading) {
    return (
      <div className="w-full mb-[89px]">
        <div className="mb-[19px] w-full">
          <div className="animate-pulse">
            <div className="h-10 bg-gray-200 rounded w-1/3 mb-6" />
            {[...Array(2)].map((_, i) => (
              <div
                key={i}
                className="bg-gray-100 rounded-lg shadow-md mb-4 h-[74px] w-full"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <Fade in={true} timeout={1000}>
      <div className={`w-full ${compact ? 'mb-0' : 'mb-[89px]'}`}>
        <div className="mb-[19px] w-full">
          {!hideHeader && (
            <h3 className="font-light text-[42px] mb-[32px]">Адреса доставки</h3>
          )}

          <AnimatePresence>
            {addresses.map((address: DeliveryAddressDto, index: number) => (
              <motion.div
                key={address.id}
                className="mb-[20px]"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.4 }}
              >
                <div
                  className="bg-white drop-shadow-lg flex items-center justify-between h-[74px] px-[30px] w-full cursor-pointer hover:shadow-lg transition-shadow duration-300 group"
                  onClick={() => {
                    setSelectedIndex(index);
                    dispatch(setSelectedAddress({ address, index }));
                  }}
                >
                  <div className="flex items-center">
                    <div className="bg-white w-[20px] h-[20px] rounded-full drop-shadow-lg mr-[29px] relative flex items-center justify-center">
                      <span
                        className={`rounded-full w-[12px] h-[12px] transition-colors duration-300 ${
                          selectedIndex === index ? "bg-black" : "bg-gray-300"
                        }`}
                      ></span>
                    </div>
                    <div className="flex flex-col">
                      <p className="font-semibold mb-[4px]">{`${address.lastName} ${address.firstName} ${address.patronymic}`}</p>
                      <p className="text-[14px] text-[#00000080]">
                        {`${address.region}, ${address.city}, ул.${
                          address.street
                        }, д.${address.house}${
                          address.building ? `, к.${address.building}` : ""
                        }, кв.${address.apartment}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <motion.div
                      animate={
                        editingIndex === index
                          ? { scale: 0.95, rotate: -10 }
                          : { scale: 1, rotate: 0 }
                      }
                      transition={{ duration: 0.2 }}
                      className="group-hover:scale-110 group-hover:rotate-15 transition-transform duration-200"
                    >
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditClick(index);
                        }}
                        sx={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                          backgroundColor:
                            editingIndex === index ? "black" : "transparent",
                          "&:hover": {
                            backgroundColor:
                              editingIndex === index ? "#333" : "#f0f0f0",
                            transform: "scale(1.1)",
                          },
                          transition: "background-color 0.3s, transform 0.2s",
                        }}
                      >
                        {editingIndex === index ? (
                          <CloseIcon fontSize="small" sx={{ color: "white" }} />
                        ) : (
                          <ModeEditOutlinedIcon
                            fontSize="small"
                            sx={{ color: "gray" }}
                          />
                        )}
                      </IconButton>
                    </motion.div>
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(address.id);
                      }}
                      disabled={isDeleting}
                      sx={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        backgroundColor: "transparent",
                        "&:hover": {
                          backgroundColor: "#ffebee",
                          transform: "scale(1.1)",
                        },
                        transition: "background-color 0.3s, transform 0.2s",
                      }}
                    >
                      <DeleteOutlineIcon
                        fontSize="small"
                        sx={{ color: "#d32f2f" }}
                      />
                    </IconButton>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {!hideLimitInfo && !canAddNewAddress && editingIndex === null && (
            <div className="mb-4 text-red-500">
              Достигнут лимит адресов доставки (максимум {MAX_ADDRESSES})
            </div>
          )}

          <AnimatePresence mode="wait">
            {(addMode || editingIndex !== null) && (
              <motion.form
                key={editingIndex !== null ? "edit" : "add"}
                initial={{ opacity: 0, height: 0, y: 30 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0, y: -30 }}
                transition={{
                  duration: 0.3,
                  height: { duration: 0.3 },
                  opacity: { duration: 0.2 },
                }}
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col mb-[41px] overflow-hidden"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
                  <div className="flex flex-col">
                    <div className="flex flex-col pb-[32px]">
                      <label className="pl-[20px] mb-[5px] text-[14px] font-medium text-[#00000099]">
                        Ваше имя
                      </label>
                      <TextField
                        sx={{ width: "100%", height: "48px" }}
                        type="text"
                        inputProps={{ maxLength: 30 }}
                        onKeyPress={(e) => {
                          if (/\d/.test(e.key)) {
                            e.preventDefault();
                          }
                        }}
                        {...register("firstName", {
                          required: "Это поле обязательное",
                          minLength: { value: 2, message: "Минимум 2 символа" },
                          maxLength: {
                            value: 30,
                            message: "Максимум 30 символов",
                          },
                          pattern: {
                            value: /^[А-Яа-яЁё\s-]+$/,
                            message: "Поле заполнено некорректно",
                          },
                        })}
                        error={!!errors.firstName}
                        helperText={
                          typeof errors.firstName?.message === "string"
                            ? errors.firstName.message
                            : " "
                        }
                      />
                    </div>
                    <div className="flex flex-col pb-[32px]">
                      <label className="pl-[20px] mb-[5px] text-[14px] font-medium text-[#00000099]">
                        Ваше отчество
                      </label>
                      <TextField
                        sx={{ width: "100%", height: "48px" }}
                        type="text"
                        inputProps={{ maxLength: 30 }}
                        {...register("patronymic", {
                          minLength: { value: 2, message: "Минимум 2 символа" },
                          maxLength: {
                            value: 30,
                            message: "Максимум 30 символов",
                          },
                          pattern: {
                            value: /^[А-Яа-яЁё\s-]+$/,
                            message: "Поле заполнено некорректно",
                          },
                        })}
                        onKeyPress={(e) => {
                          if (/\d/.test(e.key)) {
                            e.preventDefault();
                          }
                        }}
                        error={!!errors.patronymic}
                        helperText={
                          typeof errors.patronymic?.message === "string"
                            ? errors.patronymic.message
                            : " "
                        }
                      />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex flex-col pb-[22px]">
                      <label className="pl-[20px] mb-[5px] text-[14px] font-medium text-[#00000099]">
                        Ваша фамилия
                      </label>
                      <TextField
                        sx={{ width: "100%", height: "48px", mb: "8px" }}
                        type="text"
                        inputProps={{ maxLength: 30 }}
                        {...register("lastName", {
                          required: "Это поле обязательное",
                          minLength: { value: 2, message: "Минимум 2 символа" },
                          maxLength: {
                            value: 30,
                            message: "Максимум 30 символов",
                          },
                          pattern: {
                            value: /^[А-Яа-яЁё\s-]+$/,
                            message: "Поле заполнено некорректно",
                          },
                        })}
                        onKeyPress={(e) => {
                          if (/\d/.test(e.key)) {
                            e.preventDefault();
                          }
                        }}
                        error={!!errors.lastName}
                        helperText={
                          typeof errors.lastName?.message === "string"
                            ? errors.lastName.message
                            : " "
                        }
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="pl-[20px] mb-[5px] text-[14px] font-medium text-[#00000099]">
                        Номер телефона
                      </label>
                      <TextField
                        sx={{ width: "100%", height: "48px" }}
                        type="tel"
                        placeholder="+7XXXXXXXXXX"
                        inputProps={{ maxLength: 20 }}
                        {...register("phone", {
                          required: "Это поле обязательное",
                          pattern: {
                            value: /^\+7\d{10}$/,
                            message: "Формат: +7XXXXXXXXXX (10 цифр после +7)",
                          },
                        })}
                        error={!!errors.phone}
                        helperText={
                          typeof errors.phone?.message === "string"
                            ? errors.phone.message
                            : " "
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
                  <div className="flex flex-col">
                    <div className="flex flex-col mb-[21px]">
                      <label className="mb-[5px] pl-[20px] text-[14px] font-medium text-[#00000099]">
                        Область
                      </label>
                      <TextField
                        sx={{ width: "100%", height: "48px" }}
                        type="text"
                        inputProps={{ maxLength: 30 }}
                        onKeyPress={(e) => {
                          if (/\d/.test(e.key)) {
                            e.preventDefault();
                          }
                        }}
                        {...register("region", {
                          required: "Это поле обязательное",
                          minLength: {
                            value: 2,
                            message: "Введите корректную область",
                          },
                          pattern: {
                            value: /^[А-Яа-яЁё\s-]+$/,
                            message: "Поле заполнено некорректно",
                          },
                        })}
                        error={!!errors.region}
                        helperText={
                          typeof errors.region?.message === "string"
                            ? errors.region.message
                            : " "
                        }
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="mb-[5px] pl-[20px] text-[14px] font-medium text-[#00000099]">
                        Улица
                      </label>
                      <TextField
                        sx={{ width: "100%", height: "48px" }}
                        type="text"
                        inputProps={{ maxLength: 30 }}
                        onKeyPress={(e) => {
                          if (/\d/.test(e.key)) {
                            e.preventDefault();
                          }
                        }}
                        {...register("street", {
                          required: "Это поле обязательное",
                          minLength: {
                            value: 2,
                            message: "Введите корректную улицу",
                          },
                          pattern: {
                            value: /^[А-Яа-яЁё\s-]+$/,
                            message: "Поле заполнено некорректно",
                          },
                        })}
                        error={!!errors.street}
                        helperText={
                          typeof errors.street?.message === "string"
                            ? errors.street.message
                            : " "
                        }
                      />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex flex-col mb-[21px]">
                      <label className="mb-[5px] pl-[20px] text-[14px] font-medium text-[#00000099]">
                        Город
                      </label>
                      <TextField
                        sx={{ width: "100%", height: "48px" }}
                        type="text"
                        inputProps={{ maxLength: 30 }}
                        onKeyPress={(e) => {
                          if (/\d/.test(e.key)) {
                            e.preventDefault();
                          }
                        }}
                        {...register("city", {
                          required: "Это поле обязательное",
                          minLength: {
                            value: 2,
                            message: "Введите корректный город",
                          },
                          pattern: {
                            value: /^[А-Яа-яЁё\s-]+$/,
                            message: "Поле заполнено некорректно",
                          },
                        })}
                        error={!!errors.city}
                        helperText={
                          typeof errors.city?.message === "string"
                            ? errors.city.message
                            : " "
                        }
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="flex flex-col">
                        <label className="mb-[5px] text-[14px] font-medium text-[#00000099]">
                          Корпус
                        </label>
                        <TextField
                          sx={{ width: "100%", height: "48px" }}
                          type="text"
                          inputProps={{ maxLength: 10 }}
                          {...register("building", {
                            maxLength: { value: 10, message: "Максимум 10 символов" },
                          })}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="mb-[5px] text-[14px] font-medium text-[#00000099]">
                          Дом
                        </label>
                        <TextField
                          sx={{ width: "100%", height: "48px" }}
                          type="text"
                          inputProps={{ maxLength: 10 }}
                          {...register("house", {
                            required: "Дом обязателен",
                            maxLength: { value: 10, message: "Максимум 10 символов" },
                          })}
                          error={!!errors.house}
                          helperText={
                            typeof errors.house?.message === "string"
                              ? errors.house.message
                              : " "
                          }
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="mb-[5px] text-[14px] font-medium text-[#00000099]">
                          Квартира
                        </label>
                        <TextField
                          sx={{ width: "100%", height: "48px" }}
                          type="text"
                          inputProps={{ maxLength: 10 }}
                          {...register("apartment", {
                            maxLength: { value: 10, message: "Максимум 10 символов" },
                          })}
                          error={!!errors.apartment}
                          helperText={
                            typeof errors.apartment?.message === "string"
                              ? errors.apartment.message
                              : " "
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>



                <div className="flex mt-8 justify-center gap-4">
                  <MainButton
                    text={
                      editingIndex !== null
                        ? "Обновить адрес"
                        : "Добавить адрес"
                    }
                    disabled={
                      isAdding ||
                      isUpdating ||
                      (editingIndex !== null && !isChanged)
                    }
                    type="submit"
                    width="200px"
                    height="56px"
                  />
                  <Button
                    variant="outlined"
                    onClick={handleCancelAdd}
                    disabled={isAdding || isUpdating}
                    sx={{
                      width: "200px",
                      height: "56px",
                      backgroundColor: "#f3f4f6",
                      color: "#374151",
                      borderColor: "#d1d5db",
                      textTransform: "none",
                      fontSize: "18px",
                      fontWeight: 500,
                      borderRadius: "0",
                      "&:hover": {
                        backgroundColor: "#e5e7eb",
                        borderColor: "#9ca3af",
                      },
                      "&:disabled": {
                        backgroundColor: "#f9fafb",
                        color: "#9ca3af",
                        borderColor: "#e5e7eb",
                      },
                    }}
                  >
                    Отмена
                  </Button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          {canAddNewAddress && editingIndex === null && !addMode && (
            <div className="mt-8">
              <MainButton
                text="Добавить новый адрес"
                type="button"
                disabled={isAdding || isUpdating}
                width="260px"
                height="44px"
                onClick={() => {
                  setAddMode(true);
                  setEditingIndex(null);
                  reset(emptyAddress);
                }}
              />
            </div>
          )}
        </div>

        <Dialog
          open={deleteDialogOpen}
          onClose={handleCancelDelete}
          aria-labelledby="delete-dialog-title"
          aria-describedby="delete-dialog-description"
          PaperProps={{
            sx: {
              borderRadius: "12px",
              maxWidth: "400px",
              width: "100%",
              boxShadow:
                "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            },
          }}
        >
          <DialogTitle
            id="delete-dialog-title"
            sx={{
              fontSize: "20px",
              fontWeight: 600,
              color: "#1f2937",
              padding: "24px 24px 8px 24px",
              textAlign: "center",
            }}
          >
            Удалить адрес доставки?
          </DialogTitle>
          <DialogContent sx={{ padding: "8px 24px 24px 24px" }}>
            <p
              id="delete-dialog-description"
              style={{
                fontSize: "14px",
                color: "#6b7280",
                lineHeight: "1.5",
                textAlign: "center",
                margin: 0,
              }}
            >
              Вы уверены, что хотите удалить этот адрес доставки? Это действие
              нельзя отменить.
            </p>
          </DialogContent>
          <DialogActions
            sx={{
              padding: "0 24px 24px 24px",
              justifyContent: "center",
              gap: "12px",
            }}
          >
            <Button
              onClick={handleCancelDelete}
              variant="outlined"
              sx={{
                borderRadius: "8px",
                textTransform: "none",
                fontSize: "14px",
                fontWeight: 500,
                padding: "10px 20px",
                borderColor: "#d1d5db",
                color: "#374151",
                "&:hover": {
                  borderColor: "#9ca3af",
                  backgroundColor: "#f9fafb",
                },
              }}
            >
              Отмена
            </Button>
            <Button
              onClick={handleConfirmDelete}
              variant="contained"
              disabled={isDeleting}
              sx={{
                borderRadius: "8px",
                textTransform: "none",
                fontSize: "14px",
                fontWeight: 500,
                padding: "10px 20px",
                backgroundColor: "#dc2626",
                "&:hover": {
                  backgroundColor: "#b91c1c",
                },
                "&:disabled": {
                  backgroundColor: "#fca5a5",
                  color: "#ffffff",
                },
              }}
            >
              {isDeleting ? "Удаление..." : "Удалить"}
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={!!error || !!success}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={error ? "error" : "success"}
            sx={{ width: "100%" }}
          >
            {error || success}
          </Alert>
        </Snackbar>
      </div>
    </Fade>
  );
};

export default DeliveryAddress;
