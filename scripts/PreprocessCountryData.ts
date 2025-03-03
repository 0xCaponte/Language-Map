import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import http from 'http';
import https from 'https';

import Country from '../src/lib/model/country';
import Language from '../src/lib/model/language';
import Statistics from '../src/lib/model/statistics';
import { CountryData } from '../src/lib/model/CountryData';

// Create custom agents with keepAlive set to false to prevent hanging connections
const httpAgent = new http.Agent({ keepAlive: false });
const httpsAgent = new https.Agent({ keepAlive: false });

// Safety timeout - force exit after 2 minutes if script hangs
const safetyTimeout = setTimeout(() => {
    console.warn('⚠️ SAFETY TIMEOUT: Force exiting after 5 minutes - script may have hung');
    process.exit(0);
}, 300000);

// clean up the safety timeout if we exit normally
process.on('exit', () => {
    
    clearTimeout(safetyTimeout);
    
    // Destroy any remaining agent connections
    httpAgent.destroy();
    httpsAgent.destroy();
    console.log(`[${new Date().toISOString()}] Process exiting, resources cleaned up`);
});

async function main() {
    console.log(`[${new Date().toISOString()}] Starting preprocessing...`);
    const jsonUrl = 'https://r2.languagemap.world/resources/countryData.json';

    try {
        console.log(`[${new Date().toISOString()}] Fetching data from: ${jsonUrl}`);
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 30000); // 30 second timeout
        
        const response = await fetch(jsonUrl, { 
            signal: controller.signal,
            headers: { 'User-Agent': 'Language-Map-Cloudflare-Build/1.0' },
      
            // Use the custom agents to avoid hanging connections
            agent: (_parsedURL) => {
                return _parsedURL.protocol === 'http:' ? httpAgent : httpsAgent;
            }
        });
        clearTimeout(timeout);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch Country Json data: ${response.statusText}`);
        }
        
        console.log(`[${new Date().toISOString()}] Data fetched successfully, parsing JSON...`);
        const data : CountryData[] = (await response.json()) as CountryData[];
        console.log(`[${new Date().toISOString()}] Parsed data for ${data.length} countries`);

        // Initialize maps
        console.log(`[${new Date().toISOString()}] Initializing maps...`);
        const countryMap: Map<string, Country> = new Map<string, Country>();
        const languageMap: Map<string, Language> = new Map<string, Language>();

        // Process data
        console.log(`[${new Date().toISOString()}] Processing country data...`);
        data.forEach((item) => {
            populateCountryMap(item, countryMap);
            const country = countryMap.get(item.name.common);

            if (country) {
                populateLanguageMap(item, country, languageMap);
            }
        });

        console.log(`[${new Date().toISOString()}] Sorting language countries...`);
        sortLanguageCountries(languageMap);

        // Write maps to files
        console.log(`[${new Date().toISOString()}] Preparing to write files...`);
        const staticDirPath = path.join(__dirname, '..', 'static', 'data');
        fs.mkdirSync(staticDirPath, { recursive: true });

        // Write maps to files with explicit error handling
        console.log(`[${new Date().toISOString()}] Writing countryMap.json...`);
        try {
            fs.writeFileSync(path.join(staticDirPath, 'countryMap.json'), JSON.stringify(Array.from(countryMap.entries())));
        } catch (writeError) {
            console.error(`[${new Date().toISOString()}] Error writing countryMap.json:`, writeError);
            throw writeError;
        }
        
        console.log(`[${new Date().toISOString()}] Writing languageMap.json...`);
        try {
            fs.writeFileSync(path.join(staticDirPath, 'languageMap.json'), JSON.stringify(Array.from(languageMap.entries())));
        } catch (writeError) {
            console.error(`[${new Date().toISOString()}] Error writing languageMap.json:`, writeError);
            throw writeError;
        }

        const countryMapSize = fs.statSync(path.join(staticDirPath, 'countryMap.json')).size / 1024;
        const languageMapSize = fs.statSync(path.join(staticDirPath, 'languageMap.json')).size / 1024;
        console.log(`[${new Date().toISOString()}] countryMap.json: ${countryMapSize.toFixed(2)} KB`);
        console.log(`[${new Date().toISOString()}] languageMap.json: ${languageMapSize.toFixed(2)} KB`);

        console.log(`[${new Date().toISOString()}] Static data maps have been generated & saved to: ${staticDirPath}`);
        console.log(`[${new Date().toISOString()}] Preprocessing complete!`);
        
        // Explicitly close any remaining HTTP connections
        httpAgent.destroy();
        httpsAgent.destroy();
        
        return true;

    } catch (error) {
        console.error(`[${new Date().toISOString()}] Error in preprocessing:`, error);
       
        // Explicitly close any remaining HTTP connections on error
        httpAgent.destroy();
        httpsAgent.destroy();
        return false; 
    }
}

function populateCountryMap(item, countryMap) {
    const { common, official } = item.name;
    const country = new Country(
        item.ccn3,
        item.cca2,
        common,
        official,
        item.flag,
        item.independent,
        item.unMember,
        item.population,
        item.languages
    );

    countryMap.set(common, country);
}

function populateLanguageMap(item: CountryData, country: Country, languageMap: Map<string, Language>): void {
    item.languages.forEach((language) => {
        let languageName: string = language.language.toLowerCase();
        let languageData = languageMap.get(languageName);

        if (!languageData) {
            languageData = new Language(languageName, new Statistics(0, 0, 0, 0), []);
            languageMap.set(languageName, languageData);
        }

        if (item.unMember) {
            // Not all population speaks the language
            languageData.statistics.totalUNSpeakers += item.population * language.percentage;
            languageData.statistics.numberOfUNCountries += 1;
        }

        // Not all population speaks the language
        languageData.statistics.totalSpeakers += item.population * language.percentage;
        languageData.statistics.numberOfCountries += 1;
        languageData.countries.push(country);
    });
}

function sortLanguageCountries(languageMap: Map<string, Language>) {
    languageMap.forEach((language) => {
        language.countries.sort((a, b) => a.commonName.localeCompare(b.commonName));
    });
}

console.log(`[${new Date().toISOString()}] Script started, executing main function...`);

main()
    .then(success => {
        console.log(`[${new Date().toISOString()}] Main function completed with ${success ? 'success' : 'failure'}`);
        
        // Use setTimeout to ensure any lingering async operations have a chance to complete
        setTimeout(() => {
            console.log(`[${new Date().toISOString()}] Preprocessing script execution completed, exiting now`);
            process.exit(success ? 0 : 1);
        }, 1000); // Increased to 1000ms to ensure more time for cleanup
    })
    .catch(err => {
        console.error(`[${new Date().toISOString()}] Fatal unhandled error in preprocessing script:`, err);
        setTimeout(() => {
            process.exit(1);
        }, 1000);
    });

// Log that we've started the execution chain
console.log(`[${new Date().toISOString()}] Execution chain started, waiting for completion...`);
