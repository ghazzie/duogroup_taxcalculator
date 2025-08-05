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
import './App.css';

function App() {
  const [formData, setFormData] = useState({
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

  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Use direct API endpoint for production
  const API_URL = import.meta.env.VITE_API_URL || '';
  
  // No backend config warning needed
  const needsBackendConfig = false;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Prepare units array if using units of production method
      const requestData = { ...formData };
      if (formData.method === 'units-of-production') {
        const unitsPerYear = [];
        for (let i = 1; i <= 5; i++) {
          const units = formData[`unitsYear${i}`];
          if (units) unitsPerYear.push(units);
        }
        requestData.unitsPerYear = unitsPerYear;
      }

      // Use the calculate-depreciation endpoint
      const endpoint = `${API_URL}/api/calculate-depreciation`;
      const response = await fetch(endpoint, {
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
      setError(err.message || 'Failed to calculate depreciation');
      setResults(null);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  return (
    <div className="app-container">
      <div className="container">
        {/* Header */}
        <header className="header">
          <h1>
            Tax Depreciation Calculator
          </h1>
          <p>
            Calculate asset depreciation using various methods for accurate tax planning and financial reporting
          </p>
        </header>

        {/* Backend Configuration Warning */}
        {needsBackendConfig && (
          <div style={{
            background: '#fff3cd',
            border: '1px solid #ffc107',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '24px',
            color: '#856404'
          }}>
            <strong>⚠️ Backend Not Configured</strong>
            <p style={{ margin: '8px 0 0 0' }}>
              The backend API is not yet deployed. To enable calculations:
              <ol style={{ marginTop: '8px' }}>
                <li>Deploy the backend to a service like Render, Railway, or Heroku</li>
                <li>Set the VITE_API_URL environment variable in Vercel to your backend URL</li>
              </ol>
            </p>
          </div>
        )}

        {/* Calculator Form */}
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <div className="form-fields">
              {/* Asset Cost */}
              <div className="form-group">
                <label htmlFor="assetCost">
                  Asset Cost
                </label>
                <input
                  type="number"
                  id="assetCost"
                  name="assetCost"
                  value={formData.assetCost}
                  onChange={handleInputChange}
                  placeholder="100000"
                  step="0.01"
                  min="0"
                  required
                />
              </div>

              {/* Salvage Value */}
              <div className="form-group">
                <label htmlFor="salvageValue">
                  Salvage Value
                </label>
                <input
                  type="number"
                  id="salvageValue"
                  name="salvageValue"
                  value={formData.salvageValue}
                  onChange={handleInputChange}
                  placeholder="10000"
                  step="0.01"
                  min="0"
                  required
                />
              </div>

              {/* Useful Life */}
              <div className="form-group">
                <label htmlFor="usefulLife">
                  Useful Life (Years)
                </label>
                <input
                  type="number"
                  id="usefulLife"
                  name="usefulLife"
                  value={formData.usefulLife}
                  onChange={handleInputChange}
                  placeholder="10"
                  min="1"
                  required
                />
              </div>

              {/* Depreciation Method */}
              <div className="form-group">
                <label htmlFor="method">
                  Depreciation Method
                </label>
                <select
                  id="method"
                  name="method"
                  value={formData.method}
                  onChange={handleInputChange}
                  required
                >
                  <option value="straight-line">Straight Line</option>
                  <option value="declining-balance">Double Declining Balance (200%)</option>
                  <option value="150-declining">150% Declining Balance</option>
                  <option value="sum-of-years">Sum of Years' Digits</option>
                  <option value="units-of-production">Units of Production</option>
                  <option value="macrs-5year">MACRS 5-Year Property</option>
                  <option value="macrs-7year">MACRS 7-Year Property</option>
                </select>
              </div>

              {/* Units of Production Fields */}
              {formData.method === 'units-of-production' && (
                <>
                  <div className="form-group">
                    <label htmlFor="totalUnits">
                      Total Expected Units
                    </label>
                    <input
                      type="number"
                      id="totalUnits"
                      name="totalUnits"
                      value={formData.totalUnits}
                      onChange={handleInputChange}
                      placeholder="e.g., 100000 miles"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Units Per Year (Optional)</label>
                    <div style={{ display: 'grid', gap: '8px' }}>
                      {[1, 2, 3, 4, 5].map(year => (
                        <input
                          key={year}
                          type="number"
                          name={`unitsYear${year}`}
                          value={formData[`unitsYear${year}`]}
                          onChange={handleInputChange}
                          placeholder={`Year ${year} units`}
                          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                        />
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Current Year */}
              <div className="form-group">
                <label htmlFor="currentYear">
                  Current Year
                </label>
                <input
                  type="number"
                  id="currentYear"
                  name="currentYear"
                  value={formData.currentYear}
                  onChange={handleInputChange}
                  placeholder="1"
                  min="1"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="error-message">
                <p>{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="calculate-button"
            >
              {loading ? 'Calculating...' : 'Calculate Depreciation'}
            </button>
          </form>
        </div>

        {/* Results Section */}
        {results && (
          <div className="results-section">
            {/* Results Header */}
            <div className="results-header">
              <div>
                <h2>Depreciation Analysis</h2>
                <p>
                  Method: <span>
                    {results.method.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                </p>
              </div>
            </div>

              {/* Key Metrics */}
              <div className="metrics">
                <div className="metric">
                  <h3>Current Year Depreciation</h3>
                  <p>{formatCurrency(results.currentYearDepreciation)}</p>
                </div>

                <div className="metric">
                  <h3>Accumulated Depreciation</h3>
                  <p>{formatCurrency(results.accumulatedDepreciation)}</p>
                </div>

                <div className="metric">
                  <h3>Book Value</h3>
                  <p>{formatCurrency(results.bookValue)}</p>
                </div>
              </div>

              {/* Depreciation Schedule Table */}
              <div className="table-container">
                <h3>Depreciation Schedule</h3>
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>Year</th>
                        <th>Depreciation Expense</th>
                        <th>Accumulated Depreciation</th>
                        <th>Book Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.schedule.map((item) => (
                        <tr key={item.year} className={item.year == formData.currentYear ? 'current-year' : ''}>
                          <td>{item.year}</td>
                          <td>{formatCurrency(item.depreciationExpense)}</td>
                          <td>{formatCurrency(item.accumulatedDepreciation)}</td>
                          <td>{formatCurrency(item.bookValue)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            {/* Charts Section */}
            <div className="charts-section">
              <h3>Visual Analysis</h3>
              
              <div className="charts-container">
                {/* Line Chart for Book Value */}
                <div className="chart">
                  <h4>Book Value Over Time</h4>
                  <div className="chart-wrapper">
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart
                        data={results.schedule}
                        margin={{ top: 20, right: 30, left: 60, bottom: 20 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="year" 
                          label={{ value: 'Year', position: 'insideBottom', offset: -5 }}
                        />
                        <YAxis 
                          label={{ value: 'Book Value ($)', angle: -90, position: 'insideLeft', offset: -45 }}
                          tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                          tick={{ fontSize: 12 }}
                        />
                        <Tooltip 
                          formatter={(value) => formatCurrency(value)}
                        />
                        <Legend verticalAlign="top" height={36} />
                        <Line 
                          type="monotone" 
                          dataKey="bookValue" 
                          stroke="#8884d8" 
                          strokeWidth={2}
                          name="Book Value"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Bar Chart for Depreciation Expenses */}
                <div className="chart">
                  <h4>Annual Depreciation Expense</h4>
                  <div className="chart-wrapper">
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart
                        data={results.schedule}
                        margin={{ top: 20, right: 30, left: 60, bottom: 20 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="year" 
                          label={{ value: 'Year', position: 'insideBottom', offset: -5 }}
                          tick={{ fontSize: 12 }}
                        />
                        <YAxis 
                          label={{ value: 'Depreciation ($)', angle: -90, position: 'insideLeft', offset: -45 }}
                          tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                          tick={{ fontSize: 12 }}
                        />
                        <Tooltip 
                          formatter={(value) => formatCurrency(value)}
                        />
                        <Legend verticalAlign="top" height={36} />
                        <Bar 
                          dataKey="depreciationExpense" 
                          fill="#82ca9d" 
                          name="Depreciation Expense"
                          barSize={40}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
