# DuoGroup Tax Depreciation Calculator

A comprehensive full-stack web application for calculating asset depreciation using various methods for tax purposes. Built with React (Vite) for the frontend and Express.js for the backend.

## Features

- Calculate depreciation using seven methods:
  - Straight-line depreciation
  - Double declining balance (200%)
  - 150% Declining Balance
  - Sum of years' digits
  - Units of Production
  - MACRS 5-Year Property
  - MACRS 7-Year Property
- Real-time calculation results
- Complete depreciation schedule visualization
- Responsive, modern UI design
- RESTful API backend

## Tech Stack

- **Frontend**: React 18, Vite, Recharts, TailwindCSS
- **Backend**: Node.js, Express.js, CORS
- **Deployment**: Docker, Netlify-ready

## Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose (optional, for containerized deployment)

## Installation & Setup

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/ghazzie/duogroup_taxcalculator.git
   cd duogroup_taxcalculator
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   npm run dev
   ```
   The backend server will start on http://localhost:5001

3. **Frontend Setup** (in a new terminal)
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   The frontend will open automatically at http://localhost:3015

### Docker Deployment

Run the entire stack with Docker Compose:

```bash
docker-compose up --build
```

This will start:
- Backend API at http://localhost:5001
- Frontend at http://localhost:3015

## API Endpoints

### POST /api/calculate-depreciation
Calculate depreciation for an asset.

**Request Body:**
```json
{
  "assetCost": 100000,
  "salvageValue": 10000,
  "usefulLife": 10,
  "method": "straight-line",
  "currentYear": 1
}
```

**Response:**
```json
{
  "method": "straight-line",
  "assetCost": 100000,
  "salvageValue": 10000,
  "usefulLife": 10,
  "currentYear": 1,
  "currentYearDepreciation": 9000,
  "accumulatedDepreciation": 9000,
  "bookValue": 91000,
  "schedule": [...]
}
```

### GET /api/health
Health check endpoint.

## Deployment

### Netlify (Frontend)

1. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```

2. Deploy to Netlify:
   - Connect your GitHub repository to Netlify
   - Set build command: `npm run build`
   - Set publish directory: `dist`
   - Update the API URL in `netlify.toml` to point to your deployed backend

### Backend Deployment

The backend can be deployed to any Node.js hosting service (Heroku, Railway, Render, etc.):

1. Set environment variables:
   - `PORT`: Server port (default: 5000)
   - `NODE_ENV`: Set to "production"

2. Deploy using the platform's CLI or GitHub integration

### Docker Deployment

For production Docker deployment:

```bash
docker-compose -f docker-compose.yml up -d
```

## Environment Variables

### Backend (.env)
```
PORT=your_port_number
NODE_ENV=production
```

**Note**: Create a `.env` file in the backend directory with your specific configuration. See `.env.example` for reference.

### Frontend
Update the API URL in the frontend code when deploying to production.

## Project Structure

```
duotax-calculator/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── index.css
│   ├── Dockerfile
│   ├── netlify.toml
│   └── package.json
├── backend/
│   ├── server.js
│   ├── Dockerfile
│   ├── .env
│   └── package.json
├── docker-compose.yml
└── README.md
```

## Depreciation Methods

1. **Straight-Line**: Equal depreciation each year
   - Formula: (Cost - Salvage Value) / Useful Life

2. **Double Declining Balance (200%)**: Accelerated depreciation
   - Formula: Book Value × (2 / Useful Life)

3. **150% Declining Balance**: Moderate accelerated depreciation
   - Formula: Book Value × (1.5 / Useful Life)

4. **Sum of Years' Digits**: Accelerated depreciation
   - Formula: (Cost - Salvage) × (Remaining Life / Sum of Years)

5. **Units of Production**: Based on actual usage
   - Formula: (Cost - Salvage) / Total Units × Units Used

6. **MACRS 5-Year**: IRS standard for computers, vehicles
   - Uses predetermined percentages over 6 years

7. **MACRS 7-Year**: IRS standard for office furniture
   - Uses predetermined percentages over 8 years

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
