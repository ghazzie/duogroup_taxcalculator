export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  // Simple test for GET
  if (request.method === 'GET') {
    return new Response(JSON.stringify({ 
      message: 'API is working! Use POST to calculate depreciation.' 
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  // Handle POST for calculation
  if (request.method === 'POST') {
    try {
      const body = await request.json();
      const { assetCost, salvageValue, usefulLife, method = 'straight-line' } = body;

      const cost = parseFloat(assetCost);
      const salvage = parseFloat(salvageValue);
      const life = parseInt(usefulLife);

      if (cost <= 0 || salvage < 0 || life <= 0 || salvage > cost) {
        return new Response(JSON.stringify({ 
          error: 'Invalid values. Ensure asset cost > salvage value.' 
        }), {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });
      }

      // Simple straight-line calculation for testing
      const depreciation = (cost - salvage) / life;
      const result = {
        method,
        assetCost: cost,
        salvageValue: salvage,
        usefulLife: life,
        currentYearDepreciation: depreciation,
        accumulatedDepreciation: depreciation,
        bookValue: cost - depreciation,
        schedule: []
      };

      return new Response(JSON.stringify(result), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Invalid request' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }
  }

  return new Response('Method not allowed', { status: 405 });
}