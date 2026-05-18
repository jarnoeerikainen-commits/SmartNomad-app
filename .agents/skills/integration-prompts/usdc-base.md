# USDC on Base — Affiliate Payouts (usdc-base)

## Secrets
- `CDP_API_KEY`, `CDP_API_SECRET` (Coinbase Developer Platform)

## Flow
Create wallet → fund → on payout request, call `wallet.send` with USDC contract
on Base mainnet → confirmation tx hash stored on `affiliate_payouts.tx_hash`.

## Activation prompt
> Wire into `affiliate-router`. On `request_affiliate_payout` rpc returning `payout_id`, send USDC to user's wallet via CDP SDK; on confirmation, mark payout `status=paid` and store tx hash.
