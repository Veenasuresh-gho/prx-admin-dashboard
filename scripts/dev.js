import { config } from 'dotenv';
import { execSync } from 'child_process';

config({ path: '.env' });

const port = process.env.PORT || '3001'

execSync(`astro dev --port ${port}`, { stdio: 'inherit' });
