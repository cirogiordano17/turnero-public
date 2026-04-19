import BookingFlow from "./BookingFlow";

function BookingViewForm({ category, onChangeCategory }) {
  return <BookingFlow category={category} onBackToCategory={() => onChangeCategory(null)} />;
}

export default BookingViewForm;