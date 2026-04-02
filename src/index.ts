/**
 * Zippopotam MCP — wraps Zippopotam.us ZIP/postal code API (free, no auth)
 *
 * Tools:
 * - lookup_zipcode: Get place info for a ZIP/postal code in a given country
 * - lookup_city: Get postal codes for a city in a given country and state/province
 */

interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
}

const BASE_URL = 'https://api.zippopotam.us';

type RawPlace = {
  'place name': string;
  longitude: string;
  state: string;
  'state abbreviation': string;
  latitude: string;
};

type RawZipcodeResponse = {
  'post code': string;
  country: string;
  'country abbreviation': string;
  places: RawPlace[];
};

type RawCityResponse = {
  country: string;
  'country abbreviation': string;
  state: string;
  'state abbreviation': string;
  places: Array<RawPlace & { 'post code': string }>;
};

function formatPlace(p: RawPlace) {
  return {
    name: p['place name'],
    state: p.state,
    state_abbreviation: p['state abbreviation'],
    lat: parseFloat(p.latitude),
    lon: parseFloat(p.longitude),
  };
}

const tools: McpToolExport['tools'] = [
  {
    name: 'lookup_zipcode',
    description:
      'Look up place information (city, state, coordinates) for a ZIP or postal code in a given country.',
    inputSchema: {
      type: 'object',
      properties: {
        country: {
          type: 'string',
          description: 'ISO 3166-1 alpha-2 country code (e.g. "us", "gb", "de").',
        },
        zipcode: {
          type: 'string',
          description: 'ZIP or postal code to look up (e.g. "90210").',
        },
      },
      required: ['country', 'zipcode'],
    },
  },
  {
    name: 'lookup_city',
    description:
      'Get all postal codes for a city in a given country and state/province.',
    inputSchema: {
      type: 'object',
      properties: {
        country: {
          type: 'string',
          description: 'ISO 3166-1 alpha-2 country code (e.g. "us", "gb").',
        },
        state: {
          type: 'string',
          description: 'State or province abbreviation (e.g. "ca" for California).',
        },
        city: {
          type: 'string',
          description: 'City name (e.g. "beverly+hills" or "beverly hills").',
        },
      },
      required: ['country', 'state', 'city'],
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'lookup_zipcode':
      return lookupZipcode(args.country as string, args.zipcode as string);
    case 'lookup_city':
      return lookupCity(args.country as string, args.state as string, args.city as string);
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

async function lookupZipcode(country: string, zipcode: string) {
  const res = await fetch(`${BASE_URL}/${encodeURIComponent(country)}/${encodeURIComponent(zipcode)}`);
  if (!res.ok) throw new Error(`Zippopotam API error: ${res.status}`);

  const data = (await res.json()) as RawZipcodeResponse;
  return {
    post_code: data['post code'],
    country: data.country,
    country_abbreviation: data['country abbreviation'],
    places: data.places.map(formatPlace),
  };
}

async function lookupCity(country: string, state: string, city: string) {
  const citySlug = city.trim().toLowerCase().replace(/\s+/g, '+');
  const res = await fetch(
    `${BASE_URL}/${encodeURIComponent(country)}/${encodeURIComponent(state)}/${citySlug}`,
  );
  if (!res.ok) throw new Error(`Zippopotam API error: ${res.status}`);

  const data = (await res.json()) as RawCityResponse;
  return {
    country: data.country,
    country_abbreviation: data['country abbreviation'],
    state: data.state,
    state_abbreviation: data['state abbreviation'],
    places: data.places.map((p) => ({
      post_code: p['post code'],
      ...formatPlace(p),
    })),
  };
}

export default { tools, callTool } satisfies McpToolExport;
