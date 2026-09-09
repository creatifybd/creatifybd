import fs from 'node:fs/promises';
import path from 'node:path';

if (!process.env.RUNNER_TEMP || !process.env.GITHUB_ENV || !process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
  throw new Error('Configure the protected FIREBASE_SERVICE_ACCOUNT_JSON deployment secret before publishing. No Hostinger upload has started.');
}
const account = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
if (account.project_id !== 'creatify-bd') throw new Error('The Firebase credential belongs to a different project.');
const target = path.join(process.env.RUNNER_TEMP, 'creatifybd-firebase.json');
await fs.writeFile(target, JSON.stringify(account), { mode: 0o600 });
await fs.appendFile(process.env.GITHUB_ENV, `GOOGLE_APPLICATION_CREDENTIALS=${target}\n`);
console.log('Protected Firebase credential configured for this deployment job.');
