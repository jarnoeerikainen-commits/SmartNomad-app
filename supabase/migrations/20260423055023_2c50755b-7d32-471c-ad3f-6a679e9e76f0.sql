
INSERT INTO public.per_diem_rates (country_code, country_name, city, year, effective_from, lodging_rate, meals_rate, incidentals_rate, currency, source, source_url, notes) VALUES
('US','United States',NULL,2025,'2024-10-01',110,68,5,'USD','GSA CONUS','https://www.gsa.gov/travel/plan-book/per-diem-rates','Standard CONUS rate FY2025'),
('US','United States','New York',2025,'2024-10-01',295,92,5,'USD','GSA CONUS','https://www.gsa.gov/travel/plan-book/per-diem-rates','NYC FY2025'),
('US','United States','San Francisco',2025,'2024-10-01',295,92,5,'USD','GSA CONUS','https://www.gsa.gov/travel/plan-book/per-diem-rates','SF FY2025'),
('US','United States','Washington',2025,'2024-10-01',257,86,5,'USD','GSA CONUS','https://www.gsa.gov/travel/plan-book/per-diem-rates','DC FY2025'),
('GB','United Kingdom','London',2025,'2025-01-01',0,25,0,'GBP','HMRC scale rates','https://www.gov.uk/hmrc-internal-manuals/employment-income-manual/eim05231','HMRC benchmark scale rate (10h+)'),
('GB','United Kingdom',NULL,2025,'2025-01-01',0,25,0,'GBP','HMRC scale rates','https://www.gov.uk/hmrc-internal-manuals/employment-income-manual/eim05231','HMRC benchmark (10h+)'),
('DE','Germany',NULL,2025,'2025-01-01',0,28,0,'EUR','BMF Reisekosten','https://www.bundesfinanzministerium.de/Web/DE/Themen/Steuern/Steuerarten/Lohnsteuer/Reisekosten/reisekosten.html','Domestic full-day Verpflegungspauschale 2025'),
('DE','Germany',NULL,2024,'2024-01-01',0,28,0,'EUR','BMF Reisekosten','https://www.bundesfinanzministerium.de/Web/DE/Themen/Steuern/Steuerarten/Lohnsteuer/Reisekosten/reisekosten.html','Domestic full-day 2024'),
('FR','France','Paris',2025,'2025-01-01',110,20,0,'EUR','URSSAF','https://www.urssaf.fr/portail/home/employeur/calculer-les-cotisations/les-elements-a-prendre-en-compte/les-frais-professionnels.html','URSSAF 2025 lodging Paris'),
('FI','Finland',NULL,2025,'2025-01-01',0,51,0,'EUR','Vero (Finnish Tax Admin)','https://www.vero.fi/en/businesses-and-corporations/taxes-and-charges/employer-contributions/expense-allowances-and-tax-exempt-reimbursements/per-diem-allowances/','Full daily allowance 2025'),
('AE','United Arab Emirates','Dubai',2025,'2025-01-01',245,132,30,'USD','US State Dept Foreign Per Diem','https://aoprals.state.gov/web920/per_diem.asp','Foreign per diem reference'),
('SG','Singapore','Singapore',2025,'2025-01-01',264,109,25,'USD','US State Dept Foreign Per Diem','https://aoprals.state.gov/web920/per_diem.asp','Foreign per diem reference'),
('JP','Japan','Tokyo',2025,'2025-01-01',305,120,25,'USD','US State Dept Foreign Per Diem','https://aoprals.state.gov/web920/per_diem.asp','Foreign per diem reference')
ON CONFLICT DO NOTHING;

INSERT INTO public.mileage_rates_official (country_code, year, rate_per_km, rate_per_mile, currency, vehicle_type, source, source_url) VALUES
('US',2025,NULL,0.70,'USD','car','IRS Standard Mileage Rate 2025','https://www.irs.gov/tax-professionals/standard-mileage-rates'),
('US',2024,NULL,0.67,'USD','car','IRS Standard Mileage Rate 2024','https://www.irs.gov/tax-professionals/standard-mileage-rates'),
('GB',2025,0.45,NULL,'GBP','car','HMRC AMAP first 10000 miles','https://www.gov.uk/expenses-and-benefits-business-travel-mileage/rules-for-tax'),
('DE',2025,0.30,NULL,'EUR','car','BMF Kilometerpauschale','https://www.bundesfinanzministerium.de/Web/DE/Themen/Steuern/Steuerarten/Lohnsteuer/Reisekosten/reisekosten.html'),
('CA',2025,0.72,NULL,'CAD','car','CRA reasonable allowance first 5000km','https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/payroll/benefits-allowances/automobile/automobile-motor-vehicle-allowances/reasonable-allowance-rates.html'),
('AU',2025,0.88,NULL,'AUD','car','ATO cents per kilometre 2024-25','https://www.ato.gov.au/individuals-and-families/income-deductions-offsets-and-records/deductions-you-can-claim/cars-transport-and-travel/car-expenses/cents-per-kilometre-method'),
('FI',2025,0.59,NULL,'EUR','car','Vero kilometre allowance 2025','https://www.vero.fi/en/businesses-and-corporations/taxes-and-charges/employer-contributions/expense-allowances-and-tax-exempt-reimbursements/kilometre-allowance/')
ON CONFLICT DO NOTHING;

INSERT INTO public.vat_reclaim_rules (country_code, country_name, category, standard_vat_rate, reclaim_pct, business_only, conditions, source, source_url) VALUES
('GB','United Kingdom','hotel',20,100,true,'VAT-registered businesses can reclaim 100% on accommodation. Original VAT invoice required.','HMRC VAT Notice 700','https://www.gov.uk/guidance/vat-guide-notice-700'),
('GB','United Kingdom','meal',20,100,true,'Subsistence on business travel reclaimable. Entertaining clients NOT reclaimable.','HMRC VAT Notice 700/65','https://www.gov.uk/guidance/business-entertainment-notice-70065'),
('GB','United Kingdom','fuel',20,100,true,'Reclaimable on business mileage; scale charge applies for private use.','HMRC VAT Notice 700/64','https://www.gov.uk/guidance/motoring-expenses-notice-70064'),
('DE','Germany','hotel',7,100,true,'7% reduced rate on overnight stays. Reclaimable with proper invoice (Rechnung).','BZSt Vorsteuerabzug','https://www.bzst.de/EN/Businesses/VAT/InputVATRefund/inputvatrefund_node.html'),
('DE','Germany','meal',19,100,true,'Restaurant meals 19% (or 7% reduced where applicable). 70% deductible (30% non-deductible business meal portion for income tax).','BZSt Vorsteuerabzug','https://www.bzst.de/EN/Businesses/VAT/InputVATRefund/inputvatrefund_node.html'),
('FR','France','hotel',10,100,true,'10% VAT on hotels. Recoverable for business travel with proper facture.','impots.gouv.fr TVA','https://www.impots.gouv.fr/professionnel/la-tva-collectee'),
('FR','France','meal',10,100,true,'10% VAT on restaurant meals. Recoverable for business travel.','impots.gouv.fr TVA','https://www.impots.gouv.fr/professionnel/la-tva-collectee'),
('FR','France','fuel',20,80,true,'Diesel: 80% recoverable. Petrol: 80% recoverable from 2022. Tourism vehicles excluded.','impots.gouv.fr TVA','https://www.impots.gouv.fr/professionnel/la-tva-collectee'),
('NL','Netherlands','hotel',9,100,true,'9% reduced rate on accommodation. Reclaimable for business.','Belastingdienst','https://www.belastingdienst.nl/wps/wcm/connect/bldcontenten/belastingdienst/business/vat/'),
('NL','Netherlands','fuel',21,0,true,'Fuel for passenger cars NOT recoverable in Netherlands.','Belastingdienst','https://www.belastingdienst.nl/wps/wcm/connect/bldcontenten/belastingdienst/business/vat/'),
('IT','Italy','hotel',10,100,true,'10% VAT on accommodation. Reclaimable with fattura elettronica.','Agenzia delle Entrate','https://www.agenziaentrate.gov.it/portale/web/english/nse/business/vat-in-italy'),
('IT','Italy','meal',10,100,true,'10% VAT on meals. Reclaimable for business with proper invoice.','Agenzia delle Entrate','https://www.agenziaentrate.gov.it/portale/web/english/nse/business/vat-in-italy'),
('ES','Spain','hotel',10,100,true,'10% IVA on accommodation. Reclaimable with factura.','Agencia Tributaria','https://sede.agenciatributaria.gob.es/Sede/iva.html'),
('ES','Spain','meal',10,100,true,'10% IVA on restaurant meals. Reclaimable for business.','Agencia Tributaria','https://sede.agenciatributaria.gob.es/Sede/iva.html'),
('FI','Finland','hotel',10,100,true,'10% VAT on accommodation. Reclaimable for VAT-registered businesses.','Vero','https://www.vero.fi/en/businesses-and-corporations/taxes-and-charges/vat/'),
('FI','Finland','meal',14,100,true,'14% VAT on restaurant meals. Reclaimable for business with receipt.','Vero','https://www.vero.fi/en/businesses-and-corporations/taxes-and-charges/vat/'),
('AE','United Arab Emirates','hotel',5,100,true,'5% VAT introduced 2018. Reclaimable for VAT-registered businesses.','FTA UAE','https://tax.gov.ae/en/taxes/vat.aspx'),
('SG','Singapore','hotel',9,100,true,'9% GST. Reclaimable by GST-registered businesses.','IRAS Singapore','https://www.iras.gov.sg/taxes/goods-services-tax-(gst)'),
('US','United States','hotel',0,0,true,'No federal VAT in US. State sales taxes generally NOT recoverable by foreign businesses.','IRS','https://www.irs.gov/businesses/small-businesses-self-employed/sales-tax-deduction-calculator')
ON CONFLICT DO NOTHING;
