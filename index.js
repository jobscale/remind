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

  async start() {
    const rows = remind.filter(list);
    if (!rows.length) return;
    const store = {};
    for (const row of rows) {
      if (!store.first) store.first = true;
      else await new Promise(resolve => { setTimeout(resolve, 10000); });
      await this.post(row);
    }
  }
}

new App().start()
.catch(e => logger.error(e));
