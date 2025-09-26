#!/usr/bin/env node

/**
 * Generate secure secrets for production deployment
 * Usage: node scripts/generate-secrets.js
 */

const crypto = require('crypto')

function generateSecret(length = 32) {
  return crypto.randomBytes(length).toString('base64url')
}

function generateSecrets() {
  console.log('🔐 Better Menu - Production Secrets Generator')
  console.log('=' .repeat(50))
  console.log('')
  
  console.log('Copy these values to your production environment variables:')
  console.log('')
  
  // Generate NextAuth secret
  const nextAuthSecret = generateSecret(32)
  console.log(`NEXTAUTH_SECRET=${nextAuthSecret}`)
  console.log('')
  
  // Additional secrets if needed
  console.log('Additional secure tokens (if needed):')
  console.log(`API_SECRET_KEY=${generateSecret(24)}`)
  console.log(`SESSION_SECRET=${generateSecret(16)}`)
  console.log(`WEBHOOK_SECRET=${generateSecret(20)}`)
  console.log('')
  
  console.log('🚨 Important Security Notes:')
  console.log('• Never commit these secrets to version control')
  console.log('• Use different secrets for each environment (dev/staging/prod)')
  console.log('• Store secrets securely in your deployment platform')
  console.log('• Rotate secrets regularly for enhanced security')
  console.log('')
  
  console.log('✅ Ready for production deployment!')
}

// Run the generator
generateSecrets()