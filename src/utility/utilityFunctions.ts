import * as messages from '../messages/message.json';

// Email validation
export const validateEmail = (email: string): boolean => {
  const regex =
    /^[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

  if (!email) return false;
  const emailParts = email.split('@');

  if (emailParts.length !== 2) return false;

  const [account, address] = emailParts;

  if (account.length > 64) return false;
  else if (address.length > 255) return false;

  const domainParts = address.split('.');

  if (domainParts.some((part) => part.length > 63)) return false;

  return regex.test(email);
};

// Password validation
export const passwordValidation = (password: string): boolean => {
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,}$/;

  return passwordRegex.test(password);
};

// Return message function
export const returnMessage = (module: string, key: string) => {
  return messages[module][key];
};
