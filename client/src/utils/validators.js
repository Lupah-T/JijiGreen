export const isEmail = (value) => /^\S+@\S+\.\S+$/.test(String(value).trim());

export const isPositiveNumber = (value) => Number(value) > 0;

export const CHILD_AGE_LIMIT = 16;
export const ageGroupFor = (age) => (Number(age) < CHILD_AGE_LIMIT ? "child" : "adult");

export const validateRegisterForm = ({ name = "", email = "", password = "", age = "" }) => {
  const errors = {};
  const trimmedName = name.trim();
  const trimmedEmail = email.trim();

  if (!trimmedName) {
    errors.name = "Name is required";
  } else if (trimmedName.length < 2) {
    errors.name = "Name must be at least 2 characters";
  }

  if (!trimmedEmail) {
    errors.email = "Email is required";
  } else if (!isEmail(trimmedEmail)) {
    errors.email = "Invalid email format";
  }

  const ageNum = Number(age);
  if (age === "" || age === null || age === undefined) {
    errors.age = "Age is required";
  } else if (!Number.isInteger(ageNum) || ageNum < 4 || ageNum > 120) {
    errors.age = "Enter a valid age between 4 and 120";
  }

  if (!password) {
    errors.password = "Password is required";
  } else if (password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  } else if (!/[A-Z]/.test(password)) {
    errors.password = "Password must include at least one uppercase letter";
  } else if (!/[a-z]/.test(password)) {
    errors.password = "Password must include at least one lowercase letter";
  } else if (!/\d/.test(password)) {
    errors.password = "Password must include at least one number";
  }

  return errors;
};

export const validateLoginForm = ({ email = "", password = "" }) => {
  const errors = {};
  const trimmedEmail = email.trim();

  if (!trimmedEmail) {
    errors.email = "Email is required";
  } else if (!isEmail(trimmedEmail)) {
    errors.email = "Invalid email format";
  }

  if (!password) {
    errors.password = "Password is required";
  }

  return errors;
};
