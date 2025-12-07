export const sanitizeText = (v: string) => v.trim().replace(/\s+/g, " ");

export const isValidEmail = (v: string) => /.+@.+\..+/.test(v);

export const isValidPhone = (v: string) => {
  const digits = v.replace(/\D/g, "");
  return digits.length >= 10;
};

export const isStrongPassword = (v: string) => /^(?=.*[A-Za-z])(?=.*\d).{6,}$/.test(v);
