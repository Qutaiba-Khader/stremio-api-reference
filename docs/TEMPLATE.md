# Endpoint Name

## Overview

Brief description of what this endpoint does and when to use it.

## HTTP Method

```
GET | POST | PUT | DELETE
```

## URL

```
https://api.strem.io/path/to/endpoint
```

## Headers

| Header         | Value              | Required |
|----------------|--------------------|----------|
| Content-Type   | application/json   | Yes      |
| Authorization  | Bearer {token}     | Yes      |

## Request Body

```json
{
  "key": "value"
}
```

| Field | Type   | Required | Description          |
|-------|--------|----------|----------------------|
| key   | string | Yes      | Description of field |

## Response

**Success (200)**

```json
{
  "result": {}
}
```

**Error**

```json
{
  "error": "error message"
}
```

## Example (curl)

```bash
curl -X POST "https://api.strem.io/path/to/endpoint" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "key": "value"
  }'
```

## Notes

- Any caveats, rate limits, or special behavior.
- Related endpoints or dependencies.
