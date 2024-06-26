const dayjs = require('dayjs');

const isNow = ts => ts > dayjs().subtract(30, 'second') && ts <= dayjs().add(30, 'second');

class App {
  filter(list) {
    return list.filter(item => isNow(dayjs(item.schedule)))
    .map(item => {
      if (item.url) item.text += `\n<${item.url}|${item.text}>`;
      return item;
    });
  }
}

module.exports = {
  App,
  app: new App(),
};
