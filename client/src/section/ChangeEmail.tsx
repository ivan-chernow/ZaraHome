import React from "react";
import { Alert, Fade, TextField } from "@mui/material";
import MainButton from "@/components/Button/MainButton";
import { useForm } from "react-hook-form";
import { useChangeEmailMutation } from "@/api/profile.api";
import { emailValidation } from "@/vaildation/validation";

interface FormInputs {
  email: string;
  newEmail: string;
}

const ChangeEmail = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>({
    mode: "onChange",
  });
  const [
    changeEmail,
    { isLoading, error: errorChangeEmail, isSuccess: isSuccessChangeEmail },
  ] = useChangeEmailMutation();

  const onSubmit = async (data: FormInputs) => {
    await changeEmail({
      email: data.email,
      newEmail: data.newEmail,
    });
  };

  if (isLoading) {
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
    <Fade in={true} timeout={1000}>
      <div className="">
        <h4 className="font-light text-[42px] mb-[37px]">Смена E-mail</h4>
        {errorChangeEmail && (
          <Alert severity="error" className="mb-4">
            {("data" in errorChangeEmail &&
              (errorChangeEmail.data as { message: string })?.message) ||
              ""}
          </Alert>
        )}
        {isSuccessChangeEmail && (
          <Alert severity="success" className="mb-4">
            Почта успешно изменена!
          </Alert>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="mb-[5px]">
          <div className="flex items-center  mb-[23px]">
            <div className="flex flex-col mr-[27px]">
              <label
                htmlFor=""
                className="mb-[5px] pl-[20px] font-medium text-[14px] text-[#00000099]"
              >
                Текущий email
              </label>
              <TextField
                sx={{ width: "410px", height: "48px" }}
                {...register("email", emailValidation)}
                error={!!errors.email}
                helperText={errors.email?.message as string}
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor=""
                className="mb-[5px] pl-[20px] font-medium text-[14px] text-[#00000099]"
              >
                Новый E-mail
              </label>
              <TextField
                sx={{ width: "410px", height: "48px" }}
                {...register("newEmail", emailValidation)}
                error={!!errors.newEmail}
                helperText={errors.newEmail?.message as string}
              />
            </div>
          </div>

          <div className="flex  pt-[20px]">
            <MainButton
              text="Сменить E-mail"
              disabled={isLoading || !!errors.email || !!errors.newEmail}
              onClick={handleSubmit(onSubmit)}
              type="button"
              width="358px"
              height="56px"
            />
          </div>
        </form>
      </div>
    </Fade>
  );
};

export default ChangeEmail;
