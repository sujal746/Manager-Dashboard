import { getDatabase, hashPassword, initDatabase, newId, persistDatabase } from './db.js';

const email = String(process.env.MANAGER_EMAIL || '').trim().toLowerCase();
const password = String(process.env.MANAGER_PASSWORD || '');

if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  console.error('Set MANAGER_EMAIL to a valid email address before running this command.');
  process.exit(1);
}
if (password.length < 12 || password.length > 200) {
  console.error('Set MANAGER_PASSWORD to a unique password between 12 and 200 characters.');
  process.exit(1);
}

await initDatabase();
const database = getDatabase();
if (database.users.length > 0) {
  console.error('A Manager account already exists. Initial setup is only available before the first Manager is created.');
  process.exit(1);
}

const manager = {
  id: newId('manager'),
  email,
  passwordHash: hashPassword(password),
  role: 'manager',
  mustChangePassword: false,
  createdAt: new Date().toISOString(),
};

database.users.push(manager);
await persistDatabase();
console.log(`Initial Manager account created for ${email}.`);
