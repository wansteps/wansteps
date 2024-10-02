// checks if a password has at least one uppercase letter and a number or special character
export const PASSWORD_REGEX =
    /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;
