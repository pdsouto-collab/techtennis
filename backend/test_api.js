fetch('https://techtennis-api.vercel.app/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'apitest@techtennis.com', password: '123' })
}).then(res => res.text()).then(text => console.log('Login Response:', text));
