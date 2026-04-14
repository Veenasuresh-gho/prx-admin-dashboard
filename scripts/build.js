import dotenv  from 'dotenv';
import { execSync } from 'child_process';

dotenv.config({ path: '../.env' });

execSync('astro build', { stdio: 'inherit' });
