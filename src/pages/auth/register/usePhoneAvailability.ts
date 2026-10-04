import { useEffect, useState } from "react";
import type { Control, UseFormSetError, UseFormClearErrors } from "react-hook-form";
import { useWatch } from "react-hook-form";
import { registrationApi } from "@/features/auth";
import { PHONE_REGEX, type RegisterValues } from "./register-schema";

export type PhoneStatus = "idle" | "checking" | "available" | "taken";

export const PHONE_TAKEN_MESSAGE = "Số điện thoại đã được đăng ký.";
const DEBOUNCE_MS = 500;

/** Debounced POST /api/registrations/phone-availability while the user types */
export function usePhoneAvailability(
  control: Control<RegisterValues>,
  setError: UseFormSetError<RegisterValues>,
  clearErrors: UseFormClearErrors<RegisterValues>,
): PhoneStatus {
  const phone = useWatch({ control, name: "phone" });
  const value = phone?.trim() ?? "";
  const valid = PHONE_REGEX.test(value);
  /** Last answer from BE; exists=null means the check failed */
  const [result, setResult] = useState<{ phone: string; exists: boolean | null } | null>(null);

  useEffect(() => {
    if (!valid) return;
    let cancelled = false;
    const timer = setTimeout(async () => {
      let exists: boolean | null = null;
      try {
        ({ exists } = await registrationApi.checkPhone(value));
      } catch {
        // Check is advisory — BE still validates on submit
      }
      if (cancelled) return;
      setResult({ phone: value, exists });
      if (exists) setError("phone", { type: "taken", message: PHONE_TAKEN_MESSAGE });
      else if (exists === false) clearErrors("phone");
    }, DEBOUNCE_MS);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [value, valid, setError, clearErrors]);

  let status: PhoneStatus = "idle";
  if (valid)
    status =
      result?.phone !== value
        ? "checking"
        : result.exists === null
          ? "idle"
          : result.exists
            ? "taken"
            : "available";
  return status;
}
