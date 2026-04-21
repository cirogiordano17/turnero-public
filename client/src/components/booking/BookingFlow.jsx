import { useEffect, useState } from "react";
import useBooking from "../../hooks/useBooking";
import ServicesStep from "./steps/ServicesStep";
import ScheduleStep from "./steps/ScheduleStep";
import ConfirmStep from "./steps/ConfirmStep";
import { AnimatePresence, motion } from "motion/react";

function BookingFlow({ category, onBackToCategory, onStepChange }) {
  const [step, setStep] = useState(1);
  const booking = useBooking({ category });

  useEffect(() => {
    onStepChange?.(step);
  }, [step, onStepChange]);

  const goNextFromServices = () => {
    if (!booking.selectedIds.length) return;
    setStep(2);
  };

  const goNextFromSchedule = () => {
    if (!booking.selectedDate || !booking.selectedSlot) return;
    setStep(3);
  };

  const goBack = () => {
    if (step === 1) {
      onBackToCategory?.();
      return;
    }

    setStep((prev) => Math.max(1, prev - 1));
  };

  const handleRestartBooking = () => {
    booking.resetBooking();
    setStep(1);
  };

  return (
    <div className="booking-flow">
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key={`step-1-${category}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <ServicesStep
              category={category}
              booking={booking}
              onNext={goNextFromServices}
              onBack={goBack}
            />
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key={`step-2-${category}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <ScheduleStep
              booking={booking}
              onBack={goBack}
              onNext={goNextFromSchedule}
            />
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key={`step-3-${category}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <ConfirmStep
              category={category}
              booking={booking}
              onBack={goBack}
              onRestart={handleRestartBooking}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default BookingFlow;