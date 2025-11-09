// ExchangeRate-API Service

const EXCHANGE_RATE_API_KEY = '427b1b51ec76ca84f5ddd12f';

export interface ExchangeRates {
  base: string;
  rates: { [currency: string]: number };
  lastUpdated: Date;
}

export async function getExchangeRates(baseCurrency: string = 'USD'): Promise<ExchangeRates> {
  try {
    const response = await fetch(
      `https://v6.exchangerate-api.com/v6/${EXCHANGE_RATE_API_KEY}/latest/${baseCurrency}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch exchange rates');
    }

    const data = await response.json();

    return {
      base: baseCurrency,
      rates: data.conversion_rates,
      lastUpdated: new Date(data.time_last_update_unix * 1000),
    };
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    // Fallback to default rates
    return {
      base: baseCurrency,
      rates: {
        USD: 1,
        EUR: 0.92,
        GBP: 0.79,
        JPY: 149.5,
        AUD: 1.53,
        CAD: 1.36,
        INR: 83.12,
      },
      lastUpdated: new Date(),
    };
  }
}

export async function convertCurrency(
  amount: number,
  from: string,
  to: string
): Promise<number> {
  try {
    const response = await fetch(
      `https://v6.exchangerate-api.com/v6/${EXCHANGE_RATE_API_KEY}/pair/${from}/${to}/${amount}`
    );

    if (!response.ok) {
      throw new Error('Failed to convert currency');
    }

    const data = await response.json();
    return data.conversion_result;
  } catch (error) {
    console.error('Error converting currency:', error);
    // Fallback calculation
    const rates = await getExchangeRates(from);
    return amount * (rates.rates[to] || 1);
  }
}

export function formatCurrency(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  } catch (error) {
    return `${currency} ${amount.toFixed(2)}`;
  }
}
