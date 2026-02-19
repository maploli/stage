
import bcrypt from 'bcrypt';

async function generate() {
    try {
        const hash = await bcrypt.hash('live2026', 10);
        console.log(hash);
    } catch (err) {
        console.error(err);
    }
}

generate();
