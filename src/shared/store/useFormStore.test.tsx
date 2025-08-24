import { act } from '@testing-library/react';
import { useFormStore } from './useFormStore';
import type { FormData } from '../validations/validation';

describe('useFormStore', () => {
  beforeEach(() => {
    useFormStore.setState({
      uncontrolledModal: {
        modalKey: 'uncontrolled',
        formData: {
          acceptedTerms: false,
          age: 0,
          country: '',
          email: '',
          gender: '',
          name: '',
          password: '',
          picture: '',
          confirmPassword: '',
        },
      },
      controlledModal: {
        modalKey: 'controlled',
        formData: {
          acceptedTerms: false,
          age: 0,
          country: '',
          email: '',
          gender: '',
          name: '',
          password: '',
          picture: '',
          confirmPassword: '',
        },
      },
      openedModalKeys: [],
      countriesVariants: [
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
      ],
    });
  });

  test('should have initial state', () => {
    const state = useFormStore.getState();

    expect(state.countriesVariants).toHaveLength(13);
    expect(state.uncontrolledModal.modalKey).toBe('uncontrolled');
    expect(state.controlledModal.modalKey).toBe('controlled');
    expect(state.openedModalKeys).toEqual([]);
  });

  test('openModal should add modal key to openedModalKeys', () => {
    act(() => {
      useFormStore.getState().openModal('uncontrolled');
    });

    const state = useFormStore.getState();
    expect(state.openedModalKeys).toEqual(['uncontrolled']);
  });

  test('closeModal should remove last modal key', () => {
    act(() => {
      useFormStore.getState().openModal('uncontrolled');
      useFormStore.getState().openModal('controlled');
      useFormStore.getState().closeModal();
    });

    const state = useFormStore.getState();
    expect(state.openedModalKeys).toEqual(['uncontrolled']);
  });

  test('closeModalByKey should remove specific modal key', () => {
    act(() => {
      useFormStore.getState().openModal('uncontrolled');
      useFormStore.getState().openModal('controlled');
      useFormStore.getState().closeModalByKey('uncontrolled');
    });

    const state = useFormStore.getState();
    expect(state.openedModalKeys).toEqual(['controlled']);
  });

  test('setModalDataByKey should update form data for uncontrolled modal', () => {
    const newFormData: FormData = {
      acceptedTerms: true,
      age: 25,
      country: 'USA',
      email: 'test@example.com',
      gender: 'male',
      name: 'John Doe',
      password: 'password123',
      picture: 'base64image',
      confirmPassword: 'password123',
    };

    act(() => {
      useFormStore.getState().setModalDataByKey('uncontrolled', newFormData);
    });

    const state = useFormStore.getState();
    expect(state.uncontrolledModal.formData).toEqual(newFormData);
    expect(state.controlledModal.formData).not.toEqual(newFormData);
  });

  test('setModalDataByKey should update form data for controlled modal', () => {
    const newFormData: FormData = {
      acceptedTerms: true,
      age: 30,
      country: 'Canada',
      email: 'test2@example.com',
      gender: 'female',
      name: 'Jane Doe',
      password: 'password456',
      picture: 'base64image2',
      confirmPassword: 'password456',
    };

    act(() => {
      useFormStore.getState().setModalDataByKey('controlled', newFormData);
    });

    const state = useFormStore.getState();
    expect(state.controlledModal.formData).toEqual(newFormData);
    expect(state.uncontrolledModal.formData).not.toEqual(newFormData);
  });

  test('submitForm should update modal data and close modal', () => {
    const formData: FormData = {
      acceptedTerms: true,
      age: 25,
      country: 'USA',
      email: 'test@example.com',
      gender: 'male',
      name: 'John Doe',
      password: 'password123',
      picture: 'base64image',
      confirmPassword: 'password123',
    };

    act(() => {
      useFormStore.getState().openModal('controlled');
      useFormStore.getState().submitForm(formData);
    });

    const state = useFormStore.getState();
    expect(state.controlledModal.formData).toEqual(formData);
    expect(state.openedModalKeys).toEqual([]);
  });

  test('submitForm should do nothing if no modal is open', () => {
    const initialState = useFormStore.getState();
    const formData: FormData = {
      acceptedTerms: true,
      age: 25,
      country: 'USA',
      email: 'test@example.com',
      gender: 'male',
      name: 'John Doe',
      password: 'password123',
      picture: 'base64image',
      confirmPassword: 'password123',
    };

    act(() => {
      useFormStore.getState().submitForm(formData);
    });

    const state = useFormStore.getState();
    expect(state).toEqual(initialState);
  });

  test('should handle multiple modal operations correctly', () => {
    const formData1: FormData = {
      acceptedTerms: true,
      age: 25,
      country: 'USA',
      email: 'test1@example.com',
      gender: 'male',
      name: 'John Doe',
      password: 'password123',
      picture: 'base64image1',
      confirmPassword: 'password123',
    };

    const formData2: FormData = {
      acceptedTerms: false,
      age: 30,
      country: 'Canada',
      email: 'test2@example.com',
      gender: 'female',
      name: 'Jane Doe',
      password: 'password456',
      picture: 'base64image2',
      confirmPassword: 'password456',
    };

    act(() => {
      useFormStore.getState().openModal('uncontrolled');
      useFormStore.getState().setModalDataByKey('uncontrolled', formData1);
      useFormStore.getState().openModal('controlled');
      useFormStore.getState().setModalDataByKey('controlled', formData2);
      useFormStore.getState().closeModal();
      useFormStore.getState().submitForm(formData1);
    });

    const state = useFormStore.getState();
    expect(state.uncontrolledModal.formData).toEqual(formData1);
    expect(state.controlledModal.formData).toEqual(formData2);
    expect(state.openedModalKeys).toEqual([]);
  });
});
