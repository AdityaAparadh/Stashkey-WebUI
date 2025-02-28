import axios from "axios";

export const handleError = (
  err: unknown,
  setStatus: (status: string) => void,
) => {
  console.error("Error:", err);

  if (axios.isAxiosError(err) && err.response) {
    switch (err.response.status) {
      case 400:
        if (err.response.data == "Turnstile verification failed") {
          setStatus("Capcha verification failed. Please try again");
          break;
        }
        setStatus("Bad Request. Please check your input");
        break;
      case 401:
        setStatus("Invalid credentials. Please try again");
        break;
      case 404:
        setStatus("User not found");
        break;
      case 409:
        setStatus("Username already taken");
        break;
      case 429:
        setStatus("Too many requests. Please try again later");
        break;
      case 500:
        setStatus("Internal Server Error. Please try again later");
        break;
      default:
        setStatus("An unexpected error occurred");
    }
  } else {
    setStatus("An unknown error occurred");
  }
};
