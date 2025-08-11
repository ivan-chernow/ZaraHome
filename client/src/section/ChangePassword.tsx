import React from "react";
import { Fade, TextField, Alert } from "@mui/material";
import HorizontalLine from "@/components/ui/HorizontalLine";
import { useForm } from "react-hook-form";
import {
  getPasswordValidation,
  getRepeatPasswordValidation,
} from "@/vaildation/validation";
import { useChangePasswordMutation } from "@/api/profile.api";
import MainButton from "@/components/Button/MainButton";

interface FormInputs {
  password: string;
  confirmPassword: string;
}

const ChangePassword = () => {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<FormInputs>({
    mode: "onChange",
  });
  const [
    changePassword,
    {
      isLoading: loadingChangePassword,
      error: errorChangePassword,
      isSuccess: isSuccessChangePassword,
    },
  ] = useChangePasswordMutation();

  const onSubmit = async (data: FormInputs) => {
    await changePassword({
      currentPassword: data.password, // Временно используем password как currentPassword
      newPassword: data.confirmPassword,
    }).unwrap();
  };

  if (loadingChangePassword) {
    return (
      <div className="animate-pulse">
        <div className="h-10 bg-gray-200 rounded w-1/3 mb-6" />
        <div className="flex gap-8 mb-6">
          <div className="h-12 bg-gray-200 rounded w-[410px]" />
          <div className="h-12 bg-gray-200 rounded w-[410px]" />
        </div>
        <div className="h-12 bg-gray-200 rounded w-[358px]" />
      </div>
    );
  }

  return (
    <Fade in={true} timeout={700}>
      <div className="">
        <h4 className="font-light text-[42px] mb-[37px]">Смена пароля</h4>
        <div className="flex items-center ">
          <p className="font-medium text-[#0000004D] mr-[5px] mb-[28px]">
            Новый пароль
          </p>
          <HorizontalLine width="615px" />
        </div>
        {errorChangePassword && (
          <Alert severity="error" className="mb-4">
            {(errorChangePassword as any).data?.message ||
              "Произошла ошибка при смене пароля"}
          </Alert>
        )}
        {isSuccessChangePassword && (
          <Alert severity="success" className="mb-4">
            Пароль успешно изменен!
          </Alert>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="mb-[5px]">
          <div className="flex items-center  mb-[23px]">
            <div className="flex flex-col mr-[27px]">
              <label
                htmlFor=""
                className="mb-[5px] pl-[20px] font-medium text-[14px] text-[#00000099]"
              >
                Пароль
              </label>
              <TextField
                sx={{ width: "410px", height: "48px" }}
                type="password"
                {...register("password", getPasswordValidation())}
                error={!!errors.password}
                helperText={errors.password?.message as string}
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor=""
                className="mb-[5px] pl-[20px] font-medium text-[14px] text-[#00000099]"
              >
                Повторите пароль
              </label>
              <TextField
                sx={{ width: "410px", height: "48px" }}
                type="password"
                {...register(
                  "confirmPassword",
                  getRepeatPasswordValidation(getValues)
                )}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message as string}
              />
            </div>
          </div>
          <div
            className={`flex  ${
              !!errors.password || !!errors.confirmPassword
                ? "pt-[40px]"
                : "pt-[0]"
            }`}
          >
            <MainButton
              text="Сменить пароль"
              disabled={
                loadingChangePassword ||
                !!errors.password ||
                !!errors.confirmPassword
              }
              type="submit"
              width="358px"
              height="56px"
            />
          </div>
        </form>
      </div>
    </Fade>
  );
};
export default ChangePassword;
