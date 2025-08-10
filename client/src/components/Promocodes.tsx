import React, { useState } from "react";
import {
  useGetAllActiveQuery,
  useCreatePromocodeMutation,
  useDeactivatePromocodeMutation,
} from "@/api/promocodes.api";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { Fade, TextField, Alert } from "@mui/material";
import HorizontalLine from "@/components/ui/HorizontalLine";
import MainButton from "@/components/Button/MainButton";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const Promocodes = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { data: promocodes, isLoading, refetch } = useGetAllActiveQuery();
  const [createPromocode, { isLoading: isCreating, error: createError }] =
    useCreatePromocodeMutation();
  const [deactivatePromocode, { isLoading: isDeactivating }] =
    useDeactivatePromocodeMutation();

  const getErrorMessage = (error: unknown): string => {
    if (typeof error === "string") return error;
    if (error && typeof error === "object" && "data" in error) {
      const fetchError = error as FetchBaseQueryError;
      if (typeof fetchError.data === "string") return fetchError.data;
      if (
        fetchError.data &&
        typeof fetchError.data === "object" &&
        "message" in fetchError.data
      ) {
        return (fetchError.data as { message: string }).message;
      }
    }
    return "Произошла ошибка";
  };

  const validatePromocode = (): boolean => {
    if (!code.trim()) {
      setLocalError("Введите код промокода");
      return false;
    }

    if (code.length < 3) {
      setLocalError("Код промокода должен содержать минимум 3 символа");
      return false;
    }

    if (!/^[A-Z]+$/.test(code)) {
      setLocalError("Код промокода может содержать только английские буквы");
      return false;
    }

    if (!discount || Number(discount) < 1 || Number(discount) > 100) {
      setLocalError("Скидка должна быть от 1 до 100%");
      return false;
    }

    // Проверка дубликата кода среди уже существующих промокодов
    const exists = (promocodes || []).some(
      (p) => p.code.toUpperCase() === code.trim().toUpperCase()
    );
    if (exists) {
      setLocalError("Промокод уже существует");
      return false;
    }

    return true;
  };

  const handleCreatePromocode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setSuccessMessage(null);

    if (!validatePromocode()) {
      return;
    }

    try {
      await createPromocode({
        code: code.toUpperCase(),
        discount: Number(discount),
      }).unwrap();

      setSuccessMessage("Промокод успешно создан");
      setCode("");
      setDiscount("");
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      setLocalError(errorMessage);
    }
  };

  const handleDeactivate = async (code: string) => {
    try {
      await deactivatePromocode(code).unwrap();
      setSuccessMessage("Промокод успешно деактивирован");
      refetch();
    } catch (error) {
      const errMsg = getErrorMessage(error);
      setLocalError(errMsg);
    }
  };

  if (!user) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg font-medium text-gray-600">Загрузка...</div>
      </div>
    );
  }

  return (
    <Fade in={true} timeout={700}>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <h4 className="font-light text-[42px] mb-[37px]">
          Управление промокодами
        </h4>

        <div className="flex items-center mb-[28px]">
          <p className="font-medium text-[#0000004D] mr-[5px]">
            Создание промокода
          </p>
          <HorizontalLine width="615px" />
        </div>

        {/* Форма создания промокода */}
        <form onSubmit={handleCreatePromocode} className="mb-[37px]">
          <div className="flex items-center mb-[23px]">
            <div className="flex flex-col mr-[27px]">
              <label
                htmlFor="code"
                className="mb-[5px] pl-[20px] font-medium text-[14px] text-[#00000099]"
              >
                Код промокода
              </label>
              <TextField
                id="code"
                value={code}
                onChange={(e) => {
                  const value = e.target.value
                    .replace(/[^A-Za-z]/g, "")
                    .toUpperCase();
                  setCode(value);
                  setLocalError(null);
                }}
                sx={{ width: "410px", height: "48px" }}
                disabled={isCreating}
                error={false}
                helperText={undefined}
                inputProps={{ maxLength: 20 }}
              />
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="discount"
                className="mb-[5px] pl-[20px] font-medium text-[14px] text-[#00000099]"
              >
                Скидка (%)
              </label>
              <TextField
                id="discount"
                type="number"
                value={discount}
                onChange={(e) => {
                  const value = e.target.value
                    .replace(/[^0-9]/g, "")
                    .slice(0, 3);
                  setDiscount(value);
                  setLocalError(null);
                }}
                placeholder="От 1 до 100"
                sx={{ width: "410px", height: "48px" }}
                disabled={isCreating}
                error={!!localError}
                inputProps={{
                  maxLength: 3,
                  min: 1,
                  max: 100,
                }}
              />
            </div>
          </div>

          <div className="flex">
            <MainButton
              text={isCreating ? "Создание..." : "Создать промокод"}
              disabled={isCreating}
              type="submit"
              width="358px"
              height="56px"
            />
          </div>
        </form>

        {/* Сообщения об ошибках и успехе */}
        {localError && (
          <Alert severity="error" className="mb-4">
            {localError}
          </Alert>
        )}
        {createError && (
          <Alert severity="error" className="mb-4">
            {getErrorMessage(createError)}
          </Alert>
        )}
        {successMessage && (
          <Alert severity="success" className="mb-4">
            {successMessage}
          </Alert>
        )}

        {/* Единый список промокодов */}
        <div className="flex items-center mb-[28px] mt-8">
          <p className="font-medium text-[#0000004D] mr-[5px]">
            Список промокодов
          </p>
          <HorizontalLine width="615px" />
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#00000099] uppercase tracking-wider">
                    Код
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#00000099] uppercase tracking-wider">
                    Скидка
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#00000099] uppercase tracking-wider">
                    Статус
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#00000099] uppercase tracking-wider">
                    Дата создания
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#00000099] uppercase tracking-wider">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {promocodes?.map((promo) => (
                  <tr key={promo.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#00000099]">
                      {promo.code}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#00000099]">
                      {promo.discount}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          promo.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {promo.isActive ? "Активен" : "Неактивен"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#00000099]">
                      {new Date(promo.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#00000099]">
                      {promo.isActive && (
                        <button
                          onClick={() => handleDeactivate(promo.code)}
                          className=" cursor-pointer text-red-600 hover:text-red-900 font-medium disabled:text-red-400 disabled:cursor-not-allowed transition-colors"
                          disabled={isDeactivating}
                        >
                          {isDeactivating ? "Деактивация..." : "Деактивировать"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Fade>
  );
};

export default Promocodes;
