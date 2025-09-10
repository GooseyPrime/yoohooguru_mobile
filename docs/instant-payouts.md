# Stripe Instant Payouts

This document describes the Stripe Instant Payouts functionality implemented for yoohoo.guru.

## Overview

The instant payouts feature allows connected Stripe accounts to receive funds immediately rather than waiting for the standard payout schedule. This is implemented using Stripe's instant payout capability.

## API Endpoints

### Check Account Balance
```
GET /api/connect/balance
Authorization: Bearer <token>
```

Returns the account balance including instant available amounts:

```json
{
  "ok": true,
  "accountId": "acct_1234567890",
  "balance": {
    "available": [{"amount": 5000, "currency": "usd"}],
    "pending": [{"amount": 1000, "currency": "usd"}],
    "instant_available": {
      "amount": 4500,
      "currency": "usd", 
      "net_available": 4300
    },
    "connect_reserved": [{"amount": 500, "currency": "usd"}],
    "livemode": false
  }
}
```

### Create Instant Payout
```
POST /api/connect/instant-payout
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 25.00,
  "currency": "usd"
}
```

Creates an instant payout and returns details:

```json
{
  "ok": true,
  "payout": {
    "id": "po_1234567890",
    "amount": 2500,
    "currency": "usd",
    "status": "in_transit",
    "method": "instant",
    "arrival_date": 1234567890,
    "fees": [{"amount": 25, "currency": "usd", "type": "stripe_fee"}]
  }
}
```

## Implementation Details

### Account Setup
- Express accounts are created with manual payout schedule to enable instant payouts
- Accounts must have `payouts_enabled`, `charges_enabled`, and `details_submitted` set to true
- The `payouts_ready` flag in the user profile indicates readiness for payouts

### Balance Checking
- Uses Stripe's balance API with `instant_available.net_available` expansion
- Matches the cURL structure specified in the requirements:
  ```bash
  curl https://api.stripe.com/v1/balance \
    -u "{{SECRET_KEY}}" \
    -H "Stripe-Account: {{CONNECTED_ACCOUNT_ID}}" \
    -d "expand[]"="instant_available.net_available"
  ```

### Error Handling
- Validates account existence and readiness
- Handles Stripe API errors gracefully with appropriate HTTP status codes
- Returns descriptive error messages for common scenarios

### Security
- Requires user authentication for all endpoints
- Validates account ownership through user profile linking
- Respects Stripe's security model for connected accounts

## Testing

The functionality is thoroughly tested with 10 test cases covering:
- Balance retrieval with instant available expansion
- Instant payout creation with various scenarios
- Error handling for missing accounts, invalid amounts, and Stripe errors
- Account creation with proper instant payout settings

Run tests with:
```bash
npm test -- tests/instant-payouts.test.js
```

## Requirements

- Stripe account with instant payouts enabled
- Connected Express accounts with completed onboarding
- Sufficient account balance for instant payouts
- Account must be ready for payouts (all verification complete)