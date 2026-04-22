---
name: Family Vault — multi-member household
description: Encrypted Family tab in Profile lets users manage unlimited dependents (spouse, kids, elderly, special-needs wards) with per-person passports, visas, vaccinations and expiry alerts (90/30/7 day windows + expired).
type: feature
---
Storage key: `sn_family_vault_enc_v1` (AES-256-GCM via secureStorage).
Service: `src/services/FamilyVaultService.ts` exposes `familyVault.{list,upsert,remove,addPassport,addVisa,addVaccination,...}` and `buildAlerts()`.
Types: `src/types/familyMember.ts` — `RelationshipType` (self/spouse/child/infant/parent/grandparent/ward/caregiver_dependent/...), `CareLevel` (independent/assisted/full_care/medical_complex).
UI: `src/components/FamilyVault.tsx` — accordion of members + per-member passport/visa/vaccination lists + member editor dialog. Surfaces `FamilyExpiryAlerts` banner at top.
Mounted as new "Family" tab in `src/components/sections/ProfileSection.tsx` (now 7 tabs).
Yellow Fever / ICVP gets a country-entry-requirement-specific action hint. Passports 30-180 days from expiry get the "6 months validity" warning.
