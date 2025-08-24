import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Modal from './Modal';

jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  createPortal: (node: React.ReactNode) => node,
}));

jest.mock('./Modal.module.css', () => ({
  overlay: 'overlay-class',
  modal: 'modal-class',
  close: 'close-class',
  content: 'content-class',
  footer: 'footer-class',
}));

describe('Modal Component', () => {
  const testId = 'test-modal';
  const modalContent = 'Modal content';

  test('renders modal when isOpen is true', () => {
    render(
      <Modal isOpen={true} testId={testId}>
        {modalContent}
      </Modal>
    );

    const overlay = screen.getByTestId(testId);
    const modal = screen.getByTestId(`${testId}-modal`);
    const content = screen.getByTestId(`${testId}-content`);
    const closeButton = screen.getByTestId(`${testId}-close`);

    expect(overlay).toBeInTheDocument();
    expect(modal).toBeInTheDocument();
    expect(content).toBeInTheDocument();
    expect(closeButton).toBeInTheDocument();
    expect(content).toHaveTextContent(modalContent);
  });

  test('does not render modal when isOpen is false', () => {
    render(
      <Modal isOpen={false} testId={testId}>
        {modalContent}
      </Modal>
    );

    expect(screen.queryByTestId(testId)).not.toBeInTheDocument();
  });

  test('calls onClose when overlay is clicked', () => {
    const handleClose = jest.fn();
    render(
      <Modal isOpen={true} testId={testId} onClose={handleClose}>
        {modalContent}
      </Modal>
    );

    const overlay = screen.getByTestId(testId);
    fireEvent.click(overlay);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  test('calls onClose when close button is clicked', () => {
    const handleClose = jest.fn();
    render(
      <Modal isOpen={true} testId={testId} onClose={handleClose}>
        {modalContent}
      </Modal>
    );

    const closeButton = screen.getByTestId(`${testId}-close`);
    fireEvent.click(closeButton);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  test('calls onClose when Escape key is pressed', () => {
    const handleClose = jest.fn();
    render(
      <Modal isOpen={true} testId={testId} onClose={handleClose}>
        {modalContent}
      </Modal>
    );

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  test('renders actions when provided', () => {
    const actions = <button>Action</button>;
    render(
      <Modal isOpen={true} testId={testId} actions={actions}>
        {modalContent}
      </Modal>
    );

    const footer = screen.getByTestId(`${testId}-actions`);
    expect(footer).toBeInTheDocument();
    expect(footer).toContainElement(screen.getByRole('button'));
  });

  test('manages focus trap elements correctly', () => {
    const { container } = render(
      <Modal isOpen={true} testId={testId}>
        <button>First</button>
        <button>Second</button>
      </Modal>
    );

    const firstButton = screen.getByText('First');
    const secondButton = screen.getByText('Second');
    const closeButton = screen.getByTestId(`${testId}-close`);

    expect(firstButton).toBeInTheDocument();
    expect(secondButton).toBeInTheDocument();
    expect(closeButton).toBeInTheDocument();

    const focusableElements = container.querySelectorAll(
      'button, [tabindex="0"]'
    );
    expect(focusableElements.length).toBeGreaterThan(0);
  });

  test('prevents event propagation when clicking inside modal', () => {
    const handleClose = jest.fn();
    render(
      <Modal isOpen={true} testId={testId} onClose={handleClose}>
        <button data-testid="inner-button">Click me</button>
      </Modal>
    );

    const innerButton = screen.getByTestId('inner-button');
    fireEvent.click(innerButton);
    expect(handleClose).not.toHaveBeenCalled();
  });

  test('creates portal and renders modal content', () => {
    render(
      <Modal isOpen={true} testId={testId}>
        {modalContent}
      </Modal>
    );

    const overlay = screen.getByTestId(testId);
    expect(overlay).toBeInTheDocument();
    expect(overlay).toContainElement(screen.getByText(modalContent));
  });

  test('has correct ARIA attributes', () => {
    render(
      <Modal isOpen={true} testId={testId}>
        {modalContent}
      </Modal>
    );

    const overlay = screen.getByTestId(testId);
    expect(overlay).toHaveAttribute('role', 'dialog');
  });

  test('sets body overflow to hidden when opened', () => {
    const { unmount } = render(
      <Modal isOpen={true} testId={testId}>
        {modalContent}
      </Modal>
    );

    expect(document.body.style.overflow).toBe('hidden');
    unmount();
  });

  test('applies correct CSS classes', () => {
    render(
      <Modal isOpen={true} testId={testId}>
        {modalContent}
      </Modal>
    );

    const overlay = screen.getByTestId(testId);
    const modal = screen.getByTestId(`${testId}-modal`);
    const closeButton = screen.getByTestId(`${testId}-close`);
    const content = screen.getByTestId(`${testId}-content`);

    expect(overlay).toHaveClass('overlay-class');
    expect(modal).toHaveClass('modal-class');
    expect(closeButton).toHaveClass('close-class');
    expect(content).toHaveClass('content-class');
  });
});
