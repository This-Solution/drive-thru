import FileSaver from 'file-saver';
import { find, last, replace, trim } from 'lodash';
import Resizer from 'react-image-file-resizer';
import dateHelper from './dateHelper';

const { default: constants } = require('./constants');

const removeItemsFromArray = (array, valuesToRemove) => {
  if (!Array.isArray(valuesToRemove)) {
    // if valuesToRemove is not an array, convert it to an array with one element
    valuesToRemove = [valuesToRemove];
  }

  // use set to quickly remove all occurrences of the values to remove
  const valuesSet = new Set(valuesToRemove);
  return array.filter((item) => !valuesSet.has(item));
};

// #region localStorage
const setItemToStorage = (key, value) => {
  localStorage.setItem(key, value);
};

const getItemFromStorage = (key) => {
  const item = localStorage.getItem(key);
  if (item) {
    return item;
  }

  return null;
};

const removeItem = (key) => localStorage.removeItem(key);

const clearLocalStorage = () => localStorage.clear();

const setTokensToStorage = (token) => {
  localStorage.setItem(constants.localStorageKey.tokens, btoa(JSON.stringify(token)));
};

const getTokensFromStorage = () => {
  const item = localStorage.getItem(constants.localStorageKey.tokens);
  if (item) {
    const token = JSON.parse(atob(item));
    return token;
  }

  return null;
};

// #endregion local storage

const downloadFile = async (data, mimeType, fileName) => {
  return fetch(`data:${mimeType};base64,` + data)
    .then(function (resp) {
      return resp.blob();
    })
    .then(function (blob) {
      FileSaver.saveAs(blob, fileName);
    })
    .catch((e) => console.log(e));
};

const getCurrentPrice = (uomPrice) => {
  const itemValue = find(uomPrice, (price) => !price.isDeleted && dateHelper.isAfter(price.startAt) && dateHelper.isBefore(price.endAt));

  return itemValue.price;
};

const formatPath = (value) => {
  return replace(trim(value.replace(/,/g, ' ')), ' ', '-');
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }).format(amount);
};

function formatNumber(number) {
  let formattedNumber = 0.00;
  if (number) {
    formattedNumber = new Intl.NumberFormat('en-AU').format(number);

  }
  return formattedNumber;
}

const resizeFile = (file, width, height) =>
  new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      width,
      height,
      'png',
      100,
      0,
      (uri) => {
        resolve(uri);
      },
      'file'
    );
  });

const generateBlobName = (file, imageId) => {
  const fileName = file.name.split('.');
  const fileExtension = last(fileName);
  const fileNameWithoutExtension = fileName.slice(0, -1).join('.');
  return `${fileNameWithoutExtension}-${imageId}.${fileExtension}`;
};

const handleNumericKey = (event) => {
  if (
    event.ctrlKey ||
    event.metaKey ||
    event.key === 'Tab' ||
    event.key === 'Backspace' ||
    event.key === 'x' ||
    event.key === ' ' ||
    event.key === 'ArrowRight' ||
    event.key === 'ArrowLeft'
  ) {
    return;
  }

  const numericRegex = /^[0-9.,]*$/;
  if (!numericRegex.test(event.key)) {
    event.preventDefault();
  }
};

const extractVersionNumber = (fileName) => {
  // Regular expression to match the version number
  const versionPattern = /-v(\d+)/;
  const match = fileName.match(versionPattern);

  if (match) {
    // Return the version number
    return match[1];
  } else {
    // If no match is found, return null or an appropriate message
    return null;
  }
};

const getFileName = (fileName, existingFileName) => {
  if (existingFileName) {
    if (existingFileName.indexOf(fileName + '.png') >= 0) {
      return fileName + '-v1';
    }
    let versionNumber = extractVersionNumber(existingFileName);
    if (versionNumber > 0) {
      versionNumber++;
      return `${fileName}-v${versionNumber}`;
    }
  }
  return fileName;
};

function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 10) - hash);
  }

  let color = '#';
  for (i = 0; i < 3; i += 1) {
    let value = (hash >> (i * 6)) & 0xff;
    // Increase the value to make it lighter, by scaling it closer to 255
    const lightValue = Math.min(255, Math.floor(value + (255 - value) * 0.3));
    color += lightValue.toString(16).padStart(2, '0');
  }
  /* eslint-enable no-bitwise */
  return color;
}

function isValidIPAddress(ipaddress) {
  if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress)) {
    return (true)
  }
  return (false)
}

function getSwitchUrl(flavour) {
  if (flavour && flavour.apiUrl.includes('uat')) {
    return 'https://uathub.orderkey.com.au';
  }
  else {
    return 'https://hub.orderkey.com.au';
  }
}

export default {
  removeItemsFromArray,
  setItemToStorage,
  getItemFromStorage,
  removeItem,
  setTokensToStorage,
  getTokensFromStorage,
  downloadFile,
  clearLocalStorage,
  getCurrentPrice,
  formatPath,
  formatCurrency,
  formatNumber,
  resizeFile,
  generateBlobName,
  handleNumericKey,
  getFileName,
  stringToColor,
  isValidIPAddress,
  getSwitchUrl
};
