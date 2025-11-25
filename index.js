import dayjs from 'dayjs';
import { logger } from '@jobscale/logger';
import { remind } from './app/index.js';
import { list } from './app/list.js';

class App {
  postSlack(body) {
    const url = 'https://jsx.jp/api/slack';
    const options = {
      url,
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    };
    return fetch(url, options);
  }

  sendEmail(body) {
    const url = 'https://jsx.jp/api/email';
    const options = {
      url,
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    };
    return fetch(url, options);
  }

  async post(row) {
    await this.sendEmail({
      subject: `Remind - ${row.title}`,
      text: row.text,
    });
    await this.postSlack({
      channel: '#push',
      icon_emoji: ':alarm_clock:',
      username: `Remind - ${row.title}`,
      text: row.text,
    });
  }

  async execute(rowsList) {
    const rows = rowsList.flat();
    if (!rows.length) return;
    const opts = {};
    for (const row of rows) {
      if (!opts.first) opts.first = true;
      else await new Promise(resolve => { setTimeout(resolve, 10000); });
      await this.post(row);
    }
  }

  async start() {
    const rows = remind.filter(list);
    await this.execute(rows);
    if (Math.floor((dayjs().unix() / 60) % 3)) return;
    const renders = [
      'https://jsx.jp',
      'https://sshwifty.jsx.jp',
      'https://wiki.jsx.jp/doku.php',
      'https://zipcode.jsx.jp',
      'https://todo.jsx.jp',
      'https://mqtt.jsx.jp',
    ];
    await Promise.all(renders.map(
      url => fetch(url).then(res => logger.info({ status: res.status, url }))
      .catch(e => logger.error({ message: e.message, url })),
    ));
  }
}

new App().start()
.catch(e => logger.error(e));
