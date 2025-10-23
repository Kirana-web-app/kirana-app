import CryptoJS from "crypto-js";

// Store this key securely — not in public code.
// For a small project, you can keep it in an environment variable.
const SECRET_KEY = process.env.NEXT_PUBLIC_MESSAGE_KEY || "my-simple-secret";

export const encryptMessage = (text: string): string => {
  return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
};

export const decryptMessage = (cipherText: string): string => {
  try {
    const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch {
    return "";
  }
};
