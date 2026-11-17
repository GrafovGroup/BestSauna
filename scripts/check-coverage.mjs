import { serviceAreaRecords } from '../content/coverage.ts';
import { coverageAreaIssues, publishedCoverageAreas } from '../lib/coverage.ts';

const today = new Date().toISOString().slice(0, 10);
let failed = false;
for (const area of serviceAreaRecords) {
  const issues = coverageAreaIssues(area, today);
  if (!['draft', 'published', 'archived'].includes(area.status)) issues.push('Invalid publication state');
  if (serviceAreaRecords.filter(other => other.id === area.id).length !== 1) issues.push('Duplicate area identifier');
  if (issues.length && (area.status === 'published' || !['draft', 'archived'].includes(area.status))) {
    failed = true;
    console.error(`${area.id}: ${issues.join('; ')}`);
  }
}
console.log(`Coverage: ${publishedCoverageAreas(serviceAreaRecords, today).length} verified public scopes; ${serviceAreaRecords.length} records. Geographic selectors do not establish service availability.`);
if (failed) process.exitCode = 1;
