# Leases Management Insights System

Node.js backend for leases data processing and insights generation.
The current insights are Expiring leases and extreme vacancy.

## Setup

```bash

# Setup Using Docker:
docker build -t leases_insights .
docker run -p 3000:3000 leases_insights
```

# API Documentation
### Uplodad CSV File
POST /api/upload
Content-Type: multipart/form-data

### GET Expiring Leases
GET /api/insights/expiring-leases

Example Response:
```
[
  {
    "property_id": 1,
    "expiring_leases": [
      {
        "lease_id": 123,
        "unit_id": 456,
        "tenant_id": 789,
        "start_date": "2024-01-01",
        "end_date": "2024-02-01"
      }
    ]
  }
]
```

### GET Extreme Vacancy
GET /api/insights/extreme-vacancy

Example Response:
```
[
    {
        "unit_id": 88,
        "vacancy_days": 65,
        "property_id": 10,
        "unit_number": "Unit_88",
        "size": 694,
        "type": "Residential"
    }
]
```



