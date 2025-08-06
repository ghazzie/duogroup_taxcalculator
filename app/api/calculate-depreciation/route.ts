import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      assetCost,
      salvageValue,
      usefulLife,
      method,
      currentYear = 1,
      totalUnits = 0,
      unitsPerYear = []
    } = body;

    // Validate inputs
    if (!assetCost || !salvageValue || !usefulLife || !method) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const cost = parseFloat(assetCost);
    const salvage = parseFloat(salvageValue);
    const life = parseInt(usefulLife);
    const year = parseInt(currentYear);

    // Detailed validation with specific error messages
    if (cost <= 0) {
      return NextResponse.json({ 
        error: 'Asset cost must be greater than zero. Please enter a positive value for the original cost of the asset.' 
      }, { status: 400 });
    }
    
    if (salvage < 0) {
      return NextResponse.json({ 
        error: 'Salvage value cannot be negative. Please enter zero or a positive value for the expected value at the end of the asset\'s useful life.' 
      }, { status: 400 });
    }
    
    if (salvage >= cost) {
      return NextResponse.json({ 
        error: `Salvage value ($${salvage.toLocaleString()}) must be less than the asset cost ($${cost.toLocaleString()}). The salvage value represents the expected worth of the asset at the end of its useful life, which should be lower than its original cost.` 
      }, { status: 400 });
    }
    
    if (life <= 0) {
      return NextResponse.json({ 
        error: 'Useful life must be at least 1 year. Please enter the number of years the asset will be used.' 
      }, { status: 400 });
    }
    
    if (year < 1 || year > life) {
      return NextResponse.json({ 
        error: `Current year must be between 1 and ${life} (the useful life). You entered year ${year}.` 
      }, { status: 400 });
    }

    let depreciation = 0;
    let accumulatedDepreciation = 0;
    let bookValue = cost;
    let schedule: any[] = [];

    switch (method) {
      case 'straight-line':
        // Straight-line depreciation
        depreciation = (cost - salvage) / life;
        for (let i = 1; i <= life; i++) {
          accumulatedDepreciation = depreciation * i;
          bookValue = cost - accumulatedDepreciation;
          schedule.push({
            year: i,
            depreciationExpense: depreciation,
            accumulatedDepreciation,
            bookValue: Math.max(bookValue, salvage)
          });
        }
        break;

      case 'declining-balance':
        // Double declining balance
        const rate = (2 / life);
        let remainingValue = cost;
        
        for (let i = 1; i <= life; i++) {
          depreciation = remainingValue * rate;
          
          // Ensure book value doesn't go below salvage value
          if (remainingValue - depreciation < salvage) {
            depreciation = remainingValue - salvage;
          }
          
          accumulatedDepreciation += depreciation;
          remainingValue -= depreciation;
          
          schedule.push({
            year: i,
            depreciationExpense: depreciation,
            accumulatedDepreciation,
            bookValue: remainingValue
          });
          
          if (remainingValue <= salvage) break;
        }
        break;

      case 'sum-of-years':
        // Sum of years' digits
        const sumOfYears = (life * (life + 1)) / 2;
        const depreciableAmount = cost - salvage;
        
        for (let i = 1; i <= life; i++) {
          const fraction = (life - i + 1) / sumOfYears;
          depreciation = depreciableAmount * fraction;
          accumulatedDepreciation += depreciation;
          bookValue = cost - accumulatedDepreciation;
          
          schedule.push({
            year: i,
            depreciationExpense: depreciation,
            accumulatedDepreciation,
            bookValue: Math.max(bookValue, salvage)
          });
        }
        break;

      case '150-declining':
        // 150% Declining Balance
        const rate150 = 1.5 / life;
        let remainingValue150 = cost;
        
        for (let i = 1; i <= life; i++) {
          depreciation = remainingValue150 * rate150;
          
          // Switch to straight-line if it gives higher depreciation
          const straightLineDepreciation = (remainingValue150 - salvage) / (life - i + 1);
          if (straightLineDepreciation > depreciation) {
            depreciation = straightLineDepreciation;
          }
          
          // Ensure book value doesn't go below salvage value
          if (remainingValue150 - depreciation < salvage) {
            depreciation = remainingValue150 - salvage;
          }
          
          accumulatedDepreciation += depreciation;
          remainingValue150 -= depreciation;
          
          schedule.push({
            year: i,
            depreciationExpense: depreciation,
            accumulatedDepreciation,
            bookValue: remainingValue150
          });
          
          if (remainingValue150 <= salvage) break;
        }
        break;

      case 'units-of-production':
        // Units of Production Method
        if (!totalUnits || totalUnits <= 0) {
          return NextResponse.json({ error: 'Total units required for units of production method' }, { status: 400 });
        }
        
        const depreciationPerUnit = (cost - salvage) / totalUnits;
        let unitsUsed = unitsPerYear.length > 0 ? unitsPerYear : Array(life).fill(totalUnits / life);
        
        for (let i = 1; i <= life && i <= unitsUsed.length; i++) {
          const units = parseFloat(unitsUsed[i - 1]) || 0;
          depreciation = depreciationPerUnit * units;
          accumulatedDepreciation += depreciation;
          bookValue = cost - accumulatedDepreciation;
          
          schedule.push({
            year: i,
            units: units,
            depreciationExpense: depreciation,
            accumulatedDepreciation,
            bookValue: Math.max(bookValue, salvage)
          });
        }
        break;

      case 'macrs-5year':
        // MACRS 5-Year Property (Common for computers, vehicles, etc.)
        const macrs5Rates = [0.20, 0.32, 0.192, 0.1152, 0.1152, 0.0576];
        const depreciableBase = cost; // MACRS doesn't consider salvage value
        
        for (let i = 1; i <= Math.min(6, life); i++) {
          depreciation = depreciableBase * macrs5Rates[i - 1];
          accumulatedDepreciation += depreciation;
          bookValue = cost - accumulatedDepreciation;
          
          schedule.push({
            year: i,
            depreciationExpense: depreciation,
            accumulatedDepreciation,
            bookValue: Math.max(bookValue, 0)
          });
        }
        break;

      case 'macrs-7year':
        // MACRS 7-Year Property (Office furniture, agricultural machinery)
        const macrs7Rates = [0.1429, 0.2449, 0.1749, 0.1249, 0.0893, 0.0892, 0.0893, 0.0446];
        const depreciableBase7 = cost;
        
        for (let i = 1; i <= Math.min(8, life); i++) {
          depreciation = depreciableBase7 * macrs7Rates[i - 1];
          accumulatedDepreciation += depreciation;
          bookValue = cost - accumulatedDepreciation;
          
          schedule.push({
            year: i,
            depreciationExpense: depreciation,
            accumulatedDepreciation,
            bookValue: Math.max(bookValue, 0)
          });
        }
        break;

      default:
        return NextResponse.json({ error: 'Invalid depreciation method' }, { status: 400 });
    }

    const currentYearData = schedule[year - 1] || schedule[schedule.length - 1];

    return NextResponse.json({
      method,
      assetCost: cost,
      salvageValue: salvage,
      usefulLife: life,
      currentYear: year,
      currentYearDepreciation: currentYearData.depreciationExpense,
      accumulatedDepreciation: currentYearData.accumulatedDepreciation,
      bookValue: currentYearData.bookValue,
      schedule
    });

  } catch (error) {
    console.error('Calculation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({ status: 'OK', message: 'Tax Depreciation Calculator API is running' });
}