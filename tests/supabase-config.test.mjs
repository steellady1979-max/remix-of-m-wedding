import assert from 'node:assert/strict';
import { test } from 'node:test';
import { validateSupabaseConfig } from '../src/integrations/supabase/config.ts';

const jwt = (payload) => `header.${Buffer.from(JSON.stringify(payload)).toString('base64url')}.signature`;
const url = 'https://example-project.supabase.co';

test('missing environment never falls back to a template database', () => {
  assert.throws(() => validateSupabaseConfig(), /VITE_SUPABASE_URL/);
  assert.throws(() => validateSupabaseConfig(url), /VITE_SUPABASE_ANON_KEY/);
});
test('accepts public keys and normalizes the base URL', () => {
  assert.deepEqual(validateSupabaseConfig(`${url}/`, ' sb_publishable_example '), { url, key: 'sb_publishable_example' });
  assert.equal(validateSupabaseConfig(url, jwt({ role: 'anon', ref: 'example-project' })).url, url);
});
test('rejects privileged keys and mismatched JWT project references', () => {
  assert.throws(() => validateSupabaseConfig(url, 'sb_secret_example'));
  assert.throws(() => validateSupabaseConfig(url, jwt({ role: 'service_role' })), /public/);
  assert.throws(() => validateSupabaseConfig(url, jwt({ role: 'anon', ref: 'other-project' })), /different projects/);
});
test('rejects endpoint paths and embedded credentials', () => {
  assert.throws(() => validateSupabaseConfig(`${url}/rest/v1`, 'sb_publishable_example'), /base URL/);
  assert.throws(() => validateSupabaseConfig('https://user:password@example.com', 'sb_publishable_example'), /base URL/);
});
