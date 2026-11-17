import test from 'node:test';
import assert from 'node:assert/strict';
import { canadianRegions, serviceAreaRecords } from '../content/coverage.ts';
import { defaultCoveragePlan, readCoveragePlan, hasCoveragePlan, coverageServices, coverageAccess, coveragePlanQuery, coverageQuoteQuery, coveragePlanContext, coveragePlanMessage, coverageChecklist, coverageAreaIssues, publishedCoverageAreas } from '../lib/coverage.ts';
import { saveQuoteDraft, readQuoteDraft } from '../lib/quote-draft.ts';
import { pages } from '../content/site.ts';

test('geographic selectors cover Canada without claiming local service or adding location routes', () => {
  assert.equal(canadianRegions.length, 13);
  assert.equal(new Set(canadianRegions.map(r => r.code)).size, 13);
  assert.equal(canadianRegions.filter(r => r.kind === 'territory').length, 3);
  for (const region of canadianRegions) for (const lang of ['en', 'fr']) assert.ok(region.name[lang]);
  assert.deepEqual(publishedCoverageAreas(serviceAreaRecords, '2026-11-17'), []);
  assert.equal(pages.filter(page => page.kind === 'coverage').length, 1);
  assert.equal(pages.length * 2, 40);
});

test('coverage handoff accepts only explicit known choices without importing query text', () => {
  assert.deepEqual(readCoveragePlan({}), defaultCoveragePlan);
  for (const key of ['region', 'service', 'access']) for (const value of ['outside', ['ON'], '<script>', 'x'.repeat(10000)]) assert.equal(readCoveragePlan({ [key]: value })[key], defaultCoveragePlan[key]);
  assert.equal(hasCoveragePlan({ region: 'ON' }), false);
  assert.equal(hasCoveragePlan({ coverage: ['project'], region: 'ON' }), false);
  assert.equal(hasCoveragePlan({ coverage: 'project', region: 'INVALID' }), false);
  const plan = readCoveragePlan({ region: 'QC', service: 'assembly', access: 'transfer', name: 'private-name', city: 'private-city', source: 'https://external.test' });
  const query = coverageQuoteQuery(plan, '/en/areas/');
  assert.doesNotMatch(query, /private|external/);
  assert.equal(new URLSearchParams(query).get('source'), '/en/areas/');
  assert.equal(new URLSearchParams(query).get('interest'), 'unsure');
  assert.equal(new URLSearchParams(query).has('use'), false);
  assert.equal(new URLSearchParams(query).has('placement'), false);
});

test('all destination/service/access combinations round-trip and fit the bilingual quote message', () => {
  let count = 0;
  for (const { code } of canadianRegions) for (const service of coverageServices) for (const access of coverageAccess) {
    const plan = { region: code, service, access };
    const query = Object.fromEntries(new URLSearchParams(coveragePlanQuery(plan)));
    assert.equal(hasCoveragePlan(query), true);
    assert.deepEqual(readCoveragePlan(query), plan);
    for (const lang of ['en', 'fr']) {
      const message = coveragePlanMessage(plan, lang);
      assert.ok(message.length < 2000);
      assert.ok(message.includes(`(${code})`));
      assert.doesNotMatch(message, /undefined/);
      assert.equal(coverageChecklist(plan, lang).length, 3);
    }
    count++;
  }
  assert.equal(count, 260);
  assert.match(coverageChecklist({ region: 'NU', service: 'supply', access: 'transfer' }, 'en')[0].detail, /each transport stage/);
  assert.match(coverageChecklist({ region: 'ON', service: 'managed', access: 'seasonal' }, 'en')[0].detail, /seasonal constraints/);
  assert.match(coverageChecklist({ region: 'BC', service: 'supply', access: 'road' }, 'en')[2].detail, /who will arrange assembly/);
});

test('destination drafts survive translation but do not merge different location briefs', () => {
  const values = new Map();
  const storage = { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value), removeItem: key => values.delete(key) };
  const plan = { region: 'QC', service: 'assembly', access: 'restricted' };
  saveQuoteDraft(storage, coveragePlanContext(plan), { message: coveragePlanMessage(plan, 'en') + '\nEdited project note' }, { key: '', fingerprint: '' });
  assert.match(readQuoteDraft(storage, coveragePlanContext(plan)).fields.message, /Edited project note/);
  assert.equal(readQuoteDraft(storage, coveragePlanContext({ ...plan, region: 'ON' })), null);
  assert.equal(readQuoteDraft(storage, coveragePlanContext({ ...plan, access: 'road' })), null);
});

function area(overrides = {}) {
  const copy = { name: 'Example metro', boundary: 'Explicit test boundary', scope: 'Defined assembly tasks', exclusions: 'Specialist connections excluded' };
  return { id: 'example-metro', status: 'published', geography: 'metro', regions: ['ON', 'QC'], services: ['assembly'], copy: { en: copy, fr: { name: 'Région métropolitaine exemple', boundary: 'Limite explicite de test', scope: 'Assemblage défini', exclusions: 'Raccordements exclus' } }, evidence: { reference: 'PRIVATE CONTRACT REFERENCE', verifiedOn: '2026-11-01', validThrough: '2026-12-01', approvedBy: 'PRIVATE REVIEWER', contractorConfirmed: true }, ...overrides };
}
test('public service summaries require current evidence, translated scope and contractor confirmation', () => {
  const today = '2026-11-17';
  assert.deepEqual(coverageAreaIssues(area(), today), []);
  const result = publishedCoverageAreas([area()], today);
  assert.equal(result.length, 1);
  assert.doesNotMatch(JSON.stringify(result), /PRIVATE|evidence|approvedBy/);
  for (const invalid of [
    area({ status: 'draft' }), area({ status: 'archived' }), area({ regions: ['UNKNOWN'] }),
    area({ geography: 'province', regions: ['NU'] }),
    area({ services: [] }), area({ copy: { en: area().copy.en } }),
    area({ evidence: { ...area().evidence, contractorConfirmed: false } }),
    area({ evidence: { ...area().evidence, reference: '' } }),
    area({ evidence: { ...area().evidence, validThrough: '2026-11-16' } }),
    area({ evidence: { ...area().evidence, verifiedOn: '2026-11-18' } }),
    area({ evidence: { ...area().evidence, verifiedOn: '2026-02-30' } }),
  ]) assert.deepEqual(publishedCoverageAreas([invalid], today), []);
  assert.deepEqual(publishedCoverageAreas([area(), area()], today), []);
});
