# Air Quality WAQI (air-quality)

## Secrets
- `WAQI_TOKEN`

## Endpoints
- `GET https://api.waqi.info/feed/geo:{lat};{lon}/?token={WAQI_TOKEN}`
- `GET https://api.waqi.info/feed/{city}/?token={WAQI_TOKEN}`

Response: `{ status, data: { aqi, idx, attributions, city, iaqi: { pm25, pm10, o3, ... }, time } }`

## Caching
Per memory: 10-min TTL.

## Demo→Live diff
```ts
await callProvider({
  integrationKey: "air-quality",
  providerId: "waqi",
  demo: () => ({ aqi: 42, city: "Demo", source: "demo" }),
  live: async ({ secrets, fetch }) => {
    const r = await fetch(`https://api.waqi.info/feed/geo:${lat};${lon}/?token=${secrets.WAQI_TOKEN}`);
    return (await r.json()).data;
  },
});
```
