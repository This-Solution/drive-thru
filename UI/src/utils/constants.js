// all constants for the web app
const constants = {
  roleTag: {
    companyAdmin: 1,
    custom: 2,
    messaging: 3,
    reporting: 4,
    standard: 5,
    superAdmin: 6
  },
  unicode: {
    bull: '\u2022',
    dash: '\u2014',
    space: '\u00A0'
  },
  localStorageKey: {
    tokens: 'Tokens'
  },
  webSocketUrl: 'wss://dt1.thissolution.com/ws',
  removeCarTime: 30000,
  defaultErrorMessage: 'Sorry, something went wrong. Please refresh the page or log back in.',
  mimeTypes: {
    pdf: 'application/pdf',
    jpeg: 'image/jpeg',
    xlsx: 'application/excel',
    csv: 'text/csv'
  },
  refTimezones: {
    WA: 'Australia/Perth',
    SA: 'Australia/Adelaide',
    NT: 'Australia/Darwin',
    QLD: 'Australia/Brisbane',
    NSW: 'Australia/Sydney',
    VIC: 'Australia/Melbourne',
    TAS: 'Australia/Hobart',
    ACT: 'Australia/Sydney'
  },
  reloadTime: 1000,
  dateFormat: 'dd/MM/yyyy',
  appName: 'Drive-thru',
  no_image: 'https://stprod0001ts.blob.core.windows.net/cjsales/no-image.jpg',
  comboSizes: [0, 1, 2],
  daysInWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
};

export default constants;
