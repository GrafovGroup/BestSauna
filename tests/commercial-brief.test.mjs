import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeCommercialBrief, commercialSubmissionFields } from '../lib/commercial-brief.ts';

test('commercial choices and free text produce a localized brief without unknown input', () => {
  const input = { commercialFacility: 'hotel', commercialStage: 'replacement', commercialHours: ' 7 h–21 h ', commercialEquipment: 'Modèle à confirmer', commercialDetails: 'Documents de remise', injected: 'UNEXPECTED' };
  const fr = normalizeCommercialBrief(input, 'fr');
  assert.deepEqual(fr.errors, {});
  assert.match(fr.text, /Type d’établissement: Hôtel/);
  assert.match(fr.text, /Type de projet: Remplacement/);
  assert.match(fr.text, /Heures d’utilisation prévues: 7 h–21 h/);
  assert.match(fr.text, /Exigences du projet: Documents de remise/);
  assert.equal(fr.text.includes('UNEXPECTED'), false);
  assert.match(normalizeCommercialBrief(input, 'en').text, /Facility type: Hotel/);
});

test('commercial schema rejects invalid choices, types, control characters and oversized fields', () => {
  const valid = { commercialFacility: 'unsure', commercialStage: 'exploring' };
  assert.deepEqual(normalizeCommercialBrief(valid, 'en').errors, {});
  for (const [field, value, error] of [
    ['commercialFacility', '', 'required'], ['commercialFacility', 'unapproved', 'invalid'],
    ['commercialStage', [], 'invalid'], ['commercialUsage', {}, 'invalid'],
    ['commercialHours', 'x'.repeat(121), 'too_long'], ['commercialEquipment', 'x\u0000', 'invalid'],
    ['commercialProcurement', 'x'.repeat(201), 'too_long'], ['commercialDetails', 'x'.repeat(1501), 'too_long'],
  ]) assert.equal(normalizeCommercialBrief({ ...valid, [field]: value }, 'fr').errors[field], error);
});

test('changing to a residential enquiry removes every commercial field from the submission', () => {
  const fields = { intendedUse: 'commercial', commercialFacility: 'hotel', commercialStage: 'new', commercialUsage: 'Guest use', commercialHours: 'Daily', commercialEquipment: 'Existing unit', commercialProcurement: 'Project manager', commercialDetails: 'Requirements' };
  assert.equal(commercialSubmissionFields(fields).commercialUsage, 'Guest use');
  const home = commercialSubmissionFields({ ...fields, intendedUse: 'home' });
  assert.ok(Object.values(home).every(value => value === ''));
  assert.equal(Object.keys(home).length, 7);
});
