import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ExcelJS from 'exceljs';
import { pool } from './db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const dataDir = path.join(__dirname, '..', '..', 'data');
export const curcuminXlsxPath = path.join(dataDir, 'curcumin_trafficlight_data.xlsx');

const CURCUMIN_HEADER_ROW = 6;
const RISK_LABEL_TO_CODE = {
  'Potential Risk': 'RED',
  'Low-Potential Risk': 'YELLOW',
  'Low Risk': 'GREEN',
  Undetermined: 'GRAY',
};
const MECHANISM_NOTE_BY_RISK = {
  RED: 'Classified as Potential Risk per Figure 2 (Antineoplastic Therapy and Curcumin – PK Interaction Risk Stratification Framework). Specific PK mechanism not detailed in the source figure.',
  YELLOW: 'Classified as Low-Potential Risk per Figure 2 (Antineoplastic Therapy and Curcumin – PK Interaction Risk Stratification Framework). Specific PK mechanism not detailed in the source figure.',
  GREEN: 'Classified as Low Risk per Figure 2 (Antineoplastic Therapy and Curcumin – PK Interaction Risk Stratification Framework). Specific PK mechanism not detailed in the source figure.',
  GRAY: 'Classified as Undetermined per Figure 2 (Antineoplastic Therapy and Curcumin – PK Interaction Risk Stratification Framework) — insufficient data in the source to classify risk.',
};

const schema = `
  DROP TABLE IF EXISTS drugs CASCADE;

  CREATE TABLE drugs (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    drug_class TEXT NOT NULL,
    route TEXT NOT NULL CHECK (route IN ('IV', 'Oral')),
    cancer_context TEXT,
    risk_level TEXT NOT NULL CHECK (risk_level IN ('RED', 'YELLOW', 'GREEN', 'GRAY')),
    mechanism_category TEXT NOT NULL,
    mechanism_note TEXT NOT NULL
  );
`;

async function loadCurcuminInteractions() {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(curcuminXlsxPath);
  const sheet = workbook.worksheets[0];

  const rawRows = [];
  sheet.eachRow((row, rowNumber) => {
    if (rowNumber <= CURCUMIN_HEADER_ROW) return;
    const drugName = row.getCell(1).value;
    if (!drugName) return;
    const route = String(row.getCell(2).value);
    const drugClass = String(row.getCell(3).value);
    const riskLabel = row.getCell(4).value;
    const riskCode = RISK_LABEL_TO_CODE[riskLabel];
    if (!riskCode) {
      throw new Error(`Unrecognized risk label "${riskLabel}" at row ${rowNumber} in ${curcuminXlsxPath}`);
    }
    rawRows.push({ drugName: String(drugName), route, drugClass, riskCode });
  });

  // Some drugs (e.g. Etoposide) appear at both IV and Oral with independently-set
  // risk. Disambiguate only when a name actually collides, so the `drugs.name`
  // UNIQUE constraint isn't violated.
  const nameCounts = {};
  for (const r of rawRows) nameCounts[r.drugName] = (nameCounts[r.drugName] || 0) + 1;

  return rawRows.map((r) => ({
    drug_name: nameCounts[r.drugName] > 1 ? `${r.drugName} (${r.route})` : r.drugName,
    drug_class: r.drugClass,
    route: r.route,
    cancer_context: null,
    risk_level: r.riskCode,
    mechanism_category: 'FIGURE2_RISK_STRATIFICATION',
    mechanism_note: MECHANISM_NOTE_BY_RISK[r.riskCode],
  }));
}

async function seed() {
  const drugs = await loadCurcuminInteractions();

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(schema);

    for (const d of drugs) {
      await client.query(
        `INSERT INTO drugs (name, drug_class, route, cancer_context, risk_level, mechanism_category, mechanism_note)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [d.drug_name, d.drug_class, d.route, d.cancer_context, d.risk_level, d.mechanism_category, d.mechanism_note]
      );
    }

    await client.query('COMMIT');
    console.log(`Seeded ${drugs.length} drugs from curcumin_trafficlight_data.xlsx.`);
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

if (fileURLToPath(import.meta.url) === path.resolve(process.argv[1] || '')) {
  seed().catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
  });
}
