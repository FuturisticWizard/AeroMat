import React from "react";

type CallButtonProps = {
  phoneNumber?: string; // Optional prop for the phone number
};

const CallButton: React.FC<CallButtonProps> = ({
  phoneNumber = "+48780428883",
}) => {
  return (
    <a
      href={`tel:${phoneNumber}`}
      className="fixed bottom-4 right-4 z-[90] bg-green-500 text-white rounded-full p-4 shadow-lg hover:bg-green-600 transition lg:hidden"
      aria-label="Call us"
    >
      Zadzwoń
    </a>
  );
};

export default CallButton;
