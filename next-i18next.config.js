const path = require('path');

module.exports = {
  i18n: {
    locales: ['en', 'zh-TW'],
    defaultLocale: 'zh-TW',
  },
  localePath: path.resolve('./public/locales'),
  ns: ['common', 'indexPage', 'aichat'],
  defaultNS: 'common',
};
