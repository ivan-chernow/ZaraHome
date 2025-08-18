"use client";

import React, { useEffect, useMemo, useState } from "react";
import Container from "@mui/material/Container";
import MainLayout from "@/widgets/layout/MainLayout";
import HorizontalLine from "@/shared/ui/HorizontalLine";
import { TextField, Alert } from "@mui/material";
import Image from "next/image";
import MainButton from "@/shared/ui/Button/MainButton";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/shared/config/store/store";
import {
  selectCartItems,
  selectCartTotalPrice,
  CartItem,
} from "@/entities/cart/model/cartItems.slice";
import { updateOrderStatus } from "@/entities/order/model/order.slice";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HttpsOutlinedIcon from "@mui/icons-material/HttpsOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";

type Step = "form" | "3ds" | "result";

const PaymentPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((s: RootState) => s.auth);
  const { selectedAddress } = useSelector((s: RootState) => s.delivery);
  const cartItems = useSelector((s: RootState) => selectCartItems(s) as CartItem[]);
  const cartTotal = useSelector((s: RootState) => selectCartTotalPrice(s) as number);

  const totalCount = useMemo(
    () => cartItems.reduce((sum, i) => sum + i.quantity, 0),
    [cartItems]
  );

  // UI state (всегда объявляем все хуки до любых ранних return)
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<Step>("form");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [exp, setExp] = useState("");
  const [cvc, setCvc] = useState("");
  const [code3ds, setCode3ds] = useState("");
  const [error, setError] = useState<string | null>(null);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const isCartEmpty = cartItems.length === 0;

  const formatCardNumber = (value: string) =>
    value
      .replace(/[^0-9]/g, "")
      .slice(0, 16)
      .replace(/(.{4})/g, "$1 ")
      .trim();

  const handleSubmitCard = () => {
    setError(null);
    const clean = cardNumber.replace(/\s/g, "");
    const valid = clean.length === 16 && /^(0[1-9]|1[0-2])\/\d{2}$/.test(exp) && cvc.replace(/\D/g, "").length === 3;
    if (!valid) {
      setError("Проверьте корректность данных карты");
      return;
    }
    setStep("3ds");
  };

  const handleConfirm3ds = () => {
    if (code3ds.trim().length < 6) {
      setError("Введите 6-значный код подтверждения");
      return;
    }
    
    // Обновляем статус заказа на "оплачен"
    dispatch(updateOrderStatus({
      orderId: "current", // Обновим текущий заказ
      status: "paid",
    }));
    
    setStep("result");
    setTimeout(() => router.push("/"), 1200);
  };

  return (
    <MainLayout>
      <Container maxWidth="lg" sx={{ pt: "45px" }}>
        <p className="font-light text-[42px] mb-[32px]">Оплата заказа</p>

        {!isAuthenticated ? (
          <Alert severity="info" className="mb-6">
            Для оплаты войдите в аккаунт.
          </Alert>
        ) : null}

        <div className="flex items-start justify-between gap-8">
          {/* Left: merchant/order info and form/3ds */}
          <div className="flex-1">
            <div className="bg-white drop-shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <HttpsOutlinedIcon fontSize="small" sx={{ color: "gray" }} />
                  <span className="ml-2 text-[#00000099] text-sm">Защищенная оплата</span>
                </div>
                <Image src="/assets/img/Order/mir.svg" alt="MIR" width={72} height={22} />
              </div>
              <div className="mb-6">
                <p className="text-sm text-[#00000099]">Получатель</p>
                <p className="text-[18px] font-semibold">ZaraHome ECOM</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-[#00000099]">Сумма</p>
                  <p className="text-[22px] font-roboto font-medium">{cartTotal.toLocaleString("ru-RU")} ₽</p>
                </div>
                <div>
                  <p className="text-sm text-[#00000099]">Товаров</p>
                  <p className="text-[22px] font-roboto font-medium">{totalCount}</p>
                </div>
              </div>

              {step === "form" && (
                <div>
                  <div className="flex items-center mb-[18px]">
                    <p className="font-medium text-[#0000004D] mr-[5px]">Данные карты</p>
                    <HorizontalLine width="540px" />
                  </div>
                  {!!error && (
                    <div className="mb-3"><Alert severity="error">{error}</Alert></div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextField
                      label="Номер карты"
                      placeholder="0000 0000 0000 0000"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      sx={{ height: "48px" }}
                      inputProps={{ inputMode: "numeric" }}
                    />
                    <TextField
                      label="Имя на карте"
                      placeholder="IVAN IVANOV"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value.toUpperCase())}
                      sx={{ height: "48px" }}
                    />
                    <TextField
                      label="Срок"
                      placeholder="MM/YY"
                      value={exp}
                      onChange={(e) => setExp(e.target.value.replace(/[^0-9/]/g, "").slice(0,5))}
                      sx={{ height: "48px" }}
                    />
                    <TextField
                      label="CVC"
                      placeholder="000"
                      value={cvc}
                      onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0,3))}
                      sx={{ height: "48px" }}
                      inputProps={{ inputMode: "numeric" }}
                    />
                  </div>
                  <div className="mt-6 flex items-center gap-3">
                    <MainButton
                      text="Оплатить"
                      disabled
                      type="button"
                      width="220px"
                      height="48px"
                      onClick={handleSubmitCard}
                    />
                    <button
                      className="text-sm text-[#00000099] underline cursor-pointer"
                      onClick={() => router.push("/order")}
                    >
                      <span className="inline-flex items-center"><ArrowBackIcon fontSize="small" className="mr-1"/>Назад к оформлению</span>
                    </button>
                  </div>
                </div>
              )}

              {step === "3ds" && (
                <div>
                  <div className="flex items-center mb-[18px]">
                    <p className="font-medium text-[#0000004D] mr-[5px]">3‑D Secure подтверждение</p>
                    <HorizontalLine width="420px" />
                  </div>
                  {!!error && (
                    <div className="mb-3"><Alert severity="error">{error}</Alert></div>
                  )}
                  <p className="text-sm text-[#00000099] mb-3">Мы отправили код подтверждения на ваш телефон. Введите 6 цифр ниже.</p>
                  <TextField
                    value={code3ds}
                    onChange={(e) => setCode3ds(e.target.value.replace(/\D/g, "").slice(0,6))}
                    placeholder="______"
                    sx={{ width: "220px", height: "48px" }}
                    inputProps={{ inputMode: "numeric", style: { letterSpacing: "10px", textAlign: "center" } }}
                  />
                  <div className="mt-6 flex items-center gap-3">
                    <MainButton
                      text="Подтвердить"
                      disabled={code3ds.length < 6}
                      type="button"
                      width="220px"
                      height="48px"
                      onClick={handleConfirm3ds}
                    />
                    <button className="text-sm text-[#00000099] underline" onClick={() => setStep("form")}>Изменить способ</button>
                  </div>
                </div>
              )}

              {step === "result" && (
                <div className="flex items-center gap-3">
                  <CheckCircleOutlineIcon sx={{ color: "#16a34a" }} />
                  <p className="text-[18px] font-medium">Оплата прошла успешно. Возвращаем на главную…</p>
                </div>
              )}
            </div>
          </div>

          {/* Right: totals */}
          <div className="flex flex-col w-[413px] drop-shadow-lg items-center justify-start bg-white py-[22px]">
            <div className="mb-[10px] flex items-center justify-center ">
              <HorizontalLine width="141px" />
              <p className="font-medium text-[#0000004D] mx-[10px]">Итого</p>
              <HorizontalLine width="146px" />
            </div>
            <p className="font-medium text-[32px] font-roboto">
              {cartTotal.toLocaleString("ru-RU")} <span className="text-[24px] font-bold">₽</span>
            </p>
            <p className="font-medium mb-[20px]">{totalCount} товаров</p>
            <div className="text-xs text-[#00000099] flex items-center gap-1"><HttpsOutlinedIcon fontSize="inherit"/> Безопасное соединение</div>
          </div>
        </div>
      </Container>
    </MainLayout>
  );
};

export default PaymentPage;


