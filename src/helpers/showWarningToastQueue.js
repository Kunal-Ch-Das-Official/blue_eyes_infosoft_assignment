import { toast } from "react-toastify";
import React from "react";

const showWarningToastQueue = async (messages) => {
  for (const message of messages) {
    toast.warning(
      React.createElement(
        "div",
        null,
        React.createElement(
          "strong",
          { className: "text-amber-600" },
          "Warning!",
        ),
        React.createElement(
          "p",
          { className: "text-xs text-gray-800" },
          message,
        ),
      ),
    );

    await new Promise((resolve) => setTimeout(resolve, 500));
  }
};

export default showWarningToastQueue;
