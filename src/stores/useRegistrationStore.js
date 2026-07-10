// stores/useAthleteRegistrationStore.js

import { create } from "zustand";

const initialState = {
  // Navigation
  currentStep: 1,

  // Personal Details
  playerName: "",
  emailAddress: "",
  contactNumber: "",
  dateOfBirth: "",
  gender: "MALE",

  // Parent details
  fathersName: "",
  mothersName: "",
  alternateMobileNo: "",

  // Address
  address: "",
  pinCode: "",
  stateOrProvince: "",
  country: "",

  // Sports
  club: "",
  sports: "",
  // Competition
  competitions: [],

  // Documents
  profilePhoto: null,
  playerDocuments: [],
  fileTitles: [],
};

export const useAthleteRegistrationStore = create((set) => ({
  ...initialState,

  // Navigation
  nextStep: () =>
    set((state) => ({
      currentStep: state.currentStep + 1,
    })),

  previousStep: () =>
    set((state) => ({
      currentStep: Math.max(1, state.currentStep - 1),
    })),

  goToStep: (step) =>
    set({
      currentStep: step,
    }),

  // Update any field
  updateField: (name, value) =>
    set({
      [name]: value,
    }),

  // Profile Photo
  setProfilePhoto: (file) =>
    set({
      profilePhoto: file,
    }),

  // Documents
  setPlayerDocuments: (files) =>
    set({
      playerDocuments: files,
    }),

  // Document Titles
  setFileTitles: (titles) =>
    set({
      fileTitles: titles,
    }),

  // Competitions
  addCompetition: (competition) =>
    set((state) => ({
      competitions: [...state.competitions, competition],
    })),

  updateCompetition: (index, competition) =>
    set((state) => ({
      competitions: state.competitions.map((item, i) =>
        i === index ? competition : item,
      ),
    })),

  removeCompetition: (index) =>
    set((state) => ({
      competitions: state.competitions.filter((_, i) => i !== index),
    })),

  // Reset
  reset: () =>
    set({
      ...initialState,
    }),
}));
