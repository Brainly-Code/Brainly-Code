import { useEffect } from "react";

export function useNotification() {
  // Request notification permission
  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  const sendNotification = (title, options) => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(title, options);
    }
  };

  return sendNotification;
}
