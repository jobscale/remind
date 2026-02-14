import dayjs from 'dayjs';

const isNow = ts => ts > dayjs().subtract(30, 'second') && ts <= dayjs().add(30, 'second');

export class Remind {
  filter(list) {
    return list.filter(item => isNow(dayjs(item.schedule)))
    .map(item => {
      if (item.link) {
        item.text = item.text
        .split('\n').filter(v => v.trim()).map(v => `<${item.link}|${v}>`);
      }
      return item;
    });
  }
}

export const remind = new Remind();
export default { Remind, remind };
