import { describe, test, expect } from 'vitest';
import Statistics from '$lib/model/statistics';
import { mockStatistics } from '../mockData';

describe('Statistics', () => {
    describe('Constructor', () => {
        test('should initialize with separate parameters', () => {
            const { totalUNSpeakers, numberOfUNCountries, totalSpeakers, numberOfCountries } = mockStatistics.complete;
            const stats = new Statistics(totalUNSpeakers, numberOfUNCountries, totalSpeakers, numberOfCountries);
            
            expect(stats.totalUNSpeakers).toBe(totalUNSpeakers);
            expect(stats.numberOfUNCountries).toBe(numberOfUNCountries);
            expect(stats.totalSpeakers).toBe(totalSpeakers);
            expect(stats.numberOfCountries).toBe(numberOfCountries);
        });
        
        test('should initialize with object parameter', () => {
            const mockData = mockStatistics.complete;
            const stats = new Statistics(mockData);
            
            expect(stats.totalUNSpeakers).toBe(mockData.totalUNSpeakers);
            expect(stats.numberOfUNCountries).toBe(mockData.numberOfUNCountries);
            expect(stats.totalSpeakers).toBe(mockData.totalSpeakers);
            expect(stats.numberOfCountries).toBe(mockData.numberOfCountries);
        });
        
        test('should initialize with partial object parameter', () => {
            const mockData = mockStatistics.partial;
            const stats = new Statistics(mockData);
            
            expect(stats.totalUNSpeakers).toBe(mockData.totalUNSpeakers);
            expect(stats.numberOfUNCountries).toBe(mockData.numberOfUNCountries);
            expect(stats.totalSpeakers).toBe(0); // Default value
            expect(stats.numberOfCountries).toBe(0); // Default value
        });
        
        test('should initialize with default values if no parameters provided', () => {
            const stats = new Statistics(mockStatistics.empty);
            
            expect(stats.totalUNSpeakers).toBe(0);
            expect(stats.numberOfUNCountries).toBe(0);
            expect(stats.totalSpeakers).toBe(0);
            expect(stats.numberOfCountries).toBe(0);
        });
    });
    
    describe('getWorldPercentage', () => {
        test('should calculate UN percentage correctly', () => {
            const mockData = mockStatistics.worldPercentage;
            const stats = new Statistics(mockData);
            const percentage = stats.getWorldPercentage(true);
            
            // 404281350 * 100 / 8085627000 = ~5%
            expect(percentage).toBeCloseTo(5, 1);
        });
        
        test('should calculate total percentage correctly', () => {
            const mockData = mockStatistics.worldPercentage;
            const stats = new Statistics(mockData);
            const percentage = stats.getWorldPercentage(false);
            
            // 600000000 * 100 / 8085627000 = ~7.42%
            expect(percentage).toBeCloseTo(7.42, 2);
        });
        
        test('should handle zero speakers', () => {
            const stats = new Statistics(mockStatistics.zeros);
            const percentage = stats.getWorldPercentage(false);
            
            expect(percentage).toBe(0);
        });
    });
    
    describe('getSpeakers', () => {
        test('should return UN speakers when unMember is true', () => {
            const mockData = mockStatistics.complete;
            const stats = new Statistics(mockData);
            
            expect(stats.getSpeakers(true)).toBe(mockData.totalUNSpeakers);
        });
        
        test('should return total speakers when unMember is false', () => {
            const mockData = mockStatistics.complete;
            const stats = new Statistics(mockData);
            
            expect(stats.getSpeakers(false)).toBe(mockData.totalSpeakers);
        });
    });
    
    describe('getCountries', () => {
        test('should return UN countries when unMember is true', () => {
            const mockData = mockStatistics.complete;
            const stats = new Statistics(mockData);
            
            expect(stats.getCountries(true)).toBe(mockData.numberOfUNCountries);
        });
        
        test('should return total countries when unMember is false', () => {
            const mockData = mockStatistics.complete;
            const stats = new Statistics(mockData);
            
            expect(stats.getCountries(false)).toBe(mockData.numberOfCountries);
        });
    });
    
    describe('hasNonUNCountries', () => {
        test('should return true when there are non-UN countries', () => {
            const stats = new Statistics(mockStatistics.complete);
            
            expect(stats.hasNonUNCountries()).toBe(true);
        });
        
        test('should return false when there are no non-UN countries', () => {
            const stats = new Statistics(mockStatistics.onlyUN);
            
            expect(stats.hasNonUNCountries()).toBe(false);
        });
        
        test('should return false when there are no countries at all', () => {
            const stats = new Statistics(mockStatistics.zeros);
            
            expect(stats.hasNonUNCountries()).toBe(false);
        });
    });
});