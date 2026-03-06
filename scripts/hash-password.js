#!/usr/bin/env node

/**
 * Script untuk generate hashed admin password
 * Usage: node scripts/hash-password.js <password>
 * atau: npm run hash-password -- <password>
 */

import { hash } from 'bcryptjs';

const password = process.argv[2];

if (!password) {
  console.error('❌ Error: Password tidak diberikan');
  console.log('Usage: node scripts/hash-password.js <password>');
  console.log('atau: npm run hash-password -- <password>');
  process.exit(1);
}

if (password.length < 8) {
  console.error('❌ Error: Password harus minimal 8 karakter');
  process.exit(1);
}

async function generateHash() {
  try {
    console.log('🔄 Generating hash, please wait...');
    const hashedPassword = await hash(password, 12);
    
    console.log('\n✅ Hash generated successfully!\n');
    console.log('Copy this hash into your .env file:');
    console.log('─'.repeat(60));
    console.log(hashedPassword);
    console.log('─'.repeat(60));
    console.log('\nSet it as ADMIN_PASSWORD_HASH in your .env file');
  } catch (error) {
    console.error('❌ Error generating hash:', error);
    process.exit(1);
  }
}

generateHash();
