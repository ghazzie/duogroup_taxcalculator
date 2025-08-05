'use client';

import { useState } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface FormData {
  assetCost: string;
  salvageValue: string;
  usefulLife: string;
  method: string;
  currentYear: string;
  totalUnits: string;
  unitsYear1: string;
  unitsYear2: string;
  unitsYear3: string;
  unitsYear4: string;
  unitsYear5: string;
  [key: string]: string;
}

interface DepreciationScheduleItem {
  year: number;
  depreciationExpense: number;
  accumulatedDepreciation: number;
  bookValue: number;
  units?: number;
}

interface Results {
  method: string;
  assetCost: number;
  salvageValue: number;
  usefulLife: number;
  currentYear: number;
  currentYearDepreciation: number;
  accumulatedDepreciation: number;
  bookValue: number;
  schedule: DepreciationScheduleItem[];
}

export default function Home() {
  const [formData, setFormData] = useState<FormData>({
    assetCost: '',
    salvageValue: '',
    usefulLife: '',
    method: 'straight-line',
    currentYear: '1',
    totalUnits: '',
    unitsYear1: '',
    unitsYear2: '',
    unitsYear3: '',
    unitsYear4: '',
    unitsYear5: ''
  });

  const [results, setResults] = useState<Results | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Client-side validation with helpful messages
    const cost = parseFloat(formData.assetCost);
    const salvage = parseFloat(formData.salvageValue);
    const life = parseInt(formData.usefulLife);
    const year = parseInt(formData.currentYear);

    // Check for invalid numbers
    if (isNaN(cost) || isNaN(salvage) || isNaN(life) || isNaN(year)) {
      setError('Please ensure all fields contain valid numbers.');
      setLoading(false);
      return;
    }

    // Validate asset cost
    if (cost <= 0) {
      setError('Asset cost must be greater than zero. Please enter the original purchase price of the asset.');
      setLoading(false);
      return;
    }

    // Validate salvage value
    if (salvage < 0) {
      setError('Salvage value cannot be negative. Enter zero if the asset will have no value at the end of its useful life.');
      setLoading(false);
      return;
    }

    if (salvage >= cost) {
      setError(`Salvage value ($${salvage.toLocaleString()}) must be less than the asset cost ($${cost.toLocaleString()}). The salvage value is the estimated value of the asset at the end of its useful life, which should be lower than what you paid for it.`);
      setLoading(false);
      return;
    }

    // Validate useful life
    if (life <= 0) {
      setError('Useful life must be at least 1 year. Enter the number of years you expect to use this asset.');
      setLoading(false);
      return;
    }

    // Validate current year
    if (year < 1 || year > life) {
      setError(`Current year must be between 1 and ${life} (the useful life you specified). You entered year ${year}.`);
      setLoading(false);
      return;
    }

    try {
      // Prepare units array if using units of production method
      const requestData: any = { ...formData };
      if (formData.method === 'units-of-production') {
        const unitsPerYear = [];
        for (let i = 1; i <= 5; i++) {
          const units = formData[`unitsYear${i}`];
          if (units) unitsPerYear.push(units);
        }
        requestData.unitsPerYear = unitsPerYear;
      }

      const response = await fetch('/api/calculate-depreciation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Calculation failed');
      }

      setResults(data);
    } catch (err) {
      setError((err as Error).message || 'Failed to calculate depreciation');
      setResults(null);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 pt-12">
      <div className="w-full max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2 text-gray-900">
          Tax Depreciation Calculator
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Calculate asset depreciation using various methods for accurate tax planning and financial reporting
        </p>
        
        <div className="bg-white rounded-lg shadow-sm p-8">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div>
                <label htmlFor="assetCost" className="block text-sm font-medium text-gray-700 mb-2">
                  Asset Cost
                </label>
                <input
                  type="number"
                  id="assetCost"
                  name="assetCost"
                  value={formData.assetCost}
                  onChange={handleInputChange}
                  placeholder="100000"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label htmlFor="salvageValue" className="block text-sm font-medium text-gray-700 mb-2">
                  Salvage Value
                </label>
                <input
                  type="number"
                  id="salvageValue"
                  name="salvageValue"
                  value={formData.salvageValue}
                  onChange={handleInputChange}
                  placeholder="10000"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label htmlFor="usefulLife" className="block text-sm font-medium text-gray-700 mb-2">
                  Useful Life (Years)
                </label>
                <input
                  type="number"
                  id="usefulLife"
                  name="usefulLife"
                  value={formData.usefulLife}
                  onChange={handleInputChange}
                  placeholder="10"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  min="1"
                  step="1"
                />
              </div>

              <div>
                <label htmlFor="method" className="block text-sm font-medium text-gray-700 mb-2">
                  Depreciation Method
                </label>
                <select
                  id="method"
                  name="method"
                  value={formData.method}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option value="straight-line">Straight Line</option>
                  <option value="declining-balance">Double Declining Balance</option>
                  <option value="sum-of-years">Sum of Years' Digits</option>
                  <option value="150-declining">150% Declining Balance</option>
                  <option value="units-of-production">Units of Production</option>
                  <option value="macrs-5year">MACRS 5-Year Property</option>
                  <option value="macrs-7year">MACRS 7-Year Property</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div>
                <label htmlFor="currentYear" className="block text-sm font-medium text-gray-700 mb-2">
                  Current Year
                </label>
                <input
                  type="number"
                  id="currentYear"
                  name="currentYear"
                  value={formData.currentYear}
                  onChange={handleInputChange}
                  placeholder="1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  min="1"
                  step="1"
                />
              </div>

              {formData.method === 'units-of-production' && (
                <>
                  <div>
                    <label htmlFor="totalUnits" className="block text-sm font-medium text-gray-700 mb-2">
                      Total Units Expected
                    </label>
                    <input
                      type="number"
                      id="totalUnits"
                      name="totalUnits"
                      value={formData.totalUnits}
                      onChange={handleInputChange}
                      placeholder="100000"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      min="1"
                      step="1"
                    />
                  </div>

                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Units Per Year (Optional)
                    </label>
                    <div className="grid grid-cols-5 gap-2">
                      {[1, 2, 3, 4, 5].map(year => (
                        <input
                          key={year}
                          type="number"
                          name={`unitsYear${year}`}
                          value={formData[`unitsYear${year}`]}
                          onChange={handleInputChange}
                          placeholder={`Year ${year}`}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          min="0"
                          step="1"
                        />
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Calculating...' : 'Calculate Depreciation'}
              </button>
            </div>

            {error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Validation Error</h3>
                    <div className="mt-1 text-sm text-red-700">
                      {error}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Results Display - Only show when we have results */}
        {results && (
          <div className="mt-8 bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Calculation Results</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Method</p>
                <p className="font-semibold text-gray-900">{results.method.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Asset Cost</p>
                <p className="font-semibold text-gray-900">{formatCurrency(results.assetCost)}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Salvage Value</p>
                <p className="font-semibold text-gray-900">{formatCurrency(results.salvageValue)}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Current Year</p>
                <p className="font-semibold text-gray-900">Year {results.currentYear}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Current Depreciation</p>
                <p className="font-semibold text-gray-900">{formatCurrency(results.currentYearDepreciation)}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Book Value</p>
                <p className="font-semibold text-gray-900">{formatCurrency(results.bookValue)}</p>
              </div>
            </div>

            {/* Depreciation Schedule Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Book Value Over Time</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={results.schedule}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="year" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="bookValue" 
                        stroke="#3b82f6" 
                        name="Book Value"
                        strokeWidth={2}
                        dot={{ fill: '#3b82f6', r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Annual Depreciation</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={results.schedule}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="year" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      <Legend />
                      <Bar 
                        dataKey="depreciationExpense" 
                        fill="#3b82f6" 
                        name="Annual Depreciation"
                        radius={[8, 8, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Depreciation Schedule Table */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Depreciation Schedule</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Year
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Depreciation Expense
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Accumulated Depreciation
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Book Value
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {results.schedule.map((item) => (
                      <tr key={item.year} className={item.year === results.currentYear ? 'bg-blue-50' : 'hover:bg-gray-50'}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item.year}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {formatCurrency(item.depreciationExpense)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {formatCurrency(item.accumulatedDepreciation)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {formatCurrency(item.bookValue)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
