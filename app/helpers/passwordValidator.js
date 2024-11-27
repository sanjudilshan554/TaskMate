export function passwordValidator(password) {
  if (!password) return "Please fill in this field.";
  if (password.length < 8) return "Password should contain at least 8 characters.";
  if (!/[A-Z]/.test(password)) return "Password should contain at least one uppercase letter.";
  if (!/[a-z]/.test(password)) return "Password should contain at least one lowercase letter.";
  if (!/[0-9]/.test(password)) return "Password should contain at least one number.";
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return "Password should contain at least one special character.";
  return "";
}
