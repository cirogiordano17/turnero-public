import BookingFlow from "./BookingFlow";

function BookingViewForm({ category, onChangeCategory, onStepChange }) {
  return (
    <BookingFlow
      category={category}
      onBackToCategory={() => onChangeCategory(null)}
      onStepChange={onStepChange}
    />
  );
}

export default BookingViewForm;