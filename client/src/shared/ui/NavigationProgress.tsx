"use client";
import { LinearProgress } from "@mui/material";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const NavigationProgress: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const handleStart = () => {
      setIsLoading(true);
      setProgress(0);
      // Начинаем с 0% и постепенно увеличиваем до 90%
      timer = setInterval(() => {
        setProgress((oldProgress) => {
          if (oldProgress >= 90) {
            clearInterval(timer);
            return 90;
          }
          return oldProgress + 10;
        });
      }, 100);
    };

    const handleComplete = () => {
      // Доводим до 100% и скрываем
      setProgress(100);
      setTimeout(() => {
        setIsLoading(false);
        setProgress(0);
      }, 200);
    };

    // Отслеживаем клики по ссылкам
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest("a");
      if (link && link.href.startsWith(window.location.origin)) {
        handleStart();
      }
    };

    // Отслеживаем программную навигацию
    const handlePushState = () => handleStart();
    const handlePopState = () => handleStart();

    // Отслеживаем все события навигации
    window.addEventListener("beforeunload", handleStart);
    window.addEventListener("load", handleComplete);
    document.addEventListener("click", handleClick);
    window.addEventListener("pushState", handlePushState);
    window.addEventListener("popstate", handlePopState);

    // Перехватываем все переходы
    const originalPush = router.push;
    router.push = (...args) => {
      handleStart();
      return originalPush.apply(router, args);
    };

    return () => {
      window.removeEventListener("beforeunload", handleStart);
      window.removeEventListener("load", handleComplete);
      document.removeEventListener("click", handleClick);
      window.removeEventListener("pushState", handlePushState);
      window.removeEventListener("popstate", handlePopState);
      if (timer) clearInterval(timer);
    };
  }, [router]);

  useEffect(() => {
    if (isLoading) {
      setProgress(100);
      setTimeout(() => {
        setIsLoading(false);
        setProgress(0);
      }, 200);
    }
  }, [pathname, searchParams, isLoading]);

  if (!isLoading) return null;

  return (
    <LinearProgress
      variant="determinate"
      value={progress}
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        height: 4,
        backgroundColor: "rgba(25, 118, 210, 0.1)",
        "& .MuiLinearProgress-bar": {
          backgroundColor: "#1976d2",
          transition: "transform 0.2s linear",
        },
      }}
    />
  );
}

export default NavigationProgress;
