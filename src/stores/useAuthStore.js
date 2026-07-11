import { create } from "zustand";

export const useAuthStore = create((set) => ({
  userId: "",
  fullName: "",
  email: "",
  role: "",

  setUserId: (userId) => set({ userId: userId }),
  setFullName: (fullname) => set({ fullName: fullname }),
  setEmail: (emailId) => set({ email: emailId }),
  setRole: (userRole) => set({ role: userRole }),
}));
