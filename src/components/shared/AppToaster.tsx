"use client";

import { useEffect } from "react";
import { toast, Toaster } from "sonner";

import {
  CircleAlert,
  CircleCheck,
  Info,
  Loader2,
  TriangleAlert,
} from "lucide-react";

export function AppToaster() {
  useEffect(() => {
    const loginSuccess = sessionStorage.getItem("booknook-login-success");

    if (loginSuccess === "true") {
      sessionStorage.removeItem("booknook-login-success");
      toast.success("Welcome back to BookNook!");
    }
  }, []);
  return (
    <Toaster
      position="top-right"
      duration={2000}
      visibleToasts={2}
      offset={16}
      mobileOffset={{ bottom: 12, right: 12 }}
      icons={{
        success: <CircleCheck className="size-4 text-[#B48A32]" />,
        error: <CircleAlert className="size-4 text-[#B5483B]" />,
        warning: <TriangleAlert className="size-4 text-[#B48A32]" />,
        info: <Info className="size-4 text-[#5B6B61]" />,
        loading: <Loader2 className="size-4 animate-spin text-[#B48A32]" />,
      }}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            "!flex !w-fit !flex-none !max-w-[calc(100vw-24px)] items-center gap-2.5 rounded-md border bg-[#F3EFE3] px-4 py-2.5 text-[#17302A] shadow-[0_8px_24px_-8px_rgba(15,33,28,0.25)]",
          title: "text-[13px] font-medium leading-5 text-[#17302A]",
          description: "text-xs leading-5 text-[#5B6B61]",
          icon: "flex shrink-0 items-center",
          default: "border-[#D3DACD]",
          success: "border-[#D9A441]/70",
          error: "border-[#B5483B]/70",
          warning: "border-[#D9A441]/70",
          info: "border-[#D3DACD]",
        },
      }}
    />
  );
}
