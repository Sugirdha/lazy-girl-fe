import { Button } from "./Button";

type ConfirmationModalProps = {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isConfirming?: boolean;
};

export function ConfirmationModal({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  isConfirming = false,
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
        <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        
        <div className="flex justify-end space-x-3">
          <Button
            variant="secondary"
            onClick={onCancel}
            disabled={isConfirming}
          >
            {cancelText}
          </Button>
          <Button
            variant="danger"
            onClick={onConfirm}
            isLoading={isConfirming}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}