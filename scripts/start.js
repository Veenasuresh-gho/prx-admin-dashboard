import dotenv  from 'dotenv';
import { execSync } from 'child_process';

dotenv.config({ path: '.env' });

const port = process.env.PORT || '3000'

execSync(`astro preview --port ${port}`, { stdio: 'inherit' });
