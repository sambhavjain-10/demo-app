export type BulkFeedbackOverlayProps = {
  selectedCount: number;
  feedback: string;
  onFeedbackChange: (feedback: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  maxSelections?: number;
};
