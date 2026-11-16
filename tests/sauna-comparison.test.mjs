import test from 'node:test';
import assert from 'node:assert/strict';
import { comparisonApproaches, comparisonPairs, comparisonQuery, comparisonQuoteQuery, projectUses, readComparison, serviceScopes } from '../lib/sauna-comparison.ts';

test('comparison links accept only known choices, including repeated and malformed query values', () => {
  const fallback = { compare: 'all', use: 'home', service: 'unsure' };
  assert.deepEqual(readComparison({}), fallback);
  assert.deepEqual(readComparison({ compare: ['outdoor-indoor', 'indoor-infrared'], use: 'rental', service: '<script>', source: 'https://elsewhere.test' }), fallback);
  for (const compare of comparisonPairs) {
    for (const use of projectUses) {
      for (const service of serviceScopes) {
        const state = { compare, use, service };
        assert.deepEqual(readComparison(Object.fromEntries(new URLSearchParams(comparisonQuery(state)))), state);
        const selected = comparisonApproaches(state);
        assert.ok(selected.length >= 2);
        assert.equal(new Set(selected).size, selected.length);
      }
    }
  }
});

test('quote handoff preserves project and scope without assuming infrared placement or a traditional heater', () => {
  const state = readComparison({ compare: 'outdoor-infrared', use: 'commercial', service: 'managed' });
  for (const approach of ['outdoor', 'indoor', 'infrared', 'unsure']) {
    for (const source of ['/en/compare-saunas/', '/fr/comparer-les-saunas/']) {
      const quote = new URLSearchParams(comparisonQuoteQuery(state, approach, source));
      assert.equal(quote.get('interest'), approach);
      assert.equal(quote.get('use'), 'commercial');
      assert.equal(quote.get('service'), 'managed');
      assert.equal(quote.get('placement'), approach === 'infrared' ? 'unsure' : approach);
      assert.equal(quote.get('heat'), approach === 'infrared' ? 'infrared' : 'unsure');
      assert.equal(quote.get('source'), source);
      assert.equal(quote.has('message'), false);
    }
  }
});
