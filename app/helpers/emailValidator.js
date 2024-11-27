export function emailValidator(email) {
  // Correct regular expression for email validation
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
  if (!email) return "Please fill in this field.";  // Check if the email is empty
  if (!re.test(email)) return 'Please enter a valid email address!';  // Check if the email is valid
  
  return '';  // Return an empty string if the email is valid
}
