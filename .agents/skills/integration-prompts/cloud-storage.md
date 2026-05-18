# Cloud Storage (cloud-storage)

## Secrets (pick one)
- AWS S3: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_S3_BUCKET`
- Cloudflare R2: `R2_ACCESS_KEY`, `R2_SECRET`, `R2_BUCKET` (S3-compatible)

## Security
**Client must encrypt before upload (AES-256-GCM per `secureStorage.ts`).**
Server stores ciphertext only — zero-knowledge.

## Activation prompt
> Activate R2 (cheaper egress). Create `vault-blob-upload` edge function that takes a pre-encrypted blob + key derivation hint, returns signed URL. Frontend `FamilyVaultService` + `SnomadVaultService` consume it.
