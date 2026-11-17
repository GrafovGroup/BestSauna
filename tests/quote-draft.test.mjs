import test from 'node:test';
import assert from 'node:assert/strict';
import { clearQuoteDraft, quoteFieldLimits, QUOTE_DRAFT_KEY, QUOTE_DRAFT_TTL, readQuoteDraft, saveQuoteDraft } from '../lib/quote-draft.ts';
import { commercialFieldLimits } from '../lib/commercial-brief.ts';

function memoryStorage() {
  const values = new Map();
  return { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value), removeItem: key => values.delete(key) };
}
const fields = { ...Object.fromEntries(Object.keys(quoteFieldLimits).map(key => [key, ''])), name: 'Test visitor', message: 'Projet de sauna — accès au chalet', contactMethod: 'email' };
const attempt = { fingerprint: 'a'.repeat(64), key: '37f7566d-c741-4434-8ed9-1d80ebeb7af4' };
const context = '["cottage","assembly","cottage","outdoor","unsure"]';
const now = 10000000;

test('commercial drafts survive language changes and legacy drafts retain their notes', () => {
  const storage = memoryStorage();
  const commercial = { ...fields, intendedUse: 'commercial', commercialFacility: 'hotel', commercialStage: 'replacement', commercialHours: '7 h à 21 h', commercialDetails: 'Anciennes notes conservées' };
  saveQuoteDraft(storage, context, commercial, attempt, now);
  assert.deepEqual(readQuoteDraft(storage, context, now + 1).fields, commercial);
  const old = JSON.parse(storage.getItem(QUOTE_DRAFT_KEY));
  for (const key of Object.keys(commercialFieldLimits)) delete old.fields[key];
  storage.setItem(QUOTE_DRAFT_KEY, JSON.stringify(old));
  const restored = readQuoteDraft(storage, context, now + 1);
  assert.equal(restored.fields.commercialDetails, commercial.commercialDetails);
  assert.equal(restored.fields.commercialFacility, '');
  assert.equal(restored.fields.name, commercial.name);
});

test('a tab draft restores bilingual text and the retry identity, excluding consent and hidden data', () => {
  const storage = memoryStorage();
  assert.equal(saveQuoteDraft(storage, context, { ...fields, website: 'spam', privacyAccepted: 'true', unexpected: 'private' }, attempt, now), true);
  const draft = readQuoteDraft(storage, context, now + 100);
  assert.deepEqual(draft.fields, fields);
  assert.deepEqual(draft.attempt, attempt);
  assert.equal(storage.getItem(QUOTE_DRAFT_KEY).includes('privacyAccepted'), false);
  assert.equal(storage.getItem(QUOTE_DRAFT_KEY).includes('website'), false);
  clearQuoteDraft(storage);
  assert.equal(readQuoteDraft(storage, context, now + 101), null);
});

test('drafts expire at 30 minutes and are physically removed on access', () => {
  const storage = memoryStorage();
  saveQuoteDraft(storage, context, fields, attempt, now);
  assert.ok(readQuoteDraft(storage, context, now + QUOTE_DRAFT_TTL - 1));
  assert.equal(readQuoteDraft(storage, context, now + QUOTE_DRAFT_TTL), null);
  assert.equal(storage.getItem(QUOTE_DRAFT_KEY), null);
});

test('a new project context does not inherit another brief', () => {
  const storage = memoryStorage();
  saveQuoteDraft(storage, context, fields, attempt, now);
  assert.equal(readQuoteDraft(storage, '["commercial"]', now + 1), null);
  assert.ok(readQuoteDraft(storage, context, now + 1));
});

test('corrupt, future-dated and oversized stored data cannot break the form', () => {
  const storage = memoryStorage();
  for (const corrupt of ['{broken', 'null', JSON.stringify({ version: 99 }), JSON.stringify({ version: 1, context, savedAt: now + 1, fields, attempt }), JSON.stringify({ version: 1, context, savedAt: now, fields: { ...fields, name: 'x'.repeat(121) }, attempt })]) {
    storage.setItem(QUOTE_DRAFT_KEY, corrupt);
    assert.equal(readQuoteDraft(storage, context, now), null);
    assert.equal(storage.getItem(QUOTE_DRAFT_KEY), null);
  }
});

test('blocked storage degrades without throwing; invalid retry keys are discarded', () => {
  const blocked = { getItem() { throw new Error('blocked'); }, setItem() { throw new Error('quota'); }, removeItem() { throw new Error('blocked'); } };
  assert.equal(readQuoteDraft(blocked, context, now), null);
  assert.equal(saveQuoteDraft(blocked, context, fields, attempt, now), false);
  assert.doesNotThrow(() => clearQuoteDraft(blocked));
  const storage = memoryStorage();
  saveQuoteDraft(storage, context, fields, { fingerprint: 'not-a-hash', key: 'invalid' }, now);
  assert.deepEqual(readQuoteDraft(storage, context, now).attempt, { fingerprint: '', key: '' });
});
