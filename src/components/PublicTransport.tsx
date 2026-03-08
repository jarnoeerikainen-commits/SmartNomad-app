import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Train, Bus, MapPin, ExternalLink, Search, Navigation, Plane, Cable, Ship, Tram } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

type TransportType = 'metro' | 'bus' | 'tram' | 'train' | 'airport' | 'cablecar' | 'ferry' | 'combined';

interface TransportOption {
  type: TransportType;
  name: string;
  coverage: string;
  ticketUrl: string;
  mobileApp?: string;
  priceRange: string;
  features: string[];
}

interface CityTransport {
  city: string;
  country: string;
  countryCode: string;
  options: TransportOption[];
}

// Helper to generate standard city transport entries efficiently
const city = (
  cityName: string, country: string, countryCode: string,
  options: TransportOption[]
): CityTransport => ({ city: cityName, country, countryCode, options });

const opt = (
  type: TransportType, name: string, coverage: string,
  ticketUrl: string, priceRange: string, features: string[],
  mobileApp?: string
): TransportOption => ({ type, name, coverage, ticketUrl, priceRange, features, mobileApp });

const publicTransportData: CityTransport[] = [
  // ===== EUROPE =====
  city('London', 'United Kingdom', 'GB', [
    opt('combined', 'Transport for London (TfL)', 'Underground, Overground, DLR, buses, trams, Elizabeth line', 'https://tfl.gov.uk/fares', '£2.80-£7.70', ['Oyster Card', 'Contactless', 'Day caps', 'Night Tube'], 'TfL Go'),
    opt('airport', 'Heathrow Express', 'Heathrow Airport ↔ Paddington in 15 min', 'https://www.heathrowexpress.com/', '£25 single', ['Express service', 'Free WiFi', 'Business First class'], 'Heathrow Express'),
    opt('airport', 'Gatwick Express', 'Gatwick Airport ↔ Victoria in 30 min', 'https://www.gatwickexpress.com/', '£19.90 single', ['Direct service', 'Free WiFi', 'Frequent departures']),
    opt('cablecar', 'Emirates Air Line', 'Cable car across Thames: Greenwich ↔ Royal Docks', 'https://tfl.gov.uk/modes/emirates-air-line/', '£5.00 single', ['River crossing', 'Scenic views', 'Oyster accepted']),
    opt('ferry', 'Thames Clippers', 'River bus service along Thames', 'https://www.thamesclippers.com/', '£4.50-£8.80', ['Scenic route', 'Contactless', 'Oyster accepted', 'Commuter service']),
  ]),
  city('Paris', 'France', 'FR', [
    opt('combined', 'RATP', 'Metro (16 lines), RER, buses, trams', 'https://www.ratp.fr/en/titres-et-tarifs', '€2.15-€5.00', ['Navigo Pass', 'Mobile tickets', 'Tourist passes', 'Night buses'], 'RATP'),
    opt('airport', 'Orlyval / RER B', 'CDG & Orly airport connections', 'https://www.parisaeroport.fr/en/passengers/access/paris-charles-de-gaulle/public-transport', '€11.45-€13.00', ['Direct to terminals', 'RER connections', 'Frequent service']),
    opt('tram', 'Île-de-France Tramway', '10 tram lines across Greater Paris', 'https://www.ratp.fr/en/vivre-le-reseau/le-tramway', '€2.15', ['Modern fleet', 'Integrated tickets', 'Accessible']),
  ]),
  city('Berlin', 'Germany', 'DE', [
    opt('combined', 'BVG', 'U-Bahn, S-Bahn, buses, trams, ferries', 'https://www.bvg.de/en/subscriptions-and-tickets', '€3.20-€8.80', ['Berlin WelcomeCard', 'Group tickets', 'Night services', '€49 ticket'], 'BVG Fahrinfo Plus'),
    opt('airport', 'FEX / S-Bahn', 'BER Airport ↔ City Center', 'https://www.berlin-airport.de/en/travellers-ber/to-and-from/train/', '€3.80', ['Airport Express FEX', 'S-Bahn S9/S45', 'Direct to Hauptbahnhof']),
    opt('tram', 'Berlin Tram', '22 tram lines, largest network in Germany', 'https://www.bvg.de/', '€3.20', ['Historic routes', 'Night trams', 'East Berlin coverage']),
  ]),
  city('Amsterdam', 'Netherlands', 'NL', [
    opt('combined', 'GVB', 'Trams, buses, metro, ferries', 'https://reisproducten.gvb.nl/en', '€3.40-€8.50', ['OV-chipkaart', 'Tourist day passes', 'Free ferries', 'Night buses'], 'GVB'),
    opt('airport', 'NS Sprinter', 'Schiphol ↔ Amsterdam Centraal in 15 min', 'https://www.ns.nl/en', '€5.70', ['Frequent trains', 'OV-chip accepted', 'Direct service']),
  ]),
  city('Madrid', 'Spain', 'ES', [
    opt('combined', 'Metro de Madrid / EMT', 'Metro (13 lines), buses, light rail', 'https://www.metromadrid.es/en', '€1.50-€5.00', ['Multi Card', '10-journey tickets', 'Tourist passes', 'Night buses'], 'Metro de Madrid'),
    opt('airport', 'Metro Line 8', 'Barajas Airport ↔ Nuevos Ministerios', 'https://www.metromadrid.es/', '€4.50-€5.00', ['Airport supplement', 'Direct connection', '12 min ride']),
    opt('cablecar', 'Teleférico de Madrid', 'Cable car: Paseo del Pintor Rosales ↔ Casa de Campo', 'https://teleferico.emtmadrid.es/', '€6.00', ['Scenic views', 'Park access', 'Historic attraction']),
  ]),
  city('Barcelona', 'Spain', 'ES', [
    opt('combined', 'TMB', 'Metro (12 lines), buses, trams, funicular', 'https://www.tmb.cat/en/barcelona-fares-metro-bus', '€2.55-€11.35', ['T-casual card', 'Hola Barcelona pass', 'Night buses'], 'TMB App'),
    opt('airport', 'Aerobus', 'El Prat Airport ↔ Plaça Catalunya', 'https://www.aerobusbcn.com/', '€7.75', ['Every 5 min', 'WiFi on board', 'Direct service']),
    opt('cablecar', 'Telefèric de Montjuïc', 'Cable car to Montjuïc hill', 'https://www.telefericdemontjuic.cat/', '€13.50', ['Panoramic views', 'Castle access', 'Round trips']),
    opt('tram', 'TRAM Barcelona', 'Trambaix & Trambesòs networks', 'https://www.tram.cat/', '€2.55', ['Integrated tickets', 'Modern fleet', 'Coastal routes']),
  ]),
  city('Rome', 'Italy', 'IT', [
    opt('combined', 'ATAC', 'Metro (3 lines), buses, trams', 'https://www.atac.roma.it/en/tickets-and-passes', '€1.50-€7.00', ['Roma Pass', 'Daily/weekly tickets', 'Night buses'], 'MuoviRoma'),
    opt('airport', 'Leonardo Express', 'Fiumicino ↔ Termini in 32 min', 'https://www.trenitalia.com/', '€14.00', ['Non-stop express', 'Every 15 min', 'Comfortable seating']),
  ]),
  city('Milan', 'Italy', 'IT', [
    opt('combined', 'ATM Milano', 'Metro (5 lines), trams, buses, trolleybuses', 'https://www.atm.it/en', '€2.20', ['Contactless', 'Day passes', 'Historic trams'], 'ATM Milano'),
    opt('airport', 'Malpensa Express', 'Malpensa ↔ Milano Centrale', 'https://www.malpensaexpress.it/en/', '€13.00', ['Express train', 'Every 30 min', 'WiFi']),
  ]),
  city('Vienna', 'Austria', 'AT', [
    opt('combined', 'Wiener Linien', 'U-Bahn (5 lines), trams, buses', 'https://www.wienerlinien.at/tickets', '€2.60-€5.80', ['Vienna Card', 'Weekly passes', 'Night services'], 'WienMobil'),
    opt('airport', 'City Airport Train (CAT)', 'Vienna Airport ↔ Wien Mitte in 16 min', 'https://www.cityairporttrain.com/', '€14.90', ['Express service', 'City check-in', 'Free WiFi']),
  ]),
  city('Prague', 'Czech Republic', 'CZ', [
    opt('combined', 'DPP', 'Metro (3 lines), trams (34 lines), buses, funicular', 'https://www.dpp.cz/en/fares', '€1.20-€5.30', ['Prague Card', 'Night trams', 'Historic trams'], 'PID Lítačka'),
    opt('cablecar', 'Petřín Funicular', 'Funicular railway to Petřín Hill', 'https://www.dpp.cz/', '€1.20', ['Scenic views', 'Integrated ticket', 'Tower access']),
  ]),
  city('Lisbon', 'Portugal', 'PT', [
    opt('combined', 'Carris / Metro de Lisboa', 'Metro (4 lines), trams, buses, funiculars', 'https://www.metrolisboa.pt/en', '€1.50-€6.80', ['Viva Viagem card', 'Historic trams', 'Ferry connections'], 'Viva Viagem'),
    opt('airport', 'Metro Red Line', 'Lisbon Airport ↔ City Center', 'https://www.metrolisboa.pt/', '€1.50', ['Direct metro', 'Frequent service', 'Viva Viagem accepted']),
    opt('cablecar', 'Elevador da Glória / Bica', 'Historic funiculars through Alfama & Bairro Alto', 'https://www.carris.pt/', '€3.80', ['UNESCO heritage', 'Iconic transport', 'Tourist favorite']),
  ]),
  city('Budapest', 'Hungary', 'HU', [
    opt('combined', 'BKK', 'Metro (4 lines), trams, buses, trolleybuses, suburban railway', 'https://bkk.hu/en/tickets-and-passes/', '€1.20-€5.50', ['Budapest Card', 'Night services', 'River crossing'], 'BudapestGO'),
    opt('cablecar', 'Budavári Sikló', 'Funicular: Clark Ádám tér ↔ Buda Castle', 'https://bkk.hu/', '€4.50', ['Castle access', 'Historic funicular', 'Panoramic views']),
    opt('ferry', 'BKK Ferry (D11/D12)', 'Danube river services', 'https://bkk.hu/', '€1.20', ['Scenic commute', 'BKK pass valid', 'Multiple stops']),
  ]),
  city('Warsaw', 'Poland', 'PL', [
    opt('combined', 'ZTM Warsaw', 'Metro (2 lines), trams, buses', 'https://www.ztm.waw.pl/en', '€1.00-€4.50', ['City Card', '20-min tickets', 'Night buses'], 'moBILET'),
  ]),
  city('Zurich', 'Switzerland', 'CH', [
    opt('combined', 'ZVV', 'S-Bahn, trams, buses, boats', 'https://www.zvv.ch/en', 'CHF 4.40-8.80', ['ZVV Pass', 'Lake boats included', 'Punctual service'], 'ZVV'),
    opt('cablecar', 'Felsenegg Cable Car', 'Adliswil ↔ Felsenegg panoramic cable car', 'https://www.laf.ch/', 'CHF 8.00', ['Lake views', 'Hiking access', 'ZVV integrated']),
  ]),
  city('Munich', 'Germany', 'DE', [
    opt('combined', 'MVV', 'U-Bahn, S-Bahn, buses, trams', 'https://www.mvv-muenchen.de/en', '€3.70-€9.00', ['Day tickets', 'Airport S-Bahn', 'Bayern ticket'], 'MVV'),
    opt('airport', 'S-Bahn S1/S8', 'Munich Airport ↔ City Center', 'https://www.mvv-muenchen.de/', '€13.60', ['Every 20 min', '40 min ride', 'Hauptbahnhof direct']),
  ]),
  city('Stockholm', 'Sweden', 'SE', [
    opt('combined', 'SL', 'Tunnelbana, commuter rail, buses, trams, ferries', 'https://sl.se/en/in-english', 'SEK 39-59', ['SL Access card', 'Djurgården ferry', '75 min transfers'], 'SL'),
    opt('airport', 'Arlanda Express', 'Arlanda Airport ↔ Stockholm Central in 20 min', 'https://www.arlandaexpress.com/', 'SEK 299', ['Express train', 'Free WiFi', 'Onboard info screens']),
  ]),
  city('Copenhagen', 'Denmark', 'DK', [
    opt('combined', 'DOT', 'Metro (4 lines), S-tog, buses', 'https://dinoffentligetransport.dk/en', 'DKK 24-48', ['Rejsekort', 'City Pass', '24/7 metro'], 'DOT Tickets'),
    opt('airport', 'Metro M2', 'Copenhagen Airport ↔ City in 15 min', 'https://intl.m.dk/', 'DKK 38', ['Driverless metro', 'Every 4 min', '24/7 service']),
  ]),
  city('Oslo', 'Norway', 'NO', [
    opt('combined', 'Ruter', 'T-bane, trams, buses, ferries', 'https://ruter.no/en/', 'NOK 40-70', ['Ruter app tickets', 'Island ferries', 'Night services'], 'Ruter'),
    opt('airport', 'Flytoget', 'Gardermoen Airport ↔ Oslo Central in 19 min', 'https://flytoget.no/en/', 'NOK 220', ['Express train', 'Free WiFi', 'Every 10 min']),
  ]),
  city('Helsinki', 'Finland', 'FI', [
    opt('combined', 'HSL', 'Metro, trams, buses, commuter rail, ferries', 'https://www.hsl.fi/en', '€3.10-€5.70', ['HSL Card', 'Suomenlinna ferry', 'Day tickets'], 'HSL'),
    opt('airport', 'Ring Rail Line (P/I)', 'Helsinki-Vantaa ↔ Central in 30 min', 'https://www.hsl.fi/', '€4.10', ['Commuter train', 'Frequent service', 'HSL ticket']),
  ]),
  city('Dublin', 'Ireland', 'IE', [
    opt('combined', 'Dublin Bus / Luas / DART', 'Buses, light rail (Luas), suburban rail (DART)', 'https://www.transportforireland.ie/', '€2.00-€3.80', ['Leap Card', 'Daily caps', 'Coastal DART'], 'TFI Live'),
    opt('airport', 'Dublin Express', 'Dublin Airport ↔ City Center', 'https://www.dublinexpress.ie/', '€7.00', ['Every 15 min', 'Direct service', 'WiFi']),
  ]),
  city('Athens', 'Greece', 'GR', [
    opt('combined', 'OASA', 'Metro (3 lines), trams, buses, trolleybuses', 'https://www.oasa.gr/', '€1.20-€9.00', ['Ath.ena card', 'Tourist tickets', 'Airport metro'], 'OASA Telematics'),
    opt('airport', 'Metro Line 3', 'Athens Airport ↔ Syntagma in 40 min', 'https://www.stasy.gr/', '€9.00', ['Direct metro', 'Every 30 min', 'Tourist discount']),
  ]),
  city('Istanbul', 'Turkey', 'TR', [
    opt('combined', 'IETT / Metro Istanbul', 'Metro (9 lines), trams, buses, ferries, funiculars', 'https://www.iett.istanbul/', '₺15-30', ['Istanbulkart', 'Bosphorus ferries', 'Historic tram', 'Metrobus BRT'], 'Istanbul Metro'),
    opt('airport', 'Havaist / Metro M11', 'Istanbul Airport ↔ City Center', 'https://www.hfrth.gov.tr/', '₺100-150', ['Airport bus', 'Metro M11', 'Multiple stops']),
    opt('cablecar', 'Tünel & Eyüp Teleferik', 'Historic Tünel funicular & Eyüp cable car', 'https://www.iett.istanbul/', '₺15', ['Oldest metro in continental Europe', 'Istanbulkart accepted', 'Golden Horn views']),
    opt('ferry', 'Şehir Hatları', 'Bosphorus ferry services', 'https://www.sehirhatlari.istanbul/', '₺15-65', ['Cross-continental commute', 'Bosphorus tour', 'Istanbulkart accepted']),
  ]),
  city('Moscow', 'Russia', 'RU', [
    opt('combined', 'Moscow Metro', 'Metro (15 lines), MCC, MCD, buses, trams', 'https://mosmetro.ru/en/', '₽57', ['Troika card', 'Beautiful stations', '24/7 MCC ring', 'Free WiFi'], 'Moscow Metro'),
    opt('airport', 'Aeroexpress', 'SVO/DME/VKO airports ↔ City terminals', 'https://aeroexpress.ru/en/', '₽500', ['Express trains', 'Every 30 min', '35-45 min ride']),
  ]),
  city('Bucharest', 'Romania', 'RO', [
    opt('combined', 'STB / Metrorex', 'Metro (5 lines), trams, buses, trolleybuses', 'https://www.metrorex.ro/en', '€0.50-€2.00', ['Contactless', 'Day passes', 'Night buses'], 'InfoTB'),
  ]),
  city('Tbilisi', 'Georgia', 'GE', [
    opt('combined', 'Tbilisi Transport', 'Metro (2 lines), buses, cable cars', 'https://ttc.com.ge/', '₾1.00', ['Metromoney card', 'Cable cars', 'Very cheap'], 'TTC'),
    opt('cablecar', 'Narikala Cable Car', 'Rike Park ↔ Narikala Fortress', 'https://ttc.com.ge/', '₾2.50', ['Panoramic city views', 'Fortress access', 'Modern cabin']),
  ]),

  // ===== NORTH AMERICA =====
  city('New York', 'United States', 'US', [
    opt('combined', 'MTA', 'Subway (26 lines), buses, Staten Island Railway', 'https://new.mta.info/fares', '$2.90', ['MetroCard', 'OMNY contactless', 'Unlimited passes', '24/7 service'], 'MYmta'),
    opt('airport', 'AirTrain JFK / LaGuardia Link', 'JFK AirTrain & LGA bus connections', 'https://www.jfkairport.com/to-from-airport/air-train', '$8.25', ['AirTrain + subway', 'LaGuardia Q70 bus', 'Newark AirTrain']),
    opt('ferry', 'NYC Ferry', 'Ferry routes across 5 boroughs', 'https://www.ferry.nyc/', '$4.00', ['6 routes', 'Scenic ride', 'Bike racks', 'Free transfers']),
    opt('cablecar', 'Roosevelt Island Tramway', 'Manhattan ↔ Roosevelt Island aerial tramway', 'https://rioc.ny.gov/', '$2.90', ['OMNY accepted', 'East River views', 'Quick crossing']),
  ]),
  city('San Francisco', 'United States', 'US', [
    opt('combined', 'BART / MUNI', 'BART trains, MUNI buses/light rail, cable cars', 'https://www.bart.gov/tickets', '$2.50-$15.00', ['Clipper Card', 'Cable cars', 'Day passes'], 'MuniMobile'),
    opt('airport', 'BART Yellow Line', 'SFO ↔ Downtown in 30 min', 'https://www.bart.gov/', '$9.65', ['Direct BART', 'Every 15 min', 'Clipper accepted']),
    opt('cablecar', 'SF Cable Cars', 'Historic cable car lines (Powell-Hyde, Powell-Mason, California)', 'https://www.sfmta.com/getting-around/muni/cable-cars', '$8.00', ['National Historic Landmark', '3 routes', 'Iconic SF experience']),
    opt('ferry', 'Golden Gate Ferry / SF Bay Ferry', 'Cross-bay ferry services', 'https://www.goldengateferry.org/', '$7.50-$14.00', ['Sausalito', 'Larkspur', 'Scenic bay views']),
  ]),
  city('Los Angeles', 'United States', 'US', [
    opt('combined', 'LA Metro', 'Metro rail (6 lines), buses, BRT', 'https://www.metro.net/riding/fares/', '$1.75', ['TAP card', 'Day passes', 'Bus rapid transit'], 'Transit'),
    opt('airport', 'LAX FlyAway', 'LAX ↔ Union Station & Van Nuys', 'https://www.flylax.com/flyaway-bus', '$9.75', ['Direct bus', 'WiFi', 'Multiple stops']),
  ]),
  city('Chicago', 'United States', 'US', [
    opt('combined', 'CTA', '"L" trains (8 lines), buses', 'https://www.transitchicago.com/fares/', '$2.50', ['Ventra card', 'Day passes', '24/7 lines', 'Loop elevated'], 'Ventra'),
    opt('airport', 'CTA Blue Line', "O'Hare ↔ Downtown in 45 min", 'https://www.transitchicago.com/', '$5.00', ['24/7 service', 'Direct to Loop', 'Ventra accepted']),
  ]),
  city('Washington DC', 'United States', 'US', [
    opt('combined', 'WMATA', 'Metro (6 lines), Metrobus', 'https://www.wmata.com/fares/', '$2.25-$6.00', ['SmarTrip card', 'Day passes', 'Rush hour pricing'], 'SmarTrip'),
    opt('airport', 'Metro Silver Line', 'Dulles Airport ↔ DC (Silver Line ext.)', 'https://www.wmata.com/', '$6.00', ['New Silver Line ext', 'Reagan National metro', 'Direct service']),
  ]),
  city('Toronto', 'Canada', 'CA', [
    opt('combined', 'TTC', 'Subway (4 lines), streetcars, buses', 'https://www.ttc.ca/Fares-and-passes', 'CAD $3.35', ['PRESTO card', 'Day passes', 'Night network'], 'TTC'),
    opt('airport', 'UP Express', 'Pearson Airport ↔ Union Station in 25 min', 'https://www.upexpress.com/', 'CAD $12.35', ['Express train', 'Every 15 min', 'Free WiFi', 'PRESTO accepted']),
  ]),
  city('Montreal', 'Canada', 'CA', [
    opt('combined', 'STM', 'Metro (4 lines), buses', 'https://www.stm.info/en/info/fares', 'CAD $3.75', ['OPUS card', 'Weekend passes', 'Night buses'], 'STM'),
    opt('airport', 'REM', 'YUL Airport ↔ Downtown (REM light rail)', 'https://rem.info/en', 'CAD $10.00', ['New automated light rail', 'Fast connection']),
  ]),
  city('Vancouver', 'Canada', 'CA', [
    opt('combined', 'TransLink', 'SkyTrain, SeaBus, buses', 'https://www.translink.ca/transit-fares', 'CAD $3.15-$4.55', ['Compass Card', 'SeaBus ferry', 'Day passes'], 'TransLink'),
    opt('airport', 'Canada Line', 'YVR Airport ↔ Downtown in 25 min', 'https://www.translink.ca/', 'CAD $9.30', ['SkyTrain direct', 'Every 7 min', 'Compass accepted']),
  ]),
  city('Mexico City', 'Mexico', 'MX', [
    opt('combined', 'Metro CDMX / Metrobús', 'Metro (12 lines), Metrobús BRT, trolleybus, light rail', 'https://www.metro.cdmx.gob.mx/', 'MXN $5.00', ['Very cheap', 'Women-only cars', 'Extensive network'], 'Metro CDMX'),
    opt('airport', 'Metrobús Line 4', 'AICM Airport ↔ Buenavista', 'https://www.metrobus.cdmx.gob.mx/', 'MXN $30', ['Direct BRT', 'Airport terminal stops']),
    opt('cablecar', 'Cablebús', 'Aerial tramway lines 1 & 2', 'https://www.ste.cdmx.gob.mx/', 'MXN $7.00', ['Modern cable car', 'Metro integrated', 'Mountain neighborhoods']),
  ]),

  // ===== ASIA =====
  city('Tokyo', 'Japan', 'JP', [
    opt('combined', 'Tokyo Metro / Toei', 'Metro (13 lines), JR Yamanote, buses', 'https://www.tokyometro.jp/en/ticket/', '¥170-¥320', ['Suica/Pasmo IC cards', 'Tokyo Subway Ticket', 'Day passes'], 'Tokyo Metro'),
    opt('airport', 'Narita Express / Skyliner', 'NRT & HND airport trains', 'https://www.jreast.co.jp/multi/en/nex/', '¥2,520-¥3,250', ['NEX express', 'Keisei Skyliner', 'Monorail to HND']),
    opt('train', 'JR Yamanote Line', 'Iconic loop line connecting major stations', 'https://www.jreast.co.jp/', '¥150-¥200', ['Loop line', 'Every 2-4 min', 'All major stations']),
  ]),
  city('Osaka', 'Japan', 'JP', [
    opt('combined', 'Osaka Metro', 'Metro (9 lines), buses', 'https://www.osakametro.co.jp/en/', '¥180-¥380', ['ICOCA card', 'Day passes', 'Extensive network'], 'Osaka Metro'),
    opt('airport', 'Nankai Rapi:t', 'Kansai Airport ↔ Namba in 34 min', 'https://www.nankai.co.jp/en/', '¥1,450', ['Futuristic train', 'Express service']),
  ]),
  city('Singapore', 'Singapore', 'SG', [
    opt('combined', 'SMRT / SBS Transit', 'MRT (6 lines), LRT, buses', 'https://www.transitlink.com.sg/', 'SGD $0.92-$2.47', ['EZ-Link card', 'Tourist passes', 'Air-conditioned'], 'SimplyGo'),
    opt('airport', 'Changi MRT (East-West/Thomson)', 'Changi Airport ↔ City', 'https://www.changiairport.com/', 'SGD $2.20', ['Direct MRT', 'EZ-Link accepted', 'Multiple lines']),
  ]),
  city('Hong Kong', 'Hong Kong', 'HK', [
    opt('combined', 'MTR', 'MTR (11 lines), light rail, buses', 'https://www.mtr.com.hk/en/customer/tickets/', 'HKD $5-$60', ['Octopus card', 'Tourist passes', 'Peak Tram'], 'MTR Mobile'),
    opt('airport', 'Airport Express', 'HKIA ↔ Hong Kong Station in 24 min', 'https://www.mtr.com.hk/', 'HKD $115', ['Express service', 'In-town check-in', 'Free shuttle buses']),
    opt('cablecar', 'Ngong Ping 360', 'Cable car to Tian Tan Buddha', 'https://www.np360.com.hk/', 'HKD $235', ['Glass-bottom cabin', '5.7km journey', 'Lantau views']),
    opt('ferry', 'Star Ferry', 'Victoria Harbour crossing', 'https://www.starferry.com.hk/', 'HKD $3.70', ['Iconic ferry', 'Harbour views', 'Octopus accepted']),
  ]),
  city('Seoul', 'South Korea', 'KR', [
    opt('combined', 'Seoul Metro', 'Subway (23 lines), buses', 'https://www.seoulmetro.co.kr/en', '₩1,400-₩2,750', ['T-money card', 'Discover Seoul Pass', 'Free WiFi'], 'T-money'),
    opt('airport', 'AREX', 'Incheon Airport ↔ Seoul Station in 43 min', 'https://www.arex.or.kr/', '₩9,500', ['Express & All-stop', 'Every 12 min', 'T-money accepted']),
    opt('cablecar', 'Namsan Cable Car', 'Cable car to N Seoul Tower', 'https://www.nseoultower.co.kr/', '₩11,000', ['Tower access', 'City panorama', 'Night views']),
  ]),
  city('Bangkok', 'Thailand', 'TH', [
    opt('combined', 'BTS / MRT / Airport Rail Link', 'BTS Skytrain, MRT subway, buses', 'https://www.bts.co.th/eng/', '฿16-฿59', ['Rabbit Card', 'Single journey tokens', 'Day passes'], 'BTS SkyTrain'),
    opt('airport', 'Airport Rail Link', 'Suvarnabhumi ↔ Phaya Thai in 26 min', 'https://www.srtet.co.th/', '฿15-฿45', ['City Line', 'Frequent service', 'BTS connection']),
    opt('ferry', 'Chao Phraya Express Boat', 'River ferry services', 'https://www.chaophrayaexpressboat.com/', '฿15-฿40', ['River commute', 'Tourist boat', 'Temple access']),
  ]),
  city('Shanghai', 'China', 'CN', [
    opt('combined', 'Shanghai Metro', 'Metro (20 lines), buses, ferries', 'https://www.shmetro.com/', '¥3-¥15', ['Shanghai Public Transport Card', 'Alipay/WeChat', 'Huge network'], 'Metro Daduhui'),
    opt('airport', 'Maglev', 'Pudong Airport ↔ Longyang Road in 7 min', 'https://www.smtdc.com/', '¥50', ['431 km/h maglev', 'Fastest commercial train', 'Metro transfer']),
  ]),
  city('Beijing', 'China', 'CN', [
    opt('combined', 'Beijing Subway', 'Metro (27 lines), buses', 'https://www.bjsubway.com/', '¥3-¥9', ['Yikatong card', 'Alipay/WeChat', 'Massive network'], 'Beijing Subway'),
    opt('airport', 'Capital Airport Express / Daxing Line', 'PEK & PKX airport metro lines', 'https://www.bjsubway.com/', '¥25-¥35', ['Airport Express', 'Daxing metro', 'Direct service']),
  ]),
  city('Dubai', 'United Arab Emirates', 'AE', [
    opt('combined', 'RTA Dubai', 'Metro (2 lines), tram, buses, water bus', 'https://www.rta.ae/', 'AED 3-8.50', ['Nol Card', 'Gold class', 'Day passes', 'Modern & clean'], 'RTA Dubai'),
    opt('airport', 'Metro Red Line', 'DXB Airport ↔ City Center', 'https://www.rta.ae/', 'AED 6-8.50', ['Direct metro', 'Terminals 1 & 3', 'Nol accepted']),
    opt('ferry', 'Dubai Ferry / Water Taxi', 'Marina, Creek, Palm ferry services', 'https://www.rta.ae/', 'AED 15-50', ['Marina views', 'Water taxi', 'Palm Jumeirah route']),
    opt('tram', 'Dubai Tram', 'Al Sufouh tram (11 stations)', 'https://www.rta.ae/', 'AED 3-5', ['Metro/monorail links', 'JBR access', 'Nol accepted']),
  ]),
  city('Abu Dhabi', 'United Arab Emirates', 'AE', [
    opt('combined', 'Abu Dhabi DoT', 'Buses, Hafilat card system', 'https://www.dot.abudhabi/', 'AED 2-5', ['Hafilat card', 'Intercity routes', 'Clean buses'], 'Darb'),
    opt('airport', 'A1 Bus', 'AUH Airport ↔ City Center', 'https://www.dot.abudhabi/', 'AED 4', ['24/7 service', 'Every 30 min', 'Air-conditioned']),
  ]),
  city('Doha', 'Qatar', 'QA', [
    opt('combined', 'Doha Metro', 'Metro (3 lines), Lusail Tram', 'https://www.qr.com.qa/', 'QAR 2-6', ['Gold class', 'Free WiFi', 'Modern stations'], 'Qatar Rail'),
    opt('airport', 'Gold Line', 'Hamad Airport ↔ West Bay', 'https://www.qr.com.qa/', 'QAR 2', ['Direct metro', 'Inside airport', 'Frequent service']),
    opt('tram', 'Lusail Tram', '4-line tram network in Lusail City', 'https://www.qr.com.qa/', 'QAR 2', ['Modern tram', 'New city', 'Metro integrated']),
  ]),
  city('Mumbai', 'India', 'IN', [
    opt('combined', 'BEST / Mumbai Metro', 'Metro (3 lines operational), suburban railway, BEST buses', 'https://www.mumbaimetro.com/', '₹10-₹70', ['Smart card', 'Suburban trains', 'Very cheap'], 'Mumbai Metro'),
    opt('airport', 'Metro Line 3 (Aqua)', 'CSIA ↔ BKC (under construction/opening)', 'https://www.mumbaimetro.com/', '₹20-₹50', ['Airport metro', 'Direct connection']),
    opt('train', 'Mumbai Suburban Railway', 'Western, Central, Harbour lines', 'https://www.irctc.co.in/', '₹5-₹15', ['Lifeline of Mumbai', 'Very frequent', 'First class available']),
  ]),
  city('Delhi', 'India', 'IN', [
    opt('combined', 'Delhi Metro', 'Metro (12 lines), DTC buses', 'https://www.delhimetrorail.com/', '₹10-₹60', ['Smart Card', 'Tourist Card', 'Airport Express'], 'DMRC'),
    opt('airport', 'Airport Express Line', 'IGI Airport ↔ New Delhi Station in 21 min', 'https://www.delhimetrorail.com/', '₹60', ['Express service', 'Every 10 min', 'Check-in facility']),
  ]),
  city('Bangalore', 'India', 'IN', [
    opt('combined', 'BMRCL / BMTC', 'Metro (2 lines), buses', 'https://english.bmrc.co.in/', '₹10-₹60', ['Smart Card', 'AC buses', 'Expanding network'], 'Namma Metro'),
  ]),
  city('Kuala Lumpur', 'Malaysia', 'MY', [
    opt('combined', 'Rapid KL', 'LRT, MRT, KTM, monorail, buses', 'https://www.myrapid.com.my/', 'MYR 1.20-6.80', ['Touch n Go', 'Day passes', 'Monorail'], 'My50'),
    opt('airport', 'KLIA Ekspres', 'KLIA ↔ KL Sentral in 28 min', 'https://www.kliaekspres.com/', 'MYR 55', ['Express train', 'Free WiFi', 'City check-in']),
  ]),
  city('Jakarta', 'Indonesia', 'ID', [
    opt('combined', 'TransJakarta / MRT / LRT', 'BRT, MRT, LRT, commuter rail', 'https://www.transjakarta.co.id/', 'IDR 3,500-14,000', ['Multi-modal', 'BRT largest in world', 'Flazz card'], 'Tije'),
  ]),
  city('Taipei', 'Taiwan', 'TW', [
    opt('combined', 'Taipei Metro (MRT)', 'Metro (5 lines + extensions), buses', 'https://english.metro.taipei/', 'TWD 20-65', ['EasyCard', 'YouBike integration', 'Extremely clean'], 'Taipei Metro'),
    opt('airport', 'Taoyuan Airport MRT', 'Taoyuan Airport ↔ Taipei Main Station in 36 min', 'https://www.tymetro.com.tw/tymetro-new/en/', 'TWD 160', ['Express & commuter', 'In-town check-in', 'Free WiFi']),
    opt('cablecar', 'Maokong Gondola', 'Taipei Zoo ↔ Maokong tea area', 'https://english.gondola.taipei/', 'TWD 120', ['Crystal cabin option', 'Tea plantation views', 'EasyCard accepted']),
  ]),
  city('Manila', 'Philippines', 'PH', [
    opt('combined', 'LRT / MRT Manila', 'LRT Line 1 & 2, MRT Line 3', 'https://www.lrta.gov.ph/', 'PHP 15-30', ['Beep card', 'Affordable', 'Rush hour crowded']),
    opt('bus', 'EDSA Carousel', 'Bus Rapid Transit along EDSA', 'https://www.ltfrb.gov.ph/', 'PHP 13', ['Dedicated lanes', 'Cashless payment', 'High frequency']),
  ]),
  city('Ho Chi Minh City', 'Vietnam', 'VN', [
    opt('combined', 'HCMC Metro / Buses', 'Metro Line 1 (opening), extensive bus network', 'https://www.buymedecision.org.vn/', 'VND 6,000-12,000', ['Very cheap', 'Bus only for now', 'Metro Line 1 soon'], 'HCMC Bus'),
  ]),
  city('Tel Aviv', 'Israel', 'IL', [
    opt('combined', 'Dan / Egged / Light Rail', 'Red Line light rail, buses', 'https://www.rail.co.il/en', 'ILS 5.50-15.00', ['Rav-Kav card', 'New light rail', 'Israel Railways'], 'Moovit'),
    opt('airport', 'Israel Railways', 'Ben Gurion Airport ↔ Tel Aviv in 18 min', 'https://www.rail.co.il/en', 'ILS 13.50', ['Direct train', 'Frequent service', 'Rav-Kav accepted']),
  ]),

  // ===== AUSTRALIA & OCEANIA =====
  city('Sydney', 'Australia', 'AU', [
    opt('combined', 'Transport for NSW', 'Trains, light rail, buses, ferries', 'https://transportnsw.info/tickets-opal', 'AUD $3.61-$8.90', ['Opal card', 'Day caps', 'Sunday discounts'], 'Opal Travel'),
    opt('airport', 'Airport Link', 'Sydney Airport ↔ City in 13 min', 'https://www.airportlink.com.au/', 'AUD $18.70', ['Express train', 'Frequent service', 'Opal accepted']),
    opt('ferry', 'Sydney Ferries', 'Harbour & river ferry services', 'https://transportnsw.info/routes/ferry', 'AUD $6.43', ['Manly Ferry', 'Harbour views', 'Opal card']),
  ]),
  city('Melbourne', 'Australia', 'AU', [
    opt('combined', 'PTV', 'Trains, trams (largest network in world), buses', 'https://www.ptv.vic.gov.au/tickets/myki', 'AUD $4.90-$9.80', ['Myki card', 'Free tram zone', 'Historic trams'], 'PTV'),
    opt('airport', 'SkyBus', 'Melbourne Airport ↔ Southern Cross in 30 min', 'https://www.skybus.com.au/', 'AUD $19.75', ['Express bus', 'Every 10 min', '24/7 service']),
  ]),
  city('Auckland', 'New Zealand', 'NZ', [
    opt('combined', 'Auckland Transport', 'Trains, buses, ferries', 'https://at.govt.nz/bus-train-ferry/', 'NZD $2.00-$7.50', ['AT HOP card', 'Daily caps', 'Devonport ferry'], 'AT Mobile'),
    opt('airport', 'SkyBus', 'Auckland Airport ↔ City Center', 'https://www.skybus.co.nz/', 'NZD $18.00', ['Every 15 min', 'WiFi', 'Direct service']),
  ]),

  // ===== SOUTH AMERICA =====
  city('São Paulo', 'Brazil', 'BR', [
    opt('combined', 'SPTrans / Metro', 'Metro (6 lines), buses, trains', 'https://www.metro.sp.gov.br/', 'R$5.00', ['Bilhete Único', 'Free transfers', 'Extensive bus network'], 'SPTrans'),
    opt('airport', 'Airport Bus Service', 'Guarulhos/Congonhas ↔ City Center', 'https://www.gru.com.br/', 'R$50', ['Airport bus', 'Hotel connections']),
  ]),
  city('Buenos Aires', 'Argentina', 'AR', [
    opt('combined', 'BA Subte', 'Subway (6 lines), buses (colectivos), trains', 'https://www.buenosaires.gob.ar/subte', 'ARS $125', ['SUBE card', 'Historic trains', '24-hour buses'], 'BA Cómo Llego'),
    opt('airport', 'Tienda León / Bus 8', 'Ezeiza ↔ City Center', 'https://www.tiendaleon.com/', 'ARS $3,500', ['Airport shuttle', 'Bus 8 cheapest option']),
  ]),
  city('Bogotá', 'Colombia', 'CO', [
    opt('combined', 'TransMilenio', 'BRT system, SITP buses', 'https://www.transmilenio.gov.co/', 'COP $2,950', ['Tullave card', 'BRT trunk routes', 'SITP feeders', 'Metro under construction']),
    opt('cablecar', 'TransMiCable', 'Cable car lines connecting hillside neighborhoods', 'https://www.transmilenio.gov.co/', 'COP $2,950', ['Social transport', 'Integrated fare', 'Mountain neighborhoods']),
  ]),
  city('Santiago', 'Chile', 'CL', [
    opt('combined', 'Metro de Santiago / RED', 'Metro (7 lines), RED buses', 'https://www.metro.cl/', 'CLP $800', ['Bip! card', 'Modern metro', 'Integrated fares'], 'Metro de Santiago'),
    opt('airport', 'TurBus Airport / Centropuerto', 'SCL Airport ↔ Los Héroes', 'https://www.turbus.cl/', 'CLP $2,000', ['Bus service', 'Metro connection']),
  ]),
  city('Lima', 'Peru', 'PE', [
    opt('combined', 'Metropolitano / Metro Lima', 'BRT, Metro Line 1, buses', 'https://www.metropolitano.com.pe/', 'PEN 2.50', ['Smart card', 'BRT', 'Metro Line 1'], 'ATU'),
  ]),
  city('Medellín', 'Colombia', 'CO', [
    opt('combined', 'Metro de Medellín', 'Metro (2 lines), Metrocable, tram, buses', 'https://www.metrodemedellin.gov.co/', 'COP $2,950', ['Cívica card', 'Metrocable cable cars', 'Tram', 'Integrated system'], 'Metro de Medellín'),
    opt('cablecar', 'Metrocable', 'Cable car lines connecting hillside comunas', 'https://www.metrodemedellin.gov.co/', 'COP $2,950', ['Social innovation', 'City panoramas', 'Metro integrated', '4 lines']),
  ]),

  // ===== AFRICA =====
  city('Cape Town', 'South Africa', 'ZA', [
    opt('combined', 'MyCiTi / Golden Arrow', 'BRT buses, commuter trains', 'https://www.myciti.org.za/', 'ZAR 9-35', ['myconnect card', 'Airport service', 'Modern BRT'], 'MyCiTi'),
    opt('cablecar', 'Table Mountain Cableway', 'Lower Station ↔ Table Mountain summit', 'https://www.tablemountain.net/', 'ZAR 395', ['360° rotating cabin', 'Summit views', 'Iconic landmark']),
  ]),
  city('Johannesburg', 'South Africa', 'ZA', [
    opt('combined', 'Gautrain / Rea Vaya', 'Gautrain rapid rail, Rea Vaya BRT, buses', 'https://www.gautrain.co.za/', 'ZAR 20-100', ['Gautrain Gold Card', 'BRT', 'Airport service'], 'Gautrain'),
    opt('airport', 'Gautrain', 'OR Tambo ↔ Sandton in 15 min', 'https://www.gautrain.co.za/', 'ZAR 185', ['Express rail', 'Every 12 min', 'Safe & reliable']),
  ]),
  city('Nairobi', 'Kenya', 'KE', [
    opt('combined', 'Matatu / SGR', 'Matatu minibuses, BRT, SGR railway', 'https://mefrancis.com/', 'KES 30-100', ['Cash/M-Pesa', 'Matatu culture', 'BRT expanding']),
    opt('airport', 'SGR / Airport Bus', 'JKIA ↔ City Center', 'https://mefrancis.com/', 'KES 100-300', ['Standard Gauge Railway', 'Bus options']),
  ]),
  city('Cairo', 'Egypt', 'EG', [
    opt('combined', 'Cairo Metro', 'Metro (3 lines), buses, microbuses', 'https://cairometro.gov.eg/', 'EGP 5-10', ['Very cheap', 'Women-only cars', 'Millions daily'], 'Cairo Metro'),
    opt('airport', 'Airport Shuttle Bus', 'CAI ↔ City Center', 'https://www.cairo-airport.com/', 'EGP 50', ['CTA bus', 'Multiple stops']),
  ]),
  city('Lagos', 'Nigeria', 'NG', [
    opt('combined', 'BRT Lagos / Lagos Rail', 'BRT buses, Blue Line rail, ferries', 'https://www.lamata.ng/', 'NGN 100-700', ['Cowry card', 'BRT', 'Ferry services', 'Blue Line rail']),
    opt('ferry', 'Lagos Ferry Services (LAGFERRY)', 'Water bus across Lagos Lagoon', 'https://lagferry.org/', 'NGN 300-500', ['Avoiding traffic', 'Multiple routes', 'Fast commute']),
  ]),
  city('Addis Ababa', 'Ethiopia', 'ET', [
    opt('combined', 'Addis Ababa Light Rail', 'Light rail (2 lines), minibuses', 'https://www.erc.gov.et/', 'ETB 2-6', ['First in Sub-Saharan Africa', 'Very affordable', 'Chinese-built']),
  ]),
  city('Casablanca', 'Morocco', 'MA', [
    opt('combined', 'Casa Tramway / RATP Dev', 'Tram (2 lines), buses', 'https://www.casatramway.ma/', 'MAD 6-7', ['Tram card', 'Modern network', 'Expanding'], 'Casa Tram'),
  ]),
];

interface PublicTransportProps {
  currentLocation?: { countryCode?: string; city?: string } | null;
}

const PublicTransport: React.FC<PublicTransportProps> = ({ currentLocation }) => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  const countries = useMemo(() => {
    const countrySet = new Set(publicTransportData.map(item => item.country));
    return Array.from(countrySet).sort();
  }, []);

  const sortedData = useMemo(() => {
    const userCountryCode = currentLocation?.countryCode?.toUpperCase();
    const userCity = currentLocation?.city?.toLowerCase();

    return [...publicTransportData].sort((a, b) => {
      if (userCity) {
        if (a.city.toLowerCase() === userCity && b.city.toLowerCase() !== userCity) return -1;
        if (b.city.toLowerCase() === userCity && a.city.toLowerCase() !== userCity) return 1;
      }
      if (userCountryCode) {
        if (a.countryCode === userCountryCode && b.countryCode !== userCountryCode) return -1;
        if (b.countryCode === userCountryCode && a.countryCode !== userCountryCode) return 1;
      }
      return a.city.localeCompare(b.city);
    });
  }, [currentLocation]);

  const filteredData = useMemo(() => {
    return sortedData.filter(item => {
      const matchesSearch = searchQuery === '' ||
        item.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.country.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCountry = selectedCountry === 'all' || item.country === selectedCountry;
      const matchesType = selectedType === 'all' ||
        item.options.some(opt => opt.type === selectedType || opt.type === 'combined');
      return matchesSearch && matchesCountry && matchesType;
    });
  }, [sortedData, searchQuery, selectedCountry, selectedType]);

  const getTransportIcon = (type: string) => {
    switch (type) {
      case 'metro':
      case 'train': return <Train className="h-4 w-4" />;
      case 'bus': return <Bus className="h-4 w-4" />;
      case 'tram': return <Tram className="h-4 w-4" />;
      case 'airport': return <Plane className="h-4 w-4" />;
      case 'cablecar': return <Cable className="h-4 w-4" />;
      case 'ferry': return <Ship className="h-4 w-4" />;
      default: return <MapPin className="h-4 w-4" />;
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'airport': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cablecar': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'ferry': return 'bg-cyan-100 text-cyan-800 border-cyan-200';
      case 'tram': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold gradient-text">🚇 Public Transport Guide</h1>
        <p className="text-muted-foreground">
          Airport shuttles, metro, trams, buses, cable cars & ferries — {publicTransportData.length} cities worldwide
        </p>
      </div>

      {currentLocation?.city && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-primary">
              <Navigation className="h-5 w-5" />
              <p className="font-medium">
                📍 Showing {currentLocation.city} first based on your location
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search & Filter
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search City or Country</label>
              <Input
                placeholder="e.g. London, Tokyo, Dubai..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Country</label>
              <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                <SelectTrigger><SelectValue placeholder="All Countries" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Countries</SelectItem>
                  {countries.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Transport Type</label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger><SelectValue placeholder="All Types" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="metro">🚇 Metro / Subway</SelectItem>
                  <SelectItem value="bus">🚌 Bus / BRT</SelectItem>
                  <SelectItem value="tram">🚊 Tram / Light Rail</SelectItem>
                  <SelectItem value="train">🚆 Train / Rail</SelectItem>
                  <SelectItem value="airport">✈️ Airport Shuttle</SelectItem>
                  <SelectItem value="cablecar">🚡 Cable Car / Funicular</SelectItem>
                  <SelectItem value="ferry">⛴️ Ferry / Water Bus</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-sm text-muted-foreground">
        Showing {filteredData.length} of {publicTransportData.length} cities
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredData.map((cityData) => (
          <Card key={`${cityData.city}-${cityData.countryCode}`} className="hover:shadow-large transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    {cityData.city}
                  </CardTitle>
                  <CardDescription>{cityData.country}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {cityData.options.length} services
                  </Badge>
                  {currentLocation?.city?.toLowerCase() === cityData.city.toLowerCase() && (
                    <Badge variant="default" className="gradient-trust">
                      <Navigation className="h-3 w-3 mr-1" />
                      You're Here
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {cityData.options.map((option, idx) => (
                <div key={idx} className="space-y-3 p-4 rounded-lg bg-accent/50">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-base">{option.name}</h3>
                    <Badge variant="outline" className={getTypeBadgeColor(option.type)}>
                      {getTransportIcon(option.type)}
                      <span className="ml-1 capitalize">{option.type === 'cablecar' ? 'Cable Car' : option.type}</span>
                    </Badge>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-start gap-2">
                      <span className="text-muted-foreground min-w-20">Coverage:</span>
                      <span className="font-medium">{option.coverage}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-muted-foreground min-w-20">Price:</span>
                      <span className="font-medium">{option.priceRange}</span>
                    </div>
                    {option.mobileApp && (
                      <div className="flex items-start gap-2">
                        <span className="text-muted-foreground min-w-20">App:</span>
                        <span className="font-medium">{option.mobileApp}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {option.features.map((feature, fi) => (
                      <Badge key={fi} variant="secondary" className="text-xs">{feature}</Badge>
                    ))}
                  </div>
                  <Button
                    className="w-full gradient-success"
                    size="sm"
                    onClick={() => window.open(option.ticketUrl, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Buy Tickets / More Info
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredData.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              No cities found matching your criteria. Try adjusting your filters.
            </p>
          </CardContent>
        </Card>
      )}

      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <CardHeader><CardTitle>🌍 Transport Tips for Nomads</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {[
            'Always buy tickets before boarding to avoid fines',
            'Download the official app for real-time schedules',
            'Get multi-day or tourist passes for better value',
            'Airport express trains are usually the fastest option',
            'Cable cars and funiculars often offer the best city views',
            'Ferries can be scenic and functional daily commutes',
          ].map((tip, i) => (
            <div key={i} className="flex gap-3">
              <div className="text-primary font-bold">{i + 1}.</div>
              <p className="text-sm">{tip}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default PublicTransport;
