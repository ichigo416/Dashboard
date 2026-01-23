const bcrypt = require('bcryptjs');
const crypto = require('crypto');

async function generate(email, password, role) {
  // 🔥 SAME SHA-256 AS FRONTEND
  const sha256 = crypto.createHash('sha256').update(password).digest('hex');

  // 🔥 bcrypt(sha256(password))
  const finalHash = await bcrypt.hash(sha256, 10);

  console.log('\n==============================');
  console.log('EMAIL    :', email);
  console.log('ROLE     :', role);
  console.log('PLAIN    :', password);
  console.log('SHA-256  :', sha256);
  console.log('BCRYPT   :', finalHash);
  console.log('==============================\n');
}

async function run() {
  await generate('pradyu.dp@gmail.com', 'admin123', 'admin');
  await generate('ip832178@gmail.com', 'customer456', 'customer');
}

run();
