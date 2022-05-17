import { useCallback, useState } from "react";

const useModal = (defaultValue: boolean = false) => {
  const [isModalOpen, setIsModalOpen] = useState(defaultValue);

  const openModal = useCallback(() => {
    setIsModalOpen(true);
  }, [setIsModalOpen]);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, [setIsModalOpen]);

  const toggleModal = useCallback(
    (value: boolean) => {
      setIsModalOpen(value !== undefined ? value : !isModalOpen);
    },
    [isModalOpen]
  );

  return { isModalOpen, toggleModal, openModal, closeModal };
};

export default useModal;
