import bcrypt from 'bcrypt';
const pass = 'admin123';
const hash = await bcrypt.hash(pass, 10);
console.log(hash);
