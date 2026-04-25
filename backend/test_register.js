const http = require('http');

async function ex() {
  try {
    const fetch = (await import('node-fetch')).default || globalThis.fetch;
    const res = await fetch('https://techtennisbr.com/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Ernesto Mori Test',
        email: 'ernestomori@gmail.com',
        password: '123',
        phone: '+5511971100706',
        role: 'ADMIN' // or 'Administrador'
      })
    });
    console.log('Status:', res.status);
    const body = await res.text();
    console.log('Body:', body);
  } catch(e) {
    console.error(e);
  }
}
ex();
