// emailValidator.ts
export const validateEmail = (email: string): boolean => {
  // email validator from https://github.com/manishsaraan/email-validator/blob/master/index.js
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

export const passwordValidation = (password: string): boolean => {
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,}$/;

  return passwordRegex.test(password);
};
