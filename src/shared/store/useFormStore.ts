import { create } from 'zustand';
import type { FormData } from '../validations/validation';
import type { FormsStore, ModalKey } from './types';

const initialFormDataState = {
  acceptedTerms: false,
  age: 0,
  country: '',
  email: '',
  gender: '',
  name: '',
  password: '',
  picture: '',
  confirmPassword: '',
};

const countries = [
  'USA',
  'Canada',
  'Mexico',
  'Brazil',
  'Germany',
  'France',
  'Italy',
  'Spain',
  'Portugal',
  'Netherlands',
  'Belgium',
  'Switzerland',
  'Austria',
];

export const useFormStore = create<FormsStore>((set, get) => ({
  countriesVariants: countries,
  uncontrolledModal: {
    modalKey: 'uncontrolled',
    formData: initialFormDataState,
  },
  controlledModal: {
    modalKey: 'controlled',
    formData: initialFormDataState,
  },
  openedModalKeys: [],

  openModal: (key: ModalKey) => {
    set((state) => ({
      openedModalKeys: [...state.openedModalKeys, key],
    }));
  },

  closeModal: () => {
    set((state) => ({
      openedModalKeys: state.openedModalKeys.slice(0, -1),
    }));
  },

  closeModalByKey: (key: ModalKey) => {
    set((state) => ({
      openedModalKeys: state.openedModalKeys.filter((k) => k !== key),
    }));
  },

  setModalDataByKey: (key: ModalKey, data: FormData) => {
    set((state) => {
      if (key === 'uncontrolled') {
        return {
          uncontrolledModal: {
            ...state.uncontrolledModal,
            formData: data,
          },
        };
      } else {
        return {
          controlledModal: {
            ...state.controlledModal,
            formData: data,
          },
        };
      }
    });
  },

  submitForm: (formData: FormData) => {
    const currentModal =
      get().openedModalKeys[get().openedModalKeys.length - 1];

    if (!currentModal) return;

    set((state) => {
      const dataUpdate = {
        openedModalKeys: state.openedModalKeys.filter(
          (k) => k !== currentModal
        ),
      };

      if (currentModal === 'uncontrolled') {
        return {
          ...dataUpdate,
          uncontrolledModal: {
            ...state.uncontrolledModal,
            formData,
          },
        };
      } else {
        return {
          ...dataUpdate,
          controlledModal: {
            ...state.controlledModal,
            formData,
          },
        };
      }
    });
  },
}));
