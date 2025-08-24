import type { FormData } from '../validations/validation';

export type ModalKey = 'uncontrolled' | 'controlled';

export interface StoreModal<T extends ModalKey> {
  modalKey: T;
  formData?: FormData;
}

export interface FormsState {
  uncontrolledModal: StoreModal<'uncontrolled'>;
  controlledModal: StoreModal<'controlled'>;
  countriesVariants: string[];
  openedModalKeys: ModalKey[];
}

export interface FormsActions {
  openModal: (key: ModalKey) => void;
  closeModal: () => void;
  closeModalByKey: (key: ModalKey) => void;
  setModalDataByKey: (key: ModalKey, data: FormData) => void;
  submitForm: (data: FormData) => void;
}

export type FormsStore = FormsState & FormsActions;
