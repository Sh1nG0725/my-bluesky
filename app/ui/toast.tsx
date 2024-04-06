import { ToastContainer } from "react-toastify";

/**
 * 共通トースト
 * @returns トースト
 */
export function Toast() {
  return (
    <ToastContainer
      position="top-center"
      autoClose={2000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="colored"
    />
  );
}
