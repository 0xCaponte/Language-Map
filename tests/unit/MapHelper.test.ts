import { describe, it, expect, vi } from 'vitest';
import { MapHelper } from '$lib/helpers/MapHelper';
import { ColoringHelper } from '$lib/helpers/ColoringHelper';
import * as d3Fetch from 'd3-fetch';
import Language from '$lib/model/language';
import Country from '$lib/model/country';
import * as topojson from 'topojson-client';

// Mock d3-fetch
vi.mock('d3-fetch', () => ({
  json: vi.fn(),
}));

// Mock ColoringHelper
vi.mock('$lib/helpers/ColoringHelper', () => ({
  ColoringHelper: {
    getDefaultColor: vi.fn(() => '#CCCCCC'),
    getColorByCountryId: vi.fn((id) => `#${id}`),
  },
}));

// Mock topojson-client
vi.mock('topojson-client', () => ({
  feature: vi.fn((world, object) => ({ features: object.geometries })),
  mesh: vi.fn(() => 'mock-mesh'),
}));

const mockWorld = {
  objects: {
    countries: {
      type: 'GeometryCollection',
      geometries: [
        { id: '010', properties: { name: 'Antarctica' } },
        { id: '840', properties: { name: 'United States' } },
        { id: '156', properties: { name: 'China' } },
        { id: '158', properties: { name: 'Taiwan' } },
      ],
    },
  },
};

const mockUsa = new Country({ countryId: '840', commonName: 'United States' });
const mockChina = new Country({ countryId: '156', commonName: 'China' });

describe('MapHelper', () => {
    describe('fetchMapData', () => {
        it('should fetch map data from the API', async () => {
            d3Fetch.json.mockResolvedValue(mockWorld);
            const data = await MapHelper.fetchMapData();
            expect(d3Fetch.json).toHaveBeenCalledWith('/api/world');
            expect(data).toEqual(mockWorld);
        });
    });

    describe('processCountries', () => {
        it('should process all countries when not in condensed version', () => {
            const countries = MapHelper.processCountries(mockWorld);
            expect(countries).toHaveLength(4);
        });

        it('should filter out Antarctica in condensed version', () => {
            const countries = MapHelper.processCountries(mockWorld, true);
            expect(countries).toHaveLength(3);
            expect(countries.some(c => c.id === '010')).toBe(false);
        });
    });

    describe('processBorders', () => {
        it('should process borders for all countries when not in condensed version', () => {
            const borders = MapHelper.processBorders(mockWorld);
            expect(borders).toBe('mock-mesh');
        });

        it('should process borders for all countries except Antarctica in condensed version', () => {
            const borders = MapHelper.processBorders(mockWorld, true);
            expect(borders).toBe('mock-mesh');
        });
    });

    describe('getCountryFillColor', () => {
        it('should return default color if no languages are selected', () => {
            const color = MapHelper.getCountryFillColor('840', []);
            expect(color).toBe('#CCCCCC');
        });

        it('should return a specific color if the country is in a selected language', () => {
            const english = new Language('English', {}, [mockUsa]);
            const color = MapHelper.getCountryFillColor('840', [english]);
            expect(color).toBe('#840');
        });

        it('should return default color if the country is not in a selected language', () => {
            const english = new Language('English', {}, [mockUsa]);
            const color = MapHelper.getCountryFillColor('156', [english]);
            expect(color).toBe('#CCCCCC');
        });

        it('should handle the special case for Taiwan and Chinese', () => {
            const chinese = new Language('Chinese', {}, [mockChina]);
            const color = MapHelper.getCountryFillColor('158', [chinese]);
            expect(color).toBe('#158');
        });
    });

    describe('updateCountries', () => {
        it('should not do anything if countries are not loaded', () => {
            const result = MapHelper.updateCountries(null, []);
            expect(result).toBeUndefined();
        });

        it('recalculates fills for each provided country', () => {
            const languages = [new Language('English', {}, [mockUsa])];
            const colorSpy = vi
                .spyOn(MapHelper, 'getCountryFillColor')
                .mockImplementation((id) => (id === '840' ? '#primary' : '#fallback'));

            const mapSpy = vi.fn((callback: (country: { id: string }) => { id: string; fill: string }) => {
                const draftCountries = [
                    { id: '840', name: 'United States' },
                    { id: '156', name: 'China' }
                ];
                return draftCountries.map(callback);
            });

            MapHelper.updateCountries({ map: mapSpy } as any, languages);

            expect(mapSpy).toHaveBeenCalledTimes(1);
            const mappedCountries = mapSpy.mock.results[0]?.value;
            expect(mappedCountries).toEqual([
                { id: '840', name: 'United States', fill: '#primary' },
                { id: '156', name: 'China', fill: '#fallback' }
            ]);
            expect(colorSpy).toHaveBeenCalledWith('840', languages);
            expect(colorSpy).toHaveBeenCalledWith('156', languages);
            expect(colorSpy).toHaveBeenCalledTimes(2);

            colorSpy.mockRestore();
        });
    });
});