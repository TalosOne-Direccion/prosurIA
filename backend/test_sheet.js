import fetch from 'node-fetch';

function parseCSV(text) {
  const result = [];
  let row = [];
  let currentVal = '';
  let inQuotes = false;
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];
    
    if (inQuotes) {
      if (char === '"') {
        if (nextChar === '"') {
          currentVal += '"';
          i++; // skip next quote
        } else {
          inQuotes = false;
        }
      } else {
        currentVal += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        row.push(currentVal);
        currentVal = '';
      } else if (char === '\r') {
        // ignore
      } else if (char === '\n') {
        row.push(currentVal);
        result.push(row);
        row = [];
        currentVal = '';
      } else {
        currentVal += char;
      }
    }
  }
  
  if (row.length > 0 || currentVal) {
    row.push(currentVal);
    result.push(row);
  }
  
  return result;
}

function serializeCSV(rows) {
  return rows.map(row => {
    return row.map(val => {
      const stringVal = String(val);
      if (stringVal.includes('"') || stringVal.includes(',') || stringVal.includes('\n') || stringVal.includes('\r')) {
        return `"${stringVal.replace(/"/g, '""')}"`;
      }
      return stringVal;
    }).join(',');
  }).join('\n');
}

async function main() {
  try {
    const csvUrl = "https://docs.google.com/spreadsheets/d/1EtwmDT0nwUhMTXTPTQsHRdWWi-ehLgib3dBwpXUp0Nc/export?format=csv&gid=362040753";
    console.log(`Fetching sheet from: ${csvUrl}`);
    const response = await fetch(csvUrl);
    const csvText = await response.text();
    
    const parsedRows = parseCSV(csvText);
    console.log("Original parsed rows:", parsedRows.length);
    
    // Simulate non-admin censoring
    const headerIndex = parsedRows.findIndex(row => row[0] && row[0].toLowerCase().includes("nombre del equipo"));
    if (headerIndex !== -1) {
      for (let i = headerIndex + 1; i < parsedRows.length; i++) {
        const row = parsedRows[i];
        if (!row[0] || !row[0].trim()) continue;
        
        if (row.length > 1 && row[1] && row[1].trim()) row[1] = '[Protegido]';
        if (row.length > 4 && row[4] && row[4].trim()) row[4] = '[Protegido]';
        if (row.length > 5 && row[5] && row[5].trim()) row[5] = '[Protegido por confidencialidad]';
        if (row.length > 7 && row[7] && row[7].trim()) row[7] = '[Protegido por confidencialidad]';
        if (row.length > 8 && row[8] && row[8].trim()) row[8] = '[Protegido por confidencialidad]';
        if (row.length > 9 && row[9] && row[9].trim()) row[9] = '[Protegido por confidencialidad]';
      }
    }
    
    const serialized = serializeCSV(parsedRows);
    const reparsedRows = parseCSV(serialized);
    console.log("Reparsed rows after serialization:", reparsedRows.length);
    
    if (parsedRows.length !== reparsedRows.length) {
      console.error("Mismatch in row count!");
      // Find where it deviates
      for (let i = 0; i < Math.max(parsedRows.length, reparsedRows.length); i++) {
        const orig = parsedRows[i] ? parsedRows[i][0] : 'NONE';
        const rep = reparsedRows[i] ? reparsedRows[i][0] : 'NONE';
        if (orig !== rep) {
          console.log(`Difference at row ${i}: Original Team="${orig}", Reparsed Team="${rep}"`);
          break;
        }
      }
    } else {
      console.log("Isomorphic parsing succeeded! Row count matches.");
    }
  } catch (err) {
    console.error("Error in test script:", err);
  }
}

main();
