import axios from "axios";

interface BackendErrorResponse {
  message?: string;
  error?: string;
}

export function getErrorMessage(
  error: unknown,
  fallbackMessage = "Bir hata oluştu."
): string {
  if (axios.isAxiosError<BackendErrorResponse>(error)) {
    const backendMessage = error.response?.data?.message;

    if (backendMessage) {
      return backendMessage;
    }

    const backendError = error.response?.data?.error;

    if (backendError) {
      return backendError;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallbackMessage;
}