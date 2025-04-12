export const handleAuthError = (error) => {
  let errorMessage;

  switch (error.code) {
    case "auth/invalid-email":
      errorMessage = "The email address is badly formatted.";

      break;

    case "auth/user-disabled":
      errorMessage = "This user account has been disabled by an administrator.";

      break;

    case "auth/user-not-found":
      errorMessage = "No user found with this email address.";

      break;

    case "auth/wrong-password":
      errorMessage = "The password you entered is incorrect.";

      break;

    case "auth/email-already-in-use":
      errorMessage = "This email address is already in use by another account.";

      break;

    case "auth/invalid-credential":
      errorMessage =
        "The credential you provided is invalid, expired or does'nt exist. Please try again.";

      break;

    case "auth/weak-password":
      errorMessage =
        "The password is too weak. Please enter a stronger password.";

      break;

    case "auth/operation-not-allowed":
      errorMessage =
        "This type of account is not enabled. Contact support for more information.";

      break;

    case "auth/requires-recent-login":
      errorMessage = "Please log in again to perform this action.";

      break;

    case "auth/network-request-failed":
      errorMessage =
        "A network error occurred. Please check your connection and try again.";

      break;

    case "auth/too-many-requests":
      errorMessage = "Too many login attempts. Please try again later.";

      break;

    // case "auth/popup-closed-by-user":
    //
    //     "The sign-in popup was closed before completing the sign-in process."
    //   );

    //   break;

    case "auth/captcha-check-failed":
      errorMessage = "The reCAPTCHA verification failed. Please try again.";

      break;

    case "auth/multi-factor-auth-required":
      errorMessage =
        "Multi-factor authentication is required. Please complete the second factor to log in.";

      break;

    default:
      errorMessage = "An unknown error occurred. Please try again later.";
  }

  //   setError(errorMessage);

  return errorMessage;
};
