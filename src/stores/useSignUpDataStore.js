import { create } from "zustand";

export const useSignUpDataStore = create((set) => ({
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
  setFullNameGlobal: (fullNameGlobal) => set({ fullName: fullNameGlobal }),
  setEmailIdGlobal: (emailGlobal) => set({ email: emailGlobal }),
  setPasswordGlobal: (passwordGlobal) => set({ password: passwordGlobal }),
  setConfirmPasswordGlobal: (confirmPasswordGlobal) =>
    set({ confirmPassword: confirmPasswordGlobal }),
}));
