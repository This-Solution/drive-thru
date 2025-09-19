import generateExcel from 'zipcelx';
import 'jspdf-autotable';
import { filter, get, includes, isNil, map } from 'lodash';
import dateHelper from './dateHelper';

const valueTypes = ['string', 'number'];

function getValue(r, c) {
  if (c.valueFn) {
    return c.valueFn(r);
  }

  const value = get(r, c.accessor);
  return value;
}

function getRowData(r, c) {
  const obj = {
    value: getValue(r, c),
    type: c.type
  };

  if (obj.type === 'number' && isNil(obj.value)) {
    obj.value = 0;
  }

  if (obj.type === 'date' && !isNil(obj.value)) {
    obj.value = dateHelper.formatDate(obj.value);
  }

  if (obj.type === 'dateonly' && !isNil(obj.value)) {
    obj.value = dateHelper.formatDate(obj.value);
  }

  if (obj.type === 'datetime' && !isNil(obj.value)) {
    obj.value = dateHelper.formatDate(obj.value);
  }

  if (!includes(valueTypes, obj.type)) {
    obj.type = 'string';
  }

  return obj;
}

function exportExcel(columns, rows, fileName) {
  const filteredColumns = filter(columns, (c) => !c.exclude);
  const headerRow = map(filteredColumns, (c) => ({ value: c.header, type: 'string' }));
  const dataRows = map(rows, (r) => map(filteredColumns, (c) => getRowData(r, c)));

  const config = {
    filename: `${fileName} ${Date.now()}`,
    sheet: {
      data: [headerRow, ...dataRows]
    }
  };

  return generateExcel(config);
}

const ExcelHelper = {
  exportExcel
};

export default ExcelHelper;
