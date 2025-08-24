import { useEffect, useState } from 'react';
import UncontrolledForm from './widgets/UncontrolledForm/UncontrolledForm';
import { useFormStore } from './shared/store/useFormStore';
import Modal from './shared/components/Modal/Modal';
import { Button } from './shared/components/Button/Button';
import ControlledForm from './widgets/ControlledForm/ControlledForm';
import DataBox from './shared/components/DataBox/DataBox';
import { formSchema, type FormData } from './shared/validations/validation';

const transformData = (
  data: FormData
): Record<string, string | number | null> => {
  return Object.fromEntries(
    Object.entries(data)
      .filter(
        ([, value]) =>
          typeof value === 'string' ||
          typeof value === 'number' ||
          value === null
      )
      .map(([key, value]) => [key, value as string | number | null])
  );
};

function App() {
  const [isShowUncontrolledFormAnimation, setIsShowUncontrolledFormAnimation] =
    useState(false);

  const [isShowControlledFormAnimation, setIsShowControlledFormAnimation] =
    useState(false);

  const uncontrolledFormData = useFormStore(
    (s) => s.uncontrolledModal.formData
  );

  const controlledFormData = useFormStore((s) => s.controlledModal.formData);

  const openedModalKeys = useFormStore((s) => s.openedModalKeys);
  const openModal = useFormStore((s) => s.openModal);
  const closeModal = useFormStore((s) => s.closeModal);

  const isOpenedUnconterolledModal = openedModalKeys.includes('uncontrolled');
  const isOpenedConterolledModal = openedModalKeys.includes('controlled');

  useEffect(() => {
    if (formSchema.safeParse(uncontrolledFormData).success) {
      setIsShowUncontrolledFormAnimation(true);
      const timeoutId = setTimeout(() => {
        setIsShowUncontrolledFormAnimation(false);
      }, 2000);

      return () => clearTimeout(timeoutId);
    }
  }, [uncontrolledFormData]);

  useEffect(() => {
    if (formSchema.safeParse(controlledFormData).success) {
      setIsShowControlledFormAnimation(true);
      const timeoutId = setTimeout(() => {
        setIsShowControlledFormAnimation(false);
      }, 2000);

      return () => clearTimeout(timeoutId);
    }
  }, [controlledFormData]);

  return (
    <>
      {uncontrolledFormData?.age !== 0 && (
        <DataBox
          data={transformData(uncontrolledFormData as FormData)}
          triggerAnimation={isShowUncontrolledFormAnimation}
        />
      )}

      {controlledFormData?.age !== 0 && (
        <DataBox
          data={transformData(controlledFormData as FormData)}
          triggerAnimation={isShowControlledFormAnimation}
        />
      )}

      <Button onClick={() => openModal('uncontrolled')}>
        Open modal with uncontrolled form
      </Button>

      <Button onClick={() => openModal('controlled')}>
        Open modal with controlled form
      </Button>

      <Modal isOpen={isOpenedUnconterolledModal} onClose={closeModal}>
        <UncontrolledForm />
      </Modal>

      <Modal isOpen={isOpenedConterolledModal} onClose={closeModal}>
        <ControlledForm />
      </Modal>
    </>
  );
}

export default App;
