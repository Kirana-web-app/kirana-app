// Firebase error code to user-friendly message mapping
export const getFirebaseErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case "auth/invalid-credential":
      return "Invalid email or password. Please check your credentials and try again.";
    case "auth/user-not-found":
      return "No account found with this email address.";
    case "auth/wrong-password":
      return "Incorrect password. Please try again.";
    case "auth/invalid-email":
      return "Invalid email address format.";
    case "auth/user-disabled":
      return "This account has been disabled. Please contact support.";
    case "auth/too-many-requests":
      return "Too many failed login attempts. Please try again later.";
    case "auth/network-request-failed":
      return "Network error. Please check your internet connection and try again.";
    case "auth/weak-password":
      return "Password should be at least 6 characters long.";
    case "auth/email-already-in-use":
      return "An account with this email already exists.";
    case "auth/operation-not-allowed":
      return "Email/password accounts are not enabled. Please contact support.";
    case "auth/requires-recent-login":
      return "Please log out and log in again to perform this action.";
    default:
      return "An error occurred during login. Please try again.";
  }
};
