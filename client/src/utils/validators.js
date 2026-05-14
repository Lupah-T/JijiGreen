export const isEmail = (value) => /\S+@\S+\.\S+/.test(value);

export const isPositiveNumber = (value) => Number(value) > 0;
