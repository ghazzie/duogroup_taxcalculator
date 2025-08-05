# Tax Depreciation Calculator - Next.js Version

A modern, unified tax depreciation calculator built with Next.js, combining frontend and backend into a single deployable application.

## Features

- **Multiple Depreciation Methods**:
  - Straight Line
  - Double Declining Balance
  - Sum of Years' Digits
  - 150% Declining Balance
  - Units of Production
  - MACRS 5-Year Property
  - MACRS 7-Year Property

- **Interactive Visualizations**: 
  - Book value over time (line chart)
  - Annual depreciation (bar chart)
  - Detailed depreciation schedule table

- **Modern Tech Stack**:
  - Next.js 15 with App Router
  - TypeScript for type safety
  - Tailwind CSS for styling
  - Recharts for data visualization
  - API Routes for backend logic

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone [your-repo-url]

# Navigate to the Next.js app
cd duotax-nextjs

# Install dependencies
npm install
```

### Development

```bash
# Start the development server
npm run dev

# The app will be available at http://localhost:3000
```

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

## API Endpoints

### Calculate Depreciation
- **POST** `/api/calculate-depreciation`
- **Body**:
  ```json
  {
    "assetCost": "100000",
    "salvageValue": "10000",
    "usefulLife": "5",
    "method": "straight-line",
    "currentYear": "1"
  }
  ```

### Health Check
- **GET** `/api/calculate-depreciation`
- Returns: `{"status":"OK","message":"Tax Depreciation Calculator API is running"}`

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import to Vercel
3. Deploy automatically

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Digital Ocean App Platform

1. Push to GitHub
2. Create new app in Digital Ocean
3. Select Node.js buildpack
4. Deploy

### Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Environment Variables

No environment variables required! The API is integrated directly into the Next.js app.

## Project Structure

```
duotax-nextjs/
├── app/
│   ├── api/
│   │   └── calculate-depreciation/
│   │       └── route.ts        # API endpoint
│   ├── globals.css            # Global styles
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Main calculator page
├── public/                    # Static assets
├── package.json
└── README.md
```

## Benefits of Next.js Version

1. **Single Deployment**: No separate frontend/backend
2. **No CORS Issues**: API and UI on same domain
3. **Better Performance**: Server-side rendering available
4. **Simpler Development**: One `npm run dev` command
5. **Cost Effective**: One service instead of two
6. **Type Safety**: Full TypeScript support

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.