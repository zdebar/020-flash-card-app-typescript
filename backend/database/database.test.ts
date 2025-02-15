import { describe, it, expect, vi } from 'vitest';
import * as fs from 'fs';
import { checkCSVPath } from './database'; // Adjust this to your actual file path

// Mock fs.access using vitest spy
vi.mock('fs', () => ({
  ...vi.importActual('fs'),
  access: vi.fn(),        
}));

describe('checkCSVPath', () => {
  it('should return true if the CSV file exists', async () => {
    // Mock the fs.access to simulate a successful file check
    fs.access.mockResolvedValueOnce(undefined); // No error, file exists
    
    const result = await checkCSVPath('path/to/existing/file.csv');
    expect(result).toBe(true); 
  });

  it('should return false if the CSV file does not exist', async () => {
    // Mock fs.access to simulate a failed file check
    fs.access.mockRejectedValueOnce(new Error('File not found'));
    
    const result = await checkCSVPath('path/to/nonexistent/file.csv');
    expect(result).toBe(false);
  });
});
