import { size } from 'lodash';

function isNumber(value) {
  return new RegExp('^(?=.*[0-9]).+$').test(value);
}

function isLowercaseChar(value) {
  return new RegExp('^(?=.*[a-z]).+$').test(value);
}

function isUppercaseChar(value) {
  return new RegExp('^(?=.*[A-Z]).+$').test(value);
}

function isSpecialChar(value) {
  return new RegExp('^(?=.*[-+_!@#$%^&*.,?]).+$').test(value);
}

function minLength(value) {
  return value.length > 7;
}

function isValidPassword(password) {
  let mandatoryCount = 0;
  let optionalCount = 0;
  const passwordSize = size(password);

  if (passwordSize >= 6 && passwordSize <= 50) {
    mandatoryCount++;
  }
  if (isLowercaseChar(password)) {
    // Check password contains a small letter.
    mandatoryCount++;
  }
  if (isUppercaseChar(password)) {
    // Check password contains a capital letter.
    mandatoryCount++;
  }

  if (isNumber(password)) {
    // Check password contains a number.
    optionalCount++;
  }
  if (isSpecialChar(password)) {
    // Check password contains a special character.
    optionalCount++;
  }
  return mandatoryCount === 3 && optionalCount >= 1;
}

export { isNumber, isLowercaseChar, isUppercaseChar, isSpecialChar, minLength, isValidPassword };
