// ═══════════════════════════════════════════════════════════
// 100 COUNTRY KNOWLEDGE BASE — Culture, Currency, Manners, Hours, Emergency
// ═══════════════════════════════════════════════════════════

export interface CountryInfo {
  currency: string;
  language: string;
  emergency: string;
  businessHours: string;
  tipping: string;
  culturalNotes: string;
  manners: string;
  dressCode: string;
  safetyNotes: string;
  taxResidencyDays: number;
  utcOffset: string;
}

export const COUNTRY_DATABASE: Record<string, CountryInfo> = {
  "united states": {
    currency: "USD. Cards accepted everywhere. Sales tax NOT included in prices.",
    language: "English",
    emergency: "911",
    businessHours: "Mon-Fri 9AM-5PM. Many stores 10AM-9PM. 24/7 culture in major cities.",
    tipping: "18-25% at restaurants (mandatory culturally), $1-2/drink at bars, 15-20% for taxis, $2-5/night hotel housekeeping.",
    culturalNotes: "Very casual and friendly. Small talk is normal. Personal space valued. Diverse food scene. Drive-through culture outside cities.",
    manners: "Firm handshake. Eye contact important. 'How are you?' is a greeting, not a real question. Queue politely. Don't discuss politics with strangers.",
    dressCode: "Very casual overall. Business casual for offices. Some upscale restaurants require smart casual.",
    safetyNotes: "Healthcare very expensive—always have insurance. Tip everywhere. Jaywalking fined in some cities. Legal drinking age 21.",
    taxResidencyDays: 183,
    utcOffset: "-5 to -10"
  },
  "united kingdom": {
    currency: "GBP (£). Contactless widely accepted. Chip & PIN standard.",
    language: "English",
    emergency: "999 or 112",
    businessHours: "Mon-Fri 9AM-5:30PM. Pubs 11AM-11PM (midnight Fri-Sat). Sunday trading: large stores 10AM-4PM only.",
    tipping: "10-12.5% restaurants (check if service charge included). Round up taxis. No tipping at pubs/bars.",
    culturalNotes: "Queuing is sacred. Apologize even when it's not your fault. Pub culture central to social life. Dry humor. Weather is always a safe topic.",
    manners: "Say 'please', 'thank you', 'sorry' constantly. Don't skip queues (social death). Stand right on escalators. Don't talk loudly on tubes.",
    dressCode: "Smart casual widely accepted. Some clubs/restaurants enforce dress codes. Layers essential—weather changes hourly.",
    safetyNotes: "NHS A&E free for emergencies. Driving on the left. CCTV everywhere. Very safe overall.",
    taxResidencyDays: 183,
    utcOffset: "0"
  },
  "france": {
    currency: "EUR (€). Cards accepted widely but some small shops cash-only.",
    language: "French. English spoken in tourist areas but attempt French first—it matters.",
    emergency: "112 or 15 (medical), 17 (police), 18 (fire)",
    businessHours: "Mon-Fri 9AM-6PM. Sacred lunch 12-2PM. Shops closed Sunday & often Monday. August = mass closures. Pharmacies: green cross sign.",
    tipping: "Service compris (included). Round up or leave 1-2€ for good service. Never expected.",
    culturalNotes: "Greet shopkeepers when entering/leaving ('Bonjour/Au revoir'). Meals are events, not fuel. Wine at lunch is normal. Art and food are serious.",
    manners: "Always say 'Bonjour' before asking anything. 'Excusez-moi' not 'Hey'. Kiss on cheeks (la bise) varies by region (1-4). Speak quietly in public.",
    dressCode: "Parisians dress well. Avoid sportswear/flip-flops in cities. Neutral, elegant colors preferred.",
    safetyNotes: "Pickpockets in Paris metro/tourist spots. Strikes can disrupt transport. Pharmacies give medical advice free.",
    taxResidencyDays: 183,
    utcOffset: "+1"
  },
  "germany": {
    currency: "EUR (€). Cash still widely preferred! Many restaurants/shops don't take cards. Always carry cash.",
    language: "German. English widely spoken in cities.",
    emergency: "112",
    businessHours: "Mon-Fri 9AM-6PM. Shops CLOSED Sundays (only bakeries, gas stations). Quiet hours (Ruhezeit) 10PM-6AM and ALL Sunday.",
    tipping: "Round up 5-10%. Say the total you want to pay, don't leave on table. Cash tips preferred.",
    culturalNotes: "Punctuality is everything. Recycling taken very seriously (Pfand bottle deposit system). Beer culture. Efficient and direct communication.",
    manners: "Be punctual (even 5 min late is rude). Shake hands firmly. Don't jaywalk. Recycle properly. Don't make noise on Sundays.",
    dressCode: "Practical, understated. Business formal for meetings. Lederhosen only at Oktoberfest in Bavaria.",
    safetyNotes: "Very safe. Cycling infrastructure excellent. Autobahn has no speed limit in some sections. Health insurance mandatory.",
    taxResidencyDays: 183,
    utcOffset: "+1"
  },
  "japan": {
    currency: "JPY (¥). Cash is KING—many places don't accept cards. ATMs at 7-Eleven/post offices work for foreign cards.",
    language: "Japanese. Limited English. Google Translate essential.",
    emergency: "110 (police), 119 (fire/ambulance)",
    businessHours: "9AM-5PM offices. Restaurants close 2-4PM often. Trains stop midnight-5AM. Convenience stores (konbini) 24/7.",
    tipping: "NEVER tip. It's considered rude/confusing. Service is included and excellent.",
    culturalNotes: "Remove shoes indoors (look for shoe racks). Bow instead of handshake. Silence on public transport. Onsen (hot spring) etiquette strict—no tattoos usually.",
    manners: "Bow when greeting. Don't eat while walking. Don't blow nose in public. Use two hands to give/receive business cards. Don't tip. Queue perfectly.",
    dressCode: "Neat and modest. Cover tattoos (especially at onsen/gyms). Remove shoes indoors.",
    safetyNotes: "Extremely safe. Earthquakes common—know evacuation routes. Typhoon season Jun-Oct. Lost items often returned.",
    taxResidencyDays: 183,
    utcOffset: "+9"
  },
  "spain": {
    currency: "EUR (€). Cards widely accepted.",
    language: "Spanish (Castilian). Catalan in Barcelona, Basque in north, Galician in northwest.",
    emergency: "112",
    businessHours: "9AM-2PM, then 5PM-8PM. Siesta real. Dinner starts 9-10PM. Shops closed Sunday. August = skeleton crew.",
    tipping: "Not expected. Round up or leave small change. Some leave 5-10% for excellent service.",
    culturalNotes: "Late everything—dinner at 10PM, nightlife starts midnight. Siesta is respected. Family-centric. Tapas culture. Passionate about football.",
    manners: "Two kisses greeting (right cheek first). Personal space closer than Northern Europe. Loud conversations normal. Don't rush meals.",
    dressCode: "Stylish casual. Beach clothes only at beach. Smart casual for dining out.",
    safetyNotes: "Pickpockets in Barcelona/Madrid tourist zones. Beach theft common—never leave bags unattended. Very safe overall.",
    taxResidencyDays: 183,
    utcOffset: "+1"
  },
  "italy": {
    currency: "EUR (€). Cash still useful in small towns. Cards accepted in cities.",
    language: "Italian. English in tourist areas.",
    emergency: "112 or 113 (police), 118 (ambulance)",
    businessHours: "9AM-1PM, 3:30PM-7:30PM. Riposo varies by region. Museums closed Mondays. August = holiday.",
    tipping: "Coperto (cover charge) usually on bill. Small tip appreciated but never expected. Round up.",
    culturalNotes: "Coffee culture: espresso standing at bar is cheapest. Cappuccino only before 11AM. Food is regional—don't ask for fettuccine alfredo. Aperitivo hour 6-8PM.",
    manners: "Dress well (bella figura). Don't order cappuccino after a meal. Don't put parmesan on fish pasta. Greet with kisses on both cheeks.",
    dressCode: "Italians dress impeccably. Cover shoulders/knees in churches. No flip-flops in cities.",
    safetyNotes: "Pickpockets at tourist sites. Watch for scams near Colosseum/Duomo. South generally safe but more chaotic driving.",
    taxResidencyDays: 183,
    utcOffset: "+1"
  },
  "netherlands": {
    currency: "EUR (€). Almost cashless—cards/contactless everywhere. Some places don't even accept cash.",
    language: "Dutch. Almost everyone speaks excellent English.",
    emergency: "112",
    businessHours: "Mon-Fri 9AM-5PM. Many shops closed Monday morning. Supermarkets open Sunday. Albert Heijn till 10PM.",
    tipping: "Round up or 5-10%. Not mandatory. Service included.",
    culturalNotes: "Cycling is life—watch the bike lanes! Direct communication (not rude, just Dutch). Tolerance culture. Gezelligheid (cozy togetherness).",
    manners: "Be direct and honest. Don't block bike lanes (EVER). Split bills (going Dutch is real). Three cheek kisses for friends.",
    dressCode: "Casual, practical. Rain gear essential. Bike-friendly clothing.",
    safetyNotes: "Very safe. Watch for bikes—they have right of way. Cannabis only in licensed coffeeshops. Water management impressive.",
    taxResidencyDays: 183,
    utcOffset: "+1"
  },
  "portugal": {
    currency: "EUR (€). Cards widely accepted. MB Way popular locally.",
    language: "Portuguese. Good English in Lisbon/Porto/Algarve.",
    emergency: "112",
    businessHours: "Mon-Fri 9AM-6PM. Lunch 1-2:30PM. Shops close 7PM. Sunday mostly closed except malls.",
    tipping: "Not expected but appreciated. 5-10% for good service. Round up taxis.",
    culturalNotes: "Fado music is cultural identity. Pastel de nata everywhere. Coffee culture (bica = espresso). Saudade (nostalgic longing) is national mood. Very welcoming to foreigners.",
    manners: "Friendly and warm. Formal with elders (use 'Senhor/Senhora'). Two cheek kisses. Don't compare to Spain.",
    dressCode: "Relaxed casual. Beach casual in Algarve. Smart casual for Lisbon dining.",
    safetyNotes: "Very safe. Petty theft in Lisbon tourist areas. Great healthcare via SNS. Digital nomad visa available (D7/D8).",
    taxResidencyDays: 183,
    utcOffset: "0"
  },
  "switzerland": {
    currency: "CHF (Swiss Franc). Very expensive. Cards accepted. EUR sometimes accepted near borders.",
    language: "German (63%), French (23%), Italian (8%), Romansh (0.5%). English widely spoken.",
    emergency: "112 or 117 (police), 144 (ambulance), 118 (fire)",
    businessHours: "Mon-Fri 8AM-6:30PM. Shops close 4-5PM Saturday. CLOSED Sunday. Very strict.",
    tipping: "Included in bill by law. Round up for good service.",
    culturalNotes: "Precision and punctuality paramount. Quiet after 10PM. Recycling mandatory. Fondue/raclette in winter. Stunning trains.",
    manners: "Be punctual. Keep noise down. Don't mow lawn on Sunday. Greet neighbors. Recycle meticulously.",
    dressCode: "Smart, understated elegance. Quality over logos. Practical for mountains.",
    safetyNotes: "One of safest countries. Very expensive—budget extra. Healthcare excellent but costly for visitors. Always have insurance.",
    taxResidencyDays: 90,
    utcOffset: "+1"
  },
  "australia": {
    currency: "AUD. Contactless/tap everywhere. Almost cashless.",
    language: "English (with slang—'arvo' = afternoon, 'brekkie' = breakfast).",
    emergency: "000 or 112 from mobile",
    businessHours: "Mon-Fri 9AM-5PM. Shops 9AM-5:30PM. Late-night shopping Thursday. Sunday penalty rates = some closures.",
    tipping: "Not expected. 10% for exceptional service. No tipping at cafes/bars.",
    culturalNotes: "Laid-back, egalitarian. BBQ culture. Beach life central. 'No worries' is national motto. Deadly wildlife is real but rare in cities.",
    manners: "Casual and friendly. Use first names. Don't brag (tall poppy syndrome). Shout a round at the pub. 'Yeah nah' means no.",
    dressCode: "Very casual. Thongs (flip-flops) acceptable most places. Sun protection essential.",
    safetyNotes: "UV extreme—slip slap slop. Marine stingers Nov-May (north). Bushfire season Oct-Mar. Medicare doesn't cover tourists.",
    taxResidencyDays: 183,
    utcOffset: "+8 to +11"
  },
  "canada": {
    currency: "CAD. Cards everywhere. Pennies eliminated—cash rounds to nearest 5¢.",
    language: "English and French (bilingual). French mandatory in Quebec.",
    emergency: "911",
    businessHours: "Mon-Fri 9AM-5PM. Malls 10AM-9PM. Sunday hours reduced.",
    tipping: "15-20% restaurants, 10-15% taxis, $1-2/drink bars. Similar to US culture.",
    culturalNotes: "Extremely polite. Multicultural. Hockey is religion. Tim Hortons is institution. Maple syrup on everything. Sorry is reflex.",
    manners: "Apologize constantly. Be polite and patient. Remove shoes indoors. Respect Indigenous cultures. French in Quebec = respected.",
    dressCode: "Casual. Layer for extreme temperature swings. Winter gear essential Nov-Mar.",
    safetyNotes: "Very safe. Wildlife in rural areas (bears, moose). Universal healthcare (MSP) but tourists should have insurance. Cannabis legal.",
    taxResidencyDays: 183,
    utcOffset: "-3.5 to -8"
  },
  "united arab emirates": {
    currency: "AED (Dirham). Cards everywhere. USD widely accepted.",
    language: "Arabic. English is lingua franca.",
    emergency: "999 (police), 998 (ambulance), 997 (fire)",
    businessHours: "Sun-Thu 8AM-6PM. Friday is weekend. Malls 10AM-10PM (midnight Thu-Sat). Ramadan: reduced hours everywhere.",
    tipping: "10% restaurants if no service charge. Round up taxis.",
    culturalNotes: "Islamic culture—respect it. Alcohol in licensed venues only. No PDA. Ramadan: no eating/drinking in public during fasting hours. Luxury is norm in Dubai.",
    manners: "Use right hand for greetings/eating. Don't photograph people without permission. Modest behavior in public. Remove shoes when entering homes.",
    dressCode: "Modest. Cover shoulders and knees (especially women). Beachwear only at beach/pool. Business attire conservative.",
    safetyNotes: "Extremely safe. Zero tolerance for drugs. Bounced checks can mean jail. Cybercrime laws strict. VPN use = legal grey area.",
    taxResidencyDays: 183,
    utcOffset: "+4"
  },
  "singapore": {
    currency: "SGD. Cards/contactless everywhere. Very modern payment systems.",
    language: "English, Mandarin, Malay, Tamil. Singlish is local English dialect.",
    emergency: "999 (police), 995 (ambulance/fire)",
    businessHours: "Mon-Fri 9AM-6PM. Malls 10AM-10PM. MRT 5:30AM-midnight. Hawker centers open early-late.",
    tipping: "Not expected. Service charge (10%) usually added. GST 9%.",
    culturalNotes: "Multiethnic harmony. Hawker food culture (UNESCO). Very efficient. Smart Nation initiative. Gardens by the Bay iconic.",
    manners: "Chewing gum banned (import/sell). No littering (heavy fines). No eating/drinking on MRT. Don't jaywalk. Chope seats with tissue packets.",
    dressCode: "Smart casual. Light fabrics for humidity. Some clubs enforce dress codes.",
    safetyNotes: "One of safest cities globally. Strict laws—death penalty for drug trafficking. Caning for vandalism. Healthcare excellent.",
    taxResidencyDays: 183,
    utcOffset: "+8"
  },
  "thailand": {
    currency: "THB (Baht). Cash preferred outside Bangkok. ATMs charge 220 THB fee for foreign cards.",
    language: "Thai. English in tourist areas. Learn 'Sawadee khrap/ka' (hello).",
    emergency: "191 (police), 1669 (ambulance), 199 (fire)",
    businessHours: "8:30AM-5PM offices. Street food morning to late night. 7-Eleven 24/7. Many shops close Sunday.",
    tipping: "Not required. Round up or 20-50 THB for good service. Don't tip at street stalls.",
    culturalNotes: "Buddhist culture. King highly revered (lèse-majesté law). Wai greeting (palms together). Thai massage is art form. Street food world-class.",
    manners: "Never touch anyone's head. Don't point feet at people/temples. Wai to greet. Remove shoes in temples and homes. Don't disrespect monarchy.",
    dressCode: "Cover shoulders and knees at temples. Light, breathable fabrics. No shoes indoors.",
    safetyNotes: "Generally safe. Watch for scams (tuk-tuk, gem shops). Monsoon Jun-Oct. Ride-sharing: Grab. Road safety poor—be cautious.",
    taxResidencyDays: 180,
    utcOffset: "+7"
  },
  "india": {
    currency: "INR (₹). Cash important in smaller cities. UPI/digital payments exploding. Foreign cards work at ATMs.",
    language: "Hindi, English. 22 official languages. English widely used in business.",
    emergency: "112 (unified) or 100 (police), 102 (ambulance)",
    businessHours: "Mon-Sat 10AM-6PM. Many shops open late. Sunday variable. Government offices close early.",
    tipping: "10% at upscale restaurants. Round up for autos/taxis. Small tips to hotel staff appreciated.",
    culturalNotes: "Namaste greeting. Remove shoes in temples/homes. Cows are sacred. Incredibly diverse—every state is different. Street food varies wildly by region.",
    manners: "Use right hand for eating/passing items. Namaste to greet. Remove shoes before entering homes/temples. Bargain at markets. Don't display affection publicly.",
    dressCode: "Modest, especially women. Cover shoulders and legs at temples. Light cotton for heat.",
    safetyNotes: "Water: bottled only. Street food: choose busy stalls. Traffic chaotic—ride apps safer. Women: extra caution at night. Air quality varies.",
    taxResidencyDays: 182,
    utcOffset: "+5:30"
  },
  "south korea": {
    currency: "KRW (₩). Cards everywhere. T-money card for transport.",
    language: "Korean. Some English in Seoul. Apps with Korean UI only.",
    emergency: "112 (police), 119 (fire/ambulance)",
    businessHours: "Mon-Fri 9AM-6PM (long hours culture). Shops 10AM-10PM. Convenience stores 24/7.",
    tipping: "NEVER tip. Not part of culture. May cause confusion.",
    culturalNotes: "Seniority matters hugely. K-pop/K-drama culture. Jimjilbang (spa culture). Soju drinking etiquette. Kimchi with every meal. Super-fast internet.",
    manners: "Use two hands to give/receive. Don't pour your own drink (someone else does). Bow to elders. Remove shoes indoors. Don't write names in red ink.",
    dressCode: "Stylish and trendy. Modest at temples. Korean fashion is globally influential.",
    safetyNotes: "Extremely safe. Excellent public transport. CCTV extensive. Download Kakao (national messaging app).",
    taxResidencyDays: 183,
    utcOffset: "+9"
  },
  "china": {
    currency: "CNY/RMB (¥). WeChat Pay/Alipay dominate. Cash almost extinct in cities. Foreign cards rarely work—set up Alipay.",
    language: "Mandarin. Very limited English outside major international hotels.",
    emergency: "110 (police), 120 (ambulance), 119 (fire)",
    businessHours: "Mon-Fri 9AM-6PM. Shops 10AM-10PM. Many things open 7 days.",
    tipping: "Not expected. Can be refused.",
    culturalNotes: "WeChat is essential (messaging, payments, everything). VPN needed for Google/Instagram/WhatsApp. Gift-giving culture. Guanxi (relationships) matter in business.",
    manners: "Exchange business cards with both hands. Refuse gifts 3 times before accepting. Don't stick chopsticks upright in rice. Avoid number 4 (death).",
    dressCode: "Conservative business. Casual otherwise. Modest at temples.",
    safetyNotes: "Very safe for violent crime. VPN essential for western apps. Air quality variable. Download Didi for taxis. Great Wall real but crowded.",
    taxResidencyDays: 183,
    utcOffset: "+8"
  },
  "brazil": {
    currency: "BRL (R$). Cards widely accepted. Pix (instant transfer) dominant locally.",
    language: "Portuguese (NOT Spanish). Different from European Portuguese.",
    emergency: "190 (police), 192 (ambulance), 193 (fire)",
    businessHours: "Mon-Fri 9AM-6PM. Malls 10AM-10PM. Street life goes late.",
    tipping: "10% usually included (gorjeta). Additional tip for excellent service.",
    culturalNotes: "Physical affection common (hugs, kisses). Carnival is massive. Football obsession. Churrasco (BBQ) culture. Diverse: African, European, Indigenous influences.",
    manners: "Warm greetings with cheek kisses. Personal space close. Don't make OK sign (offensive). Arrive fashionably late (30 min) to social events.",
    dressCode: "Casual. Beachwear only at beach. Havaianas everywhere.",
    safetyNotes: "Petty theft risk—don't flash valuables. Use ride apps (99/Uber). Avoid certain areas at night. Drink bottled water.",
    taxResidencyDays: 183,
    utcOffset: "-3"
  },
  "mexico": {
    currency: "MXN (Mexican Peso). Cards in cities. Cash in markets/small towns.",
    language: "Spanish. Some English in tourist areas.",
    emergency: "911",
    businessHours: "Mon-Fri 9AM-6PM. Comida (lunch) 2-4PM is main meal. Shops open late. Sunday family day.",
    tipping: "10-15% at restaurants. Tip attendants, valets, bag handlers. Propina expected.",
    culturalNotes: "Family is everything. Day of the Dead (Nov 1-2). Taco culture is sacred. Mañana doesn't always mean tomorrow. Warm, hospitable.",
    manners: "Greet with handshake or cheek kiss. Use 'usted' for formal. Be patient—things move slowly. Don't discuss Narcos stereotypes.",
    dressCode: "Casual. Cover up for churches. Light fabrics for heat.",
    safetyNotes: "Tourist areas generally safe. Use registered taxis (Uber/DiDi). Drink bottled water. Some states require extra caution.",
    taxResidencyDays: 183,
    utcOffset: "-6"
  },
  "turkey": {
    currency: "TRY (Turkish Lira). High inflation—rates change fast. Cards in cities. Cash in bazaars.",
    language: "Turkish. English in tourist areas, limited elsewhere.",
    emergency: "112",
    businessHours: "Mon-Fri 9AM-6PM. Grand Bazaar Mon-Sat 8:30AM-7PM. Mosques close during prayer times.",
    tipping: "10% at restaurants. Round up taxis. Tip hamam attendants.",
    culturalNotes: "Turkish tea offered everywhere (accept it). Hammam (Turkish bath) tradition. Bargaining at bazaars expected. Mosque etiquette important.",
    manners: "Remove shoes in mosques and homes. Women: cover head in mosques. Don't blow nose at table. Tea is social glue—never refuse.",
    dressCode: "Modest in religious areas. Cover head/shoulders at mosques. Casual in Istanbul generally.",
    safetyNotes: "Major cities safe. Traffic in Istanbul chaotic. Istanbul Card for transport. Earthquake zone—know exits.",
    taxResidencyDays: 183,
    utcOffset: "+3"
  },
  "greece": {
    currency: "EUR (€). Cash for tavernas and islands. Cards in Athens/tourist areas.",
    language: "Greek. Good English in tourist areas.",
    emergency: "112",
    businessHours: "Variable. Many shops close 2-5PM for siesta. Dinner starts 9-10PM. Islands more relaxed. Sunday mostly closed.",
    tipping: "5-10% appreciated. Leave on table. Not obligatory.",
    culturalNotes: "Filoxenia (hospitality) is core value. Opa! culture. Greek coffee ritual. Island hopping essential. Ancient history everywhere.",
    manners: "Open palm hand gesture is offensive (moutza). Nod down for yes, up for no (opposite of most countries). Share food. Arrive late for dinners.",
    dressCode: "Casual. Cover shoulders at monasteries/churches. Comfortable shoes for ruins.",
    safetyNotes: "Very safe. Extreme heat Jun-Aug. Pickpockets at Acropolis. Island ferries: book ahead in summer.",
    taxResidencyDays: 183,
    utcOffset: "+2"
  },
  "egypt": {
    currency: "EGP (Egyptian Pound). Cash dominant. Bargain everything.",
    language: "Arabic. English at hotels/tourist sites.",
    emergency: "122 (police), 123 (ambulance)",
    businessHours: "Sun-Thu 9AM-5PM. Friday is holy day. Bazaars stay open late. Ramadan: everything shifts.",
    tipping: "Baksheesh culture—tip everyone (guards, guides, helpers). 10-15% restaurants. Small bills essential.",
    culturalNotes: "Ancient meets modern. Baksheesh (tipping) is way of life. Haggling expected at markets. Hospitality legendary. Tea/coffee always offered.",
    manners: "Use right hand. Dress modestly. Don't photograph military/police. Remove shoes in homes. Accept tea when offered.",
    dressCode: "Modest, especially women. Cover shoulders and knees. Head scarf for mosques.",
    safetyNotes: "Tourist police available. Stick to official guides at pyramids. Drink bottled water only. Avoid protests.",
    taxResidencyDays: 183,
    utcOffset: "+2"
  },
  "south africa": {
    currency: "ZAR (Rand). Cards in cities/malls. Cash for markets.",
    language: "11 official languages. English widely used in business.",
    emergency: "10111 (police), 10177 (ambulance)",
    businessHours: "Mon-Fri 8AM-5PM. Malls 9AM-6PM (9PM Thu-Fri). Sunday hours reduced.",
    tipping: "10-15% at restaurants. Tip car guards (R5-10). Tip at gas stations.",
    culturalNotes: "Rainbow nation—incredibly diverse. Braai (BBQ) culture. Ubuntu philosophy. Wine country world-class. Safari/wildlife iconic.",
    manners: "Friendly, warm greetings. Handshake common. Be respectful of diversity. Don't discuss apartheid casually.",
    dressCode: "Casual. Sun protection essential. Layers for temperature swings.",
    safetyNotes: "Don't flash valuables. Use ride apps. Stay aware at night. Safari: follow guide instructions strictly. Load-shedding (power cuts) possible.",
    taxResidencyDays: 183,
    utcOffset: "+2"
  },
  "morocco": {
    currency: "MAD (Dirham). Cash dominant, especially in medinas. Some cards in riads/restaurants.",
    language: "Arabic, Berber, French. Some English in tourist areas.",
    emergency: "190 (police), 150 (fire), 15 (ambulance)",
    businessHours: "Mon-Fri 8:30AM-6:30PM. Friday prayer noon-2PM closures. Souks open late. Ramadan = shifted hours.",
    tipping: "10% restaurants. Tip guides generously. Small tips to hammam staff.",
    culturalNotes: "Mint tea is hospitality ritual. Medina navigation is an art. Hammam essential experience. Friday is holy. Handicrafts world-renowned.",
    manners: "Use right hand. Accept tea (refusing is rude). Bargain at souks (start at 30% of asking). Ask before photographing people. Modest behavior.",
    dressCode: "Modest. Women: cover shoulders, knees. Men: no shorts in medinas. Remove shoes in homes/riads.",
    safetyNotes: "Generally safe. Assertive vendors in medinas. Use guides in Fez medina. Drink bottled water.",
    taxResidencyDays: 183,
    utcOffset: "+1"
  },
  "kenya": {
    currency: "KES (Kenyan Shilling). M-Pesa mobile money ubiquitous. Cash for markets.",
    language: "Swahili, English.",
    emergency: "999 or 112",
    businessHours: "Mon-Fri 8AM-5PM. Sat 8AM-1PM. Markets open early.",
    tipping: "10% at restaurants. Tip safari guides well ($10-20/day per group).",
    culturalNotes: "Safari capital. Masai culture. Vibrant art scene in Nairobi. Long-distance runners' country. Community-oriented.",
    manners: "Jambo (hello). Use right hand. Respect elders. Ask before photographing people/villages.",
    dressCode: "Casual but modest. Safari: neutral colors (no blue—tsetse flies). Layers for highland cool mornings.",
    safetyNotes: "Safari safety: listen to guides. Nairobi: stay in known areas. Use Uber. Malaria prophylaxis for some areas.",
    taxResidencyDays: 183,
    utcOffset: "+3"
  },
  "nigeria": {
    currency: "NGN (Naira). Cash dominant. Some cards in Lagos/Abuja upscale venues.",
    language: "English (official). Yoruba, Igbo, Hausa widely spoken.",
    emergency: "199 (police), 112",
    businessHours: "Mon-Fri 8AM-5PM. Markets 7AM-7PM. Lagos traffic = plan extra time.",
    tipping: "10% restaurants. Tip service staff generously.",
    culturalNotes: "Afrobeats capital. Lagos is vibrant megacity. Strong entrepreneurial culture. Jollof rice debates are serious. Nollywood is huge.",
    manners: "Greet elders first. Use right hand. Titles important. Dress well for meetings. Hospitality generous.",
    dressCode: "Smart casual for business. Traditional attire respected. Dress well—Nigerians are fashion-forward.",
    safetyNotes: "Lagos: use ride apps. Avoid certain areas at night. Don't flash valuables. Strong security in good hotels.",
    taxResidencyDays: 183,
    utcOffset: "+1"
  },
  "colombia": {
    currency: "COP (Colombian Peso). Cards in cities. Cash for small towns/markets.",
    language: "Spanish.",
    emergency: "123",
    businessHours: "Mon-Fri 8AM-5PM. Lunch 12-2PM. Sunday most shops closed.",
    tipping: "10% service charge often included (voluntario). Ask 'desea incluir el servicio?'.",
    culturalNotes: "Incredibly friendly people. Coffee culture (tinto). Salsa in Cali. Medellín transformation inspiring. Biodiversity world-leading.",
    manners: "Warm greetings. Punctuality flexible. Personal space close. Don't reference drug stereotypes.",
    dressCode: "Casual, climate-dependent. Bogotá cooler (layers). Coast casual.",
    safetyNotes: "Tourist areas safe. Use ride apps. Don't accept drinks from strangers. Altitude in Bogotá (2,640m)—take it easy first day.",
    taxResidencyDays: 183,
    utcOffset: "-5"
  },
  "argentina": {
    currency: "ARS (Argentine Peso). Parallel exchange rate exists—research 'blue dollar'. Cash can get better rates.",
    language: "Spanish (Rioplatense—unique accent, vos instead of tú).",
    emergency: "911",
    businessHours: "Mon-Fri 9AM-6PM. Dinner starts 9:30-10PM. Merienda (tea time) 5PM. Sunday = family day.",
    tipping: "10% at restaurants. Round up taxis.",
    culturalNotes: "Tango in Buenos Aires. Mate (herbal tea) is ritual. Asado (BBQ) on weekends sacred. Late everything. Passionate about football (Messi!).",
    manners: "One cheek kiss greeting (everyone). Mate sharing: don't say thank you until you're done (it means 'no more'). Long dinners. Don't rush.",
    dressCode: "Stylish casual. Buenos Aires is fashionable. Layers for changing weather.",
    safetyNotes: "Buenos Aires: watch for petty theft in La Boca/San Telmo. Use official taxis/apps. Blue dollar rate for cash exchanges.",
    taxResidencyDays: 183,
    utcOffset: "-3"
  },
  "chile": {
    currency: "CLP (Chilean Peso). Cards widely accepted.",
    language: "Spanish (fast and slang-heavy).",
    emergency: "131 (ambulance), 132 (fire), 133 (police)",
    businessHours: "Mon-Fri 9AM-6PM. Lunch 1-3PM. Santiago modern and efficient.",
    tipping: "10% restaurants. Round up taxis.",
    culturalNotes: "Wine country (Carmenere grape). Patagonia & Atacama extremes. Empanadas everywhere. Once (tea time) at 5-6PM.",
    manners: "Friendly but more formal than other Latin America. Handshake or one kiss. Punctuality more valued.",
    dressCode: "Smart casual in Santiago. Outdoor gear for Patagonia.",
    safetyNotes: "Safest in South America. Earthquake zone—know protocols. Santiago air quality variable in winter.",
    taxResidencyDays: 183,
    utcOffset: "-4"
  },
  "peru": {
    currency: "PEN (Sol). Cash for markets. Cards in Lima upscale places.",
    language: "Spanish, Quechua.",
    emergency: "105 (police), 116 (fire), 117 (ambulance)",
    businessHours: "Mon-Fri 9AM-6PM. Markets open early. Cusco altitude closes things earlier.",
    tipping: "10% at restaurants. Tip trekking porters/guides well.",
    culturalNotes: "Machu Picchu. Ceviche is national dish. Altitude in Cusco (3,400m)—coca tea helps. Pisco sour national drink.",
    manners: "Warm greetings. Patience valued. Respect Incan heritage.",
    dressCode: "Layers for altitude changes. Modest in communities. Hiking gear for treks.",
    safetyNotes: "Altitude sickness real in Cusco—acclimatize 1-2 days. Avoid tap water. Licensed guides for Inca Trail.",
    taxResidencyDays: 183,
    utcOffset: "-5"
  },
  "indonesia": {
    currency: "IDR (Rupiah). Cash still important. Cards in Bali/Jakarta upscale venues.",
    language: "Bahasa Indonesia. English in tourist areas.",
    emergency: "112 or 110 (police), 118 (ambulance), 113 (fire)",
    businessHours: "Mon-Fri 8AM-4PM. Bali more relaxed. Friday prayer break. Malls late.",
    tipping: "Not expected but appreciated. 5-10% at restaurants. Round up Grab rides.",
    culturalNotes: "World's largest Muslim-majority nation. Bali is Hindu. 17,000+ islands. Batik is cultural art. Community-oriented. Don't touch offerings on sidewalks.",
    manners: "Right hand for everything. Remove shoes indoors. Modest dress at temples. Head touching offensive. Don't point with index finger.",
    dressCode: "Modest outside beach areas. Sarong/scarf for temples. Light fabrics for humidity.",
    safetyNotes: "Bali safe but watch motorbike traffic. Don't buy/use drugs (death penalty). Earthquake/volcano zone. Mosquito protection for dengue.",
    taxResidencyDays: 183,
    utcOffset: "+7 to +9"
  },
  "malaysia": {
    currency: "MYR (Ringgit). Cards in cities. Cash for hawker stalls.",
    language: "Malay. English widely spoken. Mandarin/Tamil communities.",
    emergency: "999",
    businessHours: "Mon-Fri 9AM-5PM. Many states have Friday/Saturday weekend. Malls open late.",
    tipping: "Not expected. Service charge 10% often on bill.",
    culturalNotes: "Multiethnic (Malay, Chinese, Indian). Food is incredible and cheap. Halal widely available. Petronas Towers iconic. Truly Asia.",
    manners: "Right hand for giving/receiving. Modest dress at mosques. Remove shoes indoors. Respect all ethnicities' customs.",
    dressCode: "Modest at religious sites. Casual elsewhere. Light fabrics for heat.",
    safetyNotes: "Generally safe. Grab for transport. Dengue risk—use repellent. Don't insult royalty.",
    taxResidencyDays: 182,
    utcOffset: "+8"
  },
  "vietnam": {
    currency: "VND (Dong). Cash dominant. Becoming more card-friendly. Grab for payments.",
    language: "Vietnamese. Limited English. Google Translate essential.",
    emergency: "113 (police), 115 (ambulance), 114 (fire)",
    businessHours: "Mon-Fri 8AM-5PM. Street food all hours. Markets open very early.",
    tipping: "Not expected but appreciated at tourist restaurants. Round up.",
    culturalNotes: "Motorbike culture—crossing streets is an art (walk slowly, don't stop). Pho for breakfast. Coffee drip culture. Ao dai is national dress.",
    manners: "Both hands for giving/receiving. Remove shoes indoors. Respect elders. Don't touch heads. Crossing street: walk steady, don't stop.",
    dressCode: "Modest at temples. Casual elsewhere. Light fabrics.",
    safetyNotes: "Very safe for violent crime. Traffic is dangerous—look both ways always. Grab for transport. Bottled water only.",
    taxResidencyDays: 183,
    utcOffset: "+7"
  },
  "philippines": {
    currency: "PHP (Peso). Cash dominant outside Manila. GCash popular locally.",
    language: "Filipino (Tagalog), English (widely spoken—second language).",
    emergency: "911",
    businessHours: "Mon-Fri 8AM-5PM. Malls open late (10AM-9PM). Filipino time = flexible.",
    tipping: "10% at restaurants. Tip hotel staff, drivers.",
    culturalNotes: "Incredibly hospitable. Family-centric. Karaoke culture. Island paradise (7,641 islands). Spanish & American influence.",
    manners: "Smile a lot. 'Po' and 'Opo' for respect. Mano gesture to elders. Don't turn down food/drink offers.",
    dressCode: "Casual. Light fabrics. Cover up for churches.",
    safetyNotes: "Typhoon season Jun-Nov (especially eastern coast). Stick to tourist areas. Use Grab. Travel insurance essential.",
    taxResidencyDays: 180,
    utcOffset: "+8"
  },
  "taiwan": {
    currency: "TWD (New Taiwan Dollar). Cards in cities. Cash for night markets.",
    language: "Mandarin Chinese. Some English in Taipei.",
    emergency: "110 (police), 119 (fire/ambulance)",
    businessHours: "Mon-Fri 9AM-6PM. Night markets 5PM-midnight. 7-Eleven everywhere 24/7.",
    tipping: "Not expected. Service charge at hotels.",
    culturalNotes: "Night market culture legendary. Bubble tea origin. Incredibly friendly. Hot springs. Tech-savvy. EasyCard for everything.",
    manners: "Two hands for business cards. Remove shoes indoors. Queue patiently. Don't stick chopsticks in rice.",
    dressCode: "Casual. Comfortable for walking/night markets. Rain gear for monsoon season.",
    safetyNotes: "One of safest places globally. Typhoon/earthquake zone. Excellent healthcare. MRT spotless.",
    taxResidencyDays: 183,
    utcOffset: "+8"
  },
  "hong kong": {
    currency: "HKD. Octopus card for everything. Cards widely accepted.",
    language: "Cantonese, English. Signs bilingual.",
    emergency: "999",
    businessHours: "Mon-Fri 9AM-6PM. Shops 10AM-10PM+. City that never sleeps.",
    tipping: "10% service charge usually included. Round up taxis.",
    culturalNotes: "East meets West. Dim sum culture. Victoria Peak views. Dense, vertical city. Incredible street food. Efficiency obsession.",
    manners: "Handshake for business. Two hands for business cards. Queue orderly. Fast-paced—don't block escalators.",
    dressCode: "Smart casual. Business formal for meetings. Climate is subtropical—light layers.",
    safetyNotes: "Extremely safe. MTR excellent. Typhoon signals (T8 = city shuts down). Very expensive housing/dining.",
    taxResidencyDays: 180,
    utcOffset: "+8"
  },
  "new zealand": {
    currency: "NZD. Almost cashless. Contactless everywhere.",
    language: "English, Te Reo Māori.",
    emergency: "111",
    businessHours: "Mon-Fri 9AM-5PM. Weekend hours reduced. Remote areas close early.",
    tipping: "Not expected at all. No tipping culture.",
    culturalNotes: "Māori culture respected—learn basics (kia ora = hello). Outdoors obsession. Lord of the Rings landscapes. Sustainable mindset.",
    manners: "Friendly and unpretentious. Hongi (nose press) for Māori greeting. Take shoes off indoors. BYOB restaurants common.",
    dressCode: "Very casual. Outdoor gear for adventure. Layers—4 seasons in a day.",
    safetyNotes: "Extremely safe. Earthquake zone. UV extreme (hole in ozone). No snakes! Biosecurity strict at border—declare everything.",
    taxResidencyDays: 183,
    utcOffset: "+12"
  },
  "austria": {
    currency: "EUR (€). Cards accepted. Cash helpful in smaller towns.",
    language: "German (Austrian dialect). English in Vienna/tourist areas.",
    emergency: "112 or 133 (police), 144 (ambulance), 122 (fire)",
    businessHours: "Mon-Fri 9AM-6PM. Saturday to 5PM. CLOSED Sunday. Vienna opera/concert schedule important.",
    tipping: "Round up or 5-10%. Say amount you want to pay.",
    culturalNotes: "Classical music capital. Coffeehouse culture (UNESCO). Skiing world-class. Wiener Schnitzel. Sachertorte. Formal yet warm.",
    manners: "Use 'Grüß Gott' (not 'Hallo'). Titles matter (Herr Doktor). Be punctual. Quiet on Sundays.",
    dressCode: "Elegant casual. Dirndl/Lederhosen at festivals. Smart for opera/concerts.",
    safetyNotes: "Very safe. Sunday closures strict. Mountain safety—check conditions. Vienna public transport excellent.",
    taxResidencyDays: 183,
    utcOffset: "+1"
  },
  "belgium": {
    currency: "EUR (€). Cards widely accepted.",
    language: "Dutch (Flanders), French (Wallonia), German. Language politics sensitive.",
    emergency: "112",
    businessHours: "Mon-Sat 10AM-6PM. Sunday closed. Lunch 12-1PM.",
    tipping: "Included in prices. Round up for good service.",
    culturalNotes: "Chocolate, beer, waffles (but don't call them Belgian waffles). EU/NATO headquarters. Comic strip culture. Modest people.",
    manners: "Three kisses on cheeks. Punctuality valued in Flanders, more relaxed in Wallonia. Don't mix up Dutch/French regions.",
    dressCode: "Smart casual. Similar to Northern European standards.",
    safetyNotes: "Very safe. Brussels has some neighborhoods to avoid at night. Excellent train network.",
    taxResidencyDays: 183,
    utcOffset: "+1"
  },
  "czech republic": {
    currency: "CZK (Czech Crown). Cards in Prague. Cash in smaller cities. NOT in Eurozone.",
    language: "Czech. English in Prague, less elsewhere.",
    emergency: "112 or 155 (ambulance), 158 (police)",
    businessHours: "Mon-Fri 9AM-6PM. Prague shops open longer. Sunday variable.",
    tipping: "10% at restaurants. Round up taxis.",
    culturalNotes: "Beer culture (cheapest and best in Europe). Prague Castle. Bohemian history. Atheist majority. Direct communication.",
    manners: "Remove shoes indoors. Don't clink beer glasses if you're Czech. Toast by looking into eyes.",
    dressCode: "Casual. Smart casual for nice restaurants.",
    safetyNotes: "Very safe. Prague tourist scams (taxi, exchange). Use Revolut/Wise for exchange rates. Drink tap water.",
    taxResidencyDays: 183,
    utcOffset: "+1"
  },
  "poland": {
    currency: "PLN (Złoty). Cards widely accepted. Not Eurozone.",
    language: "Polish. English among younger generation.",
    emergency: "112",
    businessHours: "Mon-Fri 8AM-6PM. Malls 10AM-10PM. Sunday trading ban (most shops closed).",
    tipping: "10% at restaurants appreciated. Not obligatory.",
    culturalNotes: "Rich history. Vodka culture. Pierogi national dish. Catholic traditions. Thriving tech scene. Incredibly hospitable once you're friends.",
    manners: "Firm handshake. 'Dzień dobry' (good day). Flowers for hosts (odd numbers). Men may kiss women's hand.",
    dressCode: "Smart casual. More formal for business.",
    safetyNotes: "Very safe. Winter can be harsh (-20°C). Excellent budget destination. Krakow—don't walk on tram tracks.",
    taxResidencyDays: 183,
    utcOffset: "+1"
  },
  "sweden": {
    currency: "SEK (Swedish Krona). Almost cashless. Some places refuse cash.",
    language: "Swedish. Nearly everyone speaks excellent English.",
    emergency: "112",
    businessHours: "Mon-Fri 9AM-5PM. Systembolaget (alcohol store) limited hours, closed Sunday. Fika breaks sacred.",
    tipping: "Round up. Not expected. Service included.",
    culturalNotes: "Fika (coffee break) is lifestyle. Lagom (just the right amount). Sustainability leaders. Midnight sun/polar night. IKEA homeland. Saunas.",
    manners: "Punctual. Respect personal space. Remove shoes indoors. Don't boast. Recycling serious. Queue culture.",
    dressCode: "Minimalist, clean aesthetic. Functional outdoor wear. Layers essential.",
    safetyNotes: "Very safe. Dark winters (light therapy helps). Alcohol expensive and regulated. Right of access (Allemansrätten) to nature.",
    taxResidencyDays: 183,
    utcOffset: "+1"
  },
  "norway": {
    currency: "NOK (Norwegian Krone). Almost cashless. Very expensive.",
    language: "Norwegian. Excellent English everywhere.",
    emergency: "112 or 113 (ambulance), 110 (fire)",
    businessHours: "Mon-Fri 9AM-5PM. Saturday to 3PM. Closed Sunday. Vinmonopolet (alcohol) limited hours.",
    tipping: "Not expected. Round up if you like.",
    culturalNotes: "Fjords and northern lights. Friluftsliv (outdoor living philosophy). Oil wealth. Koselig (Norwegian hygge). Cross-country skiing religion.",
    manners: "Punctual. Independent/reserved initially. Personal space important. Don't brag. Nature respect paramount.",
    dressCode: "Practical outdoor wear. 'There's no bad weather, only bad clothes.' Layers always.",
    safetyNotes: "Extremely safe. Very expensive (budget 50-100% more than EU). Road conditions in winter. Polar bears on Svalbard.",
    taxResidencyDays: 183,
    utcOffset: "+1"
  },
  "denmark": {
    currency: "DKK (Danish Krone). Almost cashless. MobilePay popular locally.",
    language: "Danish. Excellent English.",
    emergency: "112",
    businessHours: "Mon-Fri 10AM-6PM. Saturday to 4PM. Sunday mostly closed.",
    tipping: "Not expected. Service included. Round up if happy.",
    culturalNotes: "Hygge (cozy contentment). Cycling capital (Copenhagen). Design-focused. Smørrebrød (open sandwiches). World's happiest people. Lego homeland.",
    manners: "Informal, egalitarian. Use first names. Be punctual. Split bills. Bicycle culture—stay out of bike lanes.",
    dressCode: "Minimalist Scandinavian chic. Practical, clean lines. Rain gear essential.",
    safetyNotes: "Very safe. Cycling rules strict—use hand signals. Expensive dining. Christiania has own rules.",
    taxResidencyDays: 183,
    utcOffset: "+1"
  },
  "ireland": {
    currency: "EUR (€). Cards widely accepted. Cash for pubs in rural areas.",
    language: "English, Irish (Gaeilge).",
    emergency: "999 or 112",
    businessHours: "Mon-Sat 9AM-6PM. Sunday 12-6PM. Pubs open 10:30AM-11:30PM (12:30AM Fri-Sat).",
    tipping: "10% at sit-down restaurants. No tipping at pubs/bars.",
    culturalNotes: "Pub culture central. Craic (fun, conversation). Literary heritage. Guinness tastes different in Ireland. Music sessions in pubs. Don't call it part of UK.",
    manners: "Friendly, chatty. Self-deprecating humor. Buy rounds at pub. Never order a Black and Tan. 'Grand' means fine/ok.",
    dressCode: "Casual. Rain jacket essential. Layers for unpredictable weather.",
    safetyNotes: "Very safe. Weather changeable. Drive on the left. Rural roads narrow.",
    taxResidencyDays: 183,
    utcOffset: "0"
  },
  "iceland": {
    currency: "ISK (Icelandic Krona). Cards everywhere including remote areas. Cash rarely needed.",
    language: "Icelandic. Excellent English.",
    emergency: "112",
    businessHours: "Mon-Fri 9AM-5PM. Saturday shorter. Many tourist activities weather-dependent.",
    tipping: "Not expected. Prices include service.",
    culturalNotes: "Northern lights, geysers, glaciers. Most peaceful country. Everyone in hot springs. Naming conventions (patronymic). Elf folklore taken seriously.",
    manners: "Casual, egalitarian. Use first names (even president). Respect nature—don't step off trails. Follow geothermal safety signs.",
    dressCode: "Layers, layers, layers. Waterproof outer shell. Wool base layers. No cotton.",
    safetyNotes: "Extremely safe. Weather is the danger. River crossings deadly. No trains. Expensive—budget generously. 112 app for GPS sharing.",
    taxResidencyDays: 183,
    utcOffset: "0"
  },
  "croatia": {
    currency: "EUR (€, since 2023). Cards in cities. Cash for islands/small towns.",
    language: "Croatian. English common in tourist areas.",
    emergency: "112",
    businessHours: "Mon-Fri 8AM-4PM (summer shift). Shops in Split/Dubrovnik open late in summer. Winter hours reduced.",
    tipping: "10% appreciated. Round up taxis.",
    culturalNotes: "Game of Thrones filming locations. Adriatic coast stunning. Coffee culture (long sits). Domestic pride strong. Plitvice Lakes UNESCO.",
    manners: "Warm, family-oriented. Coffee is social event (never rush). Greet with handshake.",
    dressCode: "Casual. Beach casual at coast. Comfortable for old town cobblestones.",
    safetyNotes: "Very safe. Dubrovnik extremely crowded in summer. Book ahead Jul-Aug. Bura wind can cancel ferries.",
    taxResidencyDays: 183,
    utcOffset: "+1"
  },
  "hungary": {
    currency: "HUF (Forint). Cards in Budapest. Cash for markets. Not Eurozone.",
    language: "Hungarian (unique language family). English among youth.",
    emergency: "112",
    businessHours: "Mon-Fri 9AM-6PM. Saturday to 1PM. Sunday mostly closed.",
    tipping: "10-15% at restaurants (cash preferred). Don't leave on table—tell the amount.",
    culturalNotes: "Thermal bath culture (Széchenyi, Gellért). Ruin bars in Budapest. Paprika in everything. Tokaji wine world-famous.",
    manners: "Don't clink beer glasses (historical tradition). Name order is surname first. Remove shoes in homes.",
    dressCode: "Smart casual. Bring swimwear for thermal baths.",
    safetyNotes: "Budapest safe. Watch for taxi/exchange scams. District VII (ruin bars) lively but watch belongings.",
    taxResidencyDays: 183,
    utcOffset: "+1"
  },
  "romania": {
    currency: "RON (Romanian Leu). Cards in cities. Cash for rural areas.",
    language: "Romanian (Romance language). Some English/French.",
    emergency: "112",
    businessHours: "Mon-Fri 9AM-5PM. Saturday shorter. Rural: very early mornings.",
    tipping: "10% at restaurants. Round up taxis.",
    culturalNotes: "Transylvania and Dracula tourism. Painted monasteries. Incredible nature. Hospitable rural communities. IT sector booming.",
    manners: "Warm hospitality. Accept food/drink offers. Shoes off indoors. Orthodox traditions.",
    dressCode: "Casual. Modest at monasteries. Outdoor gear for Carpathians.",
    safetyNotes: "Generally safe. Stray dogs in some areas. Bucharest nightlife vibrant. Hiking in Carpathians—bears exist.",
    taxResidencyDays: 183,
    utcOffset: "+2"
  },
  "israel": {
    currency: "ILS (New Israeli Shekel). Cards widely accepted.",
    language: "Hebrew, Arabic. English widely spoken.",
    emergency: "100 (police), 101 (ambulance), 102 (fire)",
    businessHours: "Sun-Thu 9AM-5PM. Friday: close early before Shabbat. Saturday: everything closed (except in Arab areas, some restaurants).",
    tipping: "10-15% at restaurants. Tip tour guides.",
    culturalNotes: "Shabbat (Friday sunset-Saturday sunset): public transport stops, most shops close. Incredible food scene. Tech startup nation. Ancient + ultra-modern.",
    manners: "Direct communication (not rude—Israeli style). Security questions at airport are thorough—be patient. Shabbat respect.",
    dressCode: "Casual. Modest at religious sites (cover shoulders, knees, head at Western Wall). Beachwear at beach only.",
    safetyNotes: "Security situation varies—check advisories. Airport security thorough (arrive 3hrs early). Iron Dome provides safety. Very modern healthcare.",
    taxResidencyDays: 183,
    utcOffset: "+2"
  },
  "jordan": {
    currency: "JOD (Jordanian Dinar). Cash preferred. Cards at hotels/restaurants.",
    language: "Arabic. English widely spoken in tourist/business contexts.",
    emergency: "911",
    businessHours: "Sat-Thu 8AM-6PM. Friday is day off. Ramadan: reduced hours.",
    tipping: "10% at restaurants. Tip guides and drivers.",
    culturalNotes: "Petra (world wonder). Dead Sea. Wadi Rum. Bedouin hospitality legendary—tea is always offered. Mansaf is national dish.",
    manners: "Right hand for eating/greeting. Accept hospitality. Modest behavior. Remove shoes when entering homes.",
    dressCode: "Modest, especially women. Cover shoulders and knees. Headscarf for mosques.",
    safetyNotes: "Very safe for Middle East. Stable country. Petra requires good shoes. Dead Sea—don't shave before floating. Desert sun intense.",
    taxResidencyDays: 183,
    utcOffset: "+3"
  },
  "qatar": {
    currency: "QAR (Qatari Riyal). Cards everywhere. Modern payment systems.",
    language: "Arabic. English widely used.",
    emergency: "999",
    businessHours: "Sun-Thu 7:30AM-5PM. Malls 10AM-10PM. Ramadan: shifted hours.",
    tipping: "10% if no service charge. Round up taxis.",
    culturalNotes: "World Cup 2022 host. Pearl diving heritage. Al Jazeera headquarters. Rapidly modernizing. Souq Waqif is cultural heart.",
    manners: "Modest behavior. Right hand for greetings. Respect Islamic customs. Don't photograph locals without permission.",
    dressCode: "Modest. Cover shoulders and knees in public. Beachwear only at beach/pool.",
    safetyNotes: "Extremely safe. Summer heat extreme (45°C+). Alcohol only in licensed hotels. Stay hydrated.",
    taxResidencyDays: 183,
    utcOffset: "+3"
  },
  "saudi arabia": {
    currency: "SAR (Saudi Riyal). Cards accepted. Cash for souks.",
    language: "Arabic. English in business.",
    emergency: "911 or 999",
    businessHours: "Sun-Thu 9AM-5PM. Prayer times: everything closes 5x daily for 20-30 min. Friday afternoon off.",
    tipping: "10-15% at restaurants. Tip service staff.",
    culturalNotes: "Opening up rapidly (Vision 2030). Entertainment options growing. Gender mixing now allowed. Holy sites (Mecca/Medina—non-Muslims prohibited).",
    manners: "Right hand for everything. Respect prayer times. Modest behavior. Don't photograph military/government buildings.",
    dressCode: "Modest for everyone. Women: abaya not required but cover shoulders/knees. Men: long pants.",
    safetyNotes: "Very safe. Extreme heat summer. Alcohol completely prohibited. Drug penalties severe.",
    taxResidencyDays: 183,
    utcOffset: "+3"
  },
  "costa rica": {
    currency: "CRC (Colón). USD widely accepted. Cards in tourist areas.",
    language: "Spanish. Good English in tourist areas.",
    emergency: "911",
    businessHours: "Mon-Fri 8AM-5PM. Pura vida pace—relaxed.",
    tipping: "10% service charge included. Additional tip appreciated.",
    culturalNotes: "Pura vida (pure life) is philosophy. No military. Biodiversity hotspot. Eco-tourism pioneer. Howler monkeys. Cloud forests.",
    manners: "Friendly, laid-back. Ticos are warm. Don't rush. Pura vida as greeting/goodbye/everything.",
    dressCode: "Casual. Hiking gear for rainforests. Light fabrics.",
    safetyNotes: "Safe for Central America. Petty theft at beaches—watch valuables. Riptides on Pacific coast. Roads can be rough.",
    taxResidencyDays: 183,
    utcOffset: "-6"
  },
  "panama": {
    currency: "USD (Balboa pegged to USD). US dollars used everywhere.",
    language: "Spanish. English in Panama City business/Canal zone.",
    emergency: "911",
    businessHours: "Mon-Fri 8AM-5PM. Panama City modern and business-oriented.",
    tipping: "10% at restaurants. Tip tour guides.",
    culturalNotes: "Panama Canal. Banking hub. Casco Viejo historic quarter. Indigenous Kuna people. Tax-friendly for expats.",
    manners: "Friendly, warm. Handshakes common. Relaxed pace outside business.",
    dressCode: "Casual. Light fabrics for tropical heat.",
    safetyNotes: "Panama City safe in tourist areas. Avoid certain neighborhoods. Casco Viejo transformed. Rain season May-Nov heavy.",
    taxResidencyDays: 183,
    utcOffset: "-5"
  },
  "cuba": {
    currency: "CUP (Cuban Peso). Cash ONLY country essentially. Bring EUR/CAD to exchange. US credit cards don't work.",
    language: "Spanish.",
    emergency: "106 (police), 104 (ambulance)",
    businessHours: "Mon-Fri 8:30AM-5:30PM. Everything closes early. Nightlife starts late.",
    tipping: "CUC$1-3 at restaurants. Tip musicians, guides, hotel staff.",
    culturalNotes: "Classic cars, salsa, cigars, rum. Time-capsule feel. Music everywhere. Casas particulares (homestays). Limited internet (ETECSA wifi parks).",
    manners: "Warm, musical people. Dancing appreciated. Don't photograph military/police.",
    dressCode: "Casual. Light fabrics. Sun protection.",
    safetyNotes: "Very safe for violent crime. Scams exist. Dual economy confusing. Internet very limited. Bring medications—pharmacies limited.",
    taxResidencyDays: 183,
    utcOffset: "-5"
  },
  "jamaica": {
    currency: "JMD. USD widely accepted in tourist areas.",
    language: "English. Jamaican Patois.",
    emergency: "119 (police), 110 (fire/ambulance)",
    businessHours: "Mon-Fri 8:30AM-4:30PM. Saturday to noon. Resort areas operate differently.",
    tipping: "10-15% at restaurants. Tip hotel staff.",
    culturalNotes: "Reggae, Bob Marley heritage. Jerk cuisine. Blue Mountain coffee. Rastafarian culture. 'Irie' = everything's good.",
    manners: "Friendly, warm. Don't rush. Respect local culture beyond tourism.",
    dressCode: "Casual. Beachwear at beach only. Light fabrics.",
    safetyNotes: "Resort areas safe. Exercise caution in Kingston. Don't wander off resort areas at night. Marijuana decriminalized but not legal.",
    taxResidencyDays: 183,
    utcOffset: "-5"
  },
  "sri lanka": {
    currency: "LKR (Sri Lankan Rupee). Cash mostly. Cards at hotels.",
    language: "Sinhala, Tamil. English in tourist areas.",
    emergency: "119 (police), 110 (fire), 1990 (ambulance)",
    businessHours: "Mon-Fri 8:30AM-4:30PM. Poya (full moon) days are public holidays—everything closed.",
    tipping: "10% at restaurants. Tip drivers and guides well.",
    culturalNotes: "Buddhist majority. Temple of the Tooth. Tea plantations. Incredible wildlife. Ancient kingdoms. Spicy food (very spicy).",
    manners: "Remove shoes at temples. Cover shoulders/knees. Don't pose with Buddha statues (back to them is offensive). Right hand for giving.",
    dressCode: "Modest at temples. Light fabrics. White for temple visits.",
    safetyNotes: "Generally safe post-2019. Check current political situation. Dengue risk—repellent. Currents strong on south coast.",
    taxResidencyDays: 183,
    utcOffset: "+5:30"
  },
  "nepal": {
    currency: "NPR (Nepalese Rupee). Cash dominant. ATMs in Kathmandu/Pokhara.",
    language: "Nepali. English among trekking guides and tourism.",
    emergency: "100 (police), 101 (fire), 102 (ambulance)",
    businessHours: "Sun-Fri 10AM-5PM. Saturday is weekend. Government closes at 4PM.",
    tipping: "10% at restaurants. Tip trekking guides/porters well ($10-20/day).",
    culturalNotes: "Everest homeland. Buddhist & Hindu blend. Prayer flags. Dal bhat (twice daily). Trekking Mecca. Namaste greeting.",
    manners: "Namaste greeting with palms together. Remove shoes at temples/homes. Don't touch food with left hand. Walk clockwise around stupas.",
    dressCode: "Modest. Layers for trekking. Proper gear for mountains.",
    safetyNotes: "Safe. Altitude sickness above 3,000m—acclimatize. Earthquake zone. Trekking: hire registered guides. Helicopter rescue insurance recommended.",
    taxResidencyDays: 183,
    utcOffset: "+5:45"
  },
  "cambodia": {
    currency: "KHR (Riel) but USD used everywhere. Small change in Riel.",
    language: "Khmer. English/French in tourist areas.",
    emergency: "117 (police), 118 (fire), 119 (ambulance)",
    businessHours: "Mon-Sat 7:30AM-5:30PM. Markets open early. Angkor Wat 5AM-6PM.",
    tipping: "Not expected but appreciated. $1-2 at restaurants. Tip tuk-tuk drivers.",
    culturalNotes: "Angkor Wat (world's largest religious monument). Khmer Rouge history (visit Tuol Sleng respectfully). Amok curry national dish.",
    manners: "Sampeah greeting (palms together). Remove shoes in temples. Modest dress. Don't touch monks (especially women). Respect history.",
    dressCode: "Modest at temples (cover shoulders, knees). Casual elsewhere.",
    safetyNotes: "Generally safe. Watch for bag snatching from motorbikes. Don't step on landmine warning signs in rural areas. Drink bottled water.",
    taxResidencyDays: 183,
    utcOffset: "+7"
  },
  "myanmar": {
    currency: "MMK (Kyat). Cash ONLY for tourists. Bring crisp USD bills. ATMs unreliable.",
    language: "Burmese. Limited English.",
    emergency: "199",
    businessHours: "Mon-Fri 9:30AM-4:30PM. Government closes early.",
    tipping: "Not expected. Small tips appreciated at restaurants.",
    culturalNotes: "Pagodas everywhere (Shwedagon is gold). Thanaka face paste. Longyi (sarong) traditional wear. Incredibly kind people.",
    manners: "Remove shoes at ALL pagodas/temples. Don't point feet at Buddha images. Right hand for giving. Modest behavior.",
    dressCode: "Very modest. Cover arms and legs at temples. Longyi respectful to wear.",
    safetyNotes: "Check current political situation before traveling. Some areas restricted. Cash essential. Internet may be limited.",
    taxResidencyDays: 183,
    utcOffset: "+6:30"
  },
  "bangladesh": {
    currency: "BDT (Taka). Cash dominant. Limited card acceptance.",
    language: "Bengali. Some English in Dhaka business.",
    emergency: "999",
    businessHours: "Sun-Thu 9AM-5PM. Friday-Saturday weekend.",
    tipping: "5-10% at restaurants. Round up for services.",
    culturalNotes: "World's largest river delta. Sundarbans mangrove forest. Garment industry. Incredibly hospitable. Cricket obsession. Cox's Bazar longest beach.",
    manners: "Right hand for eating/giving. Modest behavior. Remove shoes indoors. Respect Islamic customs.",
    dressCode: "Modest. Cover arms and legs. Women: headscarf for mosques.",
    safetyNotes: "Dhaka traffic extreme. Flooding monsoon season. Drink bottled water. Political protests can disrupt travel.",
    taxResidencyDays: 183,
    utcOffset: "+6"
  },
  "pakistan": {
    currency: "PKR (Pakistani Rupee). Cash dominant. Cards at upscale venues in cities.",
    language: "Urdu, English (official). Regional languages.",
    emergency: "15 (ambulance—Edhi), 115 (Rescue), 1122 (Punjab)",
    businessHours: "Mon-Sat 9AM-5PM. Friday: extended lunch for prayers. Sunday variable.",
    tipping: "10% at restaurants. Tip hotel and service staff.",
    culturalNotes: "Incredible mountain scenery (K2, Karakoram). Hospitality unmatched. Cricket passion. Truck art. Rich Mughal heritage. Food is spectacular.",
    manners: "Right hand for eating/greeting. Modest behavior. Gender norms conservative. Accept tea/food offers. Remove shoes indoors.",
    dressCode: "Modest for both genders. Shalwar kameez respectful. Women: headscarf at mosques.",
    safetyNotes: "Major cities increasingly safe. Check advisories for border areas. Northern areas (Hunza, Gilgit) very safe and stunning. Travel insurance essential.",
    taxResidencyDays: 183,
    utcOffset: "+5"
  },
  "ethiopia": {
    currency: "ETB (Birr). Cash only mostly. Few ATMs outside Addis.",
    language: "Amharic. English in tourism/business.",
    emergency: "911 or 991",
    businessHours: "Mon-Fri 8AM-5PM. Ethiopian time: 6AM is 12:00 (clocks shifted 6 hours).",
    tipping: "10% at restaurants. Tip guides well.",
    culturalNotes: "Own calendar (13 months). Own time system. Coffee origin country—ceremony is cultural event. Injera (sourdough flatbread) with everything. Ancient Christian heritage.",
    manners: "Handshake with slight bow. Coffee ceremony: stay for all 3 rounds. Gursha (hand-feeding) is friendship gesture. Remove shoes in churches.",
    dressCode: "Modest. White shawl for church visits. Comfortable for altitude (Addis at 2,355m).",
    safetyNotes: "Addis Ababa generally safe. Check regional advisories. Altitude adjustment needed. Drink bottled water. Ethiopian calendar/clock can confuse—confirm times.",
    taxResidencyDays: 183,
    utcOffset: "+3"
  },
  "ghana": {
    currency: "GHS (Ghanaian Cedi). Cash and mobile money. Cards at upscale venues.",
    language: "English (official). Akan, Ewe, Ga widely spoken.",
    emergency: "999 or 112",
    businessHours: "Mon-Fri 8AM-5PM. Markets open early, close late.",
    tipping: "10% at restaurants. Tip hotel staff.",
    culturalNotes: "Gateway to Africa for diaspora. Cape Coast Castle history. Kente cloth. Jollof rice (Ghana vs Nigeria debate). Year of Return. Vibrant music scene.",
    manners: "Greet everyone in a room. Right hand for handshakes. Elders first. Dress well for occasions.",
    dressCode: "Smart casual. Traditional cloth for events.",
    safetyNotes: "One of safest West African countries. Malaria prophylaxis. Drink bottled water. Accra traffic heavy.",
    taxResidencyDays: 183,
    utcOffset: "0"
  },
  "tanzania": {
    currency: "TZS (Tanzanian Shilling). Cash preferred. USD for safaris/Zanzibar.",
    language: "Swahili, English.",
    emergency: "114 (police), 115 (fire), 116 (ambulance)",
    businessHours: "Mon-Fri 8AM-5PM. Zanzibar: Friday afternoon off.",
    tipping: "10% restaurants. Safari guides: $10-20/day. Climb porters: $5-10/day.",
    culturalNotes: "Serengeti, Kilimanjaro, Zanzibar. Masai culture. Hakuna Matata is real Swahili phrase. Spice island heritage. Migration spectacle.",
    manners: "Jambo (hello). Right hand for greetings. Respect local customs. Ask before photographing Masai—they may request payment.",
    dressCode: "Modest, especially Zanzibar (Muslim). Neutral colors for safari. Warm layers for Kilimanjaro.",
    safetyNotes: "Safari safe with guides. Malaria prophylaxis required. Zanzibar: watch tides for swimming. Kilimanjaro: acclimatize properly.",
    taxResidencyDays: 183,
    utcOffset: "+3"
  },
  "rwanda": {
    currency: "RWF (Rwandan Franc). Cash mostly. Mobile money growing.",
    language: "Kinyarwanda, English, French.",
    emergency: "112",
    businessHours: "Mon-Fri 8AM-5PM. Saturday morning. Clean city—plastic bags banned.",
    tipping: "10% at restaurants. Tip gorilla trekking guides well.",
    culturalNotes: "Gorilla trekking capital. Remarkable post-genocide transformation. Cleanest country in Africa. Community umuganda (last Saturday monthly). Innovative governance.",
    manners: "Friendly and dignified. Visit genocide memorial respectfully. Plastic bags prohibited. Community is paramount.",
    dressCode: "Smart casual. Long pants for gorilla trekking. Rain gear essential.",
    safetyNotes: "One of safest African countries. Gorilla permits: book months ahead ($1,500). Malaria prophylaxis. Clean and well-organized.",
    taxResidencyDays: 183,
    utcOffset: "+2"
  },
  "mauritius": {
    currency: "MUR (Mauritian Rupee). Cards at hotels/restaurants.",
    language: "English, French, Kreol Morisien.",
    emergency: "999 (police), 114 (ambulance), 115 (fire)",
    businessHours: "Mon-Fri 9AM-5PM. Saturday to noon. Sunday closed.",
    tipping: "10% at restaurants if not included.",
    culturalNotes: "Multicultural paradise. Hindu, Muslim, Creole, Chinese influences. Rum distilleries. Dodo island. Blue Penny Museum.",
    manners: "Friendly and multicultural. Respect all religious sites. Remove shoes at temples.",
    dressCode: "Casual resort wear. Modest at religious sites.",
    safetyNotes: "Very safe. Cyclone season Nov-Apr. Strong currents outside lagoons. UV intense.",
    taxResidencyDays: 183,
    utcOffset: "+4"
  },
  "fiji": {
    currency: "FJD (Fiji Dollar). Cash for villages. Cards at resorts.",
    language: "English, Fijian, Fiji Hindi.",
    emergency: "911 or 917",
    businessHours: "Mon-Fri 8AM-4:30PM. Island time prevails.",
    tipping: "Not expected. Gift to village chief when visiting (sevusevu—kava root).",
    culturalNotes: "Bula! (hello/welcome). Kava ceremony important. Village etiquette strict. 333 islands. Coral reefs. Community-based tourism.",
    manners: "Remove hat in villages. Ask permission before entering. Dress modestly in villages. Don't touch anyone's head.",
    dressCode: "Sulu (sarong) respectful in villages. Resort casual elsewhere.",
    safetyNotes: "Very safe. Cyclone season Nov-Apr. Coral cuts get infected fast. Sun protection essential.",
    taxResidencyDays: 183,
    utcOffset: "+12"
  },
  "maldives": {
    currency: "MVR (Rufiyaa). USD accepted at resorts. Cards at resorts.",
    language: "Dhivehi. English at resorts.",
    emergency: "119 (police), 102 (ambulance)",
    businessHours: "Sun-Thu 8AM-4PM. Resorts operate independently.",
    tipping: "10% service charge usually added. Additional tip $5-10/day for butler.",
    culturalNotes: "Islamic nation. Over-water villas iconic. Coral reefs. Tuna/coconut cuisine. Inhabited islands are conservative; resort islands are liberal.",
    manners: "Respect Islamic customs on local islands. Bikini only on resort islands/designated beaches. No alcohol on local islands.",
    dressCode: "Bikini at resort. Modest on local islands (cover shoulders, knees).",
    safetyNotes: "Very safe. Strong currents—follow dive master. Climate change threat. Resort islands vs. local islands: different rules.",
    taxResidencyDays: 183,
    utcOffset: "+5"
  },
  "oman": {
    currency: "OMR (Omani Rial). Cards accepted. Cash for souks.",
    language: "Arabic. English in business/tourism.",
    emergency: "9999",
    businessHours: "Sun-Thu 8AM-1PM, 4PM-7PM. Friday-Saturday weekend.",
    tipping: "10% at restaurants. Round up taxis.",
    culturalNotes: "Most welcoming Gulf state. Frankincense heritage. Wadis (canyons) stunning. Sultan Qaboos Grand Mosque. Traditional dhow boats.",
    manners: "Conservative and respectful. Modest behavior. Ask before photographing people. Respect mosque times.",
    dressCode: "Modest. Cover shoulders and knees. Headscarf for women at mosques.",
    safetyNotes: "Extremely safe. Flash floods in wadis—check weather. Summer heat extreme. 4WD needed for desert/wadi exploration.",
    taxResidencyDays: 183,
    utcOffset: "+4"
  },
  "bahrain": {
    currency: "BHD (Bahraini Dinar). Cards widely accepted.",
    language: "Arabic. English widely spoken.",
    emergency: "999",
    businessHours: "Sun-Thu 8AM-5PM. Malls open late.",
    tipping: "10% if no service charge.",
    culturalNotes: "Most liberal Gulf state. F1 Grand Prix. Pearl diving heritage. Causeway to Saudi Arabia. Multicultural.",
    manners: "Friendly and tolerant. Respect Islamic customs. Modest behavior in public.",
    dressCode: "More relaxed than other Gulf states. Modest still advised. Beachwear at beach only.",
    safetyNotes: "Very safe. Small island—easy to navigate. Summer heat intense. Alcohol available.",
    taxResidencyDays: 183,
    utcOffset: "+3"
  },
  "kuwait": {
    currency: "KWD (Kuwaiti Dinar—world's most valuable currency). Cards accepted.",
    language: "Arabic. English in business.",
    emergency: "112",
    businessHours: "Sun-Thu 8AM-4PM. Malls 10AM-10PM. Summer heat limits outdoor activity.",
    tipping: "10% at restaurants.",
    culturalNotes: "Oil wealth. Conservative. Kuwait Towers iconic. Diwaniya (social gathering). Generous hospitality.",
    manners: "Conservative dress and behavior. Right hand for greetings. Accept coffee/tea offers.",
    dressCode: "Modest. Cover shoulders and knees.",
    safetyNotes: "Very safe. Extreme summer heat (50°C+). Stay hydrated. Indoor culture in summer.",
    taxResidencyDays: 183,
    utcOffset: "+3"
  },
  "georgia": {
    currency: "GEL (Georgian Lari). Cash still common. Cards in Tbilisi.",
    language: "Georgian (unique alphabet). Some Russian/English.",
    emergency: "112",
    businessHours: "Mon-Fri 9AM-6PM. Shops open late. Tbilisi nightlife goes very late.",
    tipping: "10% at restaurants. Round up taxis.",
    culturalNotes: "World's oldest wine culture (qvevri). Incredible food (khinkali, khachapuri). Orthodox churches everywhere. Sulfur baths. Warm, overwhelming hospitality.",
    manners: "Guests are sacred (tradition of hospitality). Accept supra (feast) invitations. Toast traditions important—tamada (toastmaster). Respect churches.",
    dressCode: "Casual. Cover shoulders/knees in churches. Modest in rural areas.",
    safetyNotes: "Very safe. Tbilisi nightlife thriving. Mountain roads can be treacherous. Wine country Kakheti beautiful.",
    taxResidencyDays: 183,
    utcOffset: "+4"
  },
  "armenia": {
    currency: "AMD (Armenian Dram). Cash common. Cards in Yerevan.",
    language: "Armenian. Russian common. Some English in tourism.",
    emergency: "911",
    businessHours: "Mon-Fri 9AM-6PM. Many shops open weekends.",
    tipping: "10% at restaurants.",
    culturalNotes: "First Christian nation (301 AD). Ararat views. Genocide memorial important. Brandy tradition. Lavash bread UNESCO. Incredibly hospitable.",
    manners: "Warm, generous hosts. Accept hospitality. Respect genocide history. Coffee fortune-telling tradition.",
    dressCode: "Casual. Modest at churches. Cover shoulders/knees at religious sites.",
    safetyNotes: "Very safe. Yerevan walkable. Some borders closed (Turkey, Azerbaijan). Road conditions variable outside Yerevan.",
    taxResidencyDays: 183,
    utcOffset: "+4"
  },
  "uzbekistan": {
    currency: "UZS (Uzbek Som). Cash dominant. Cards at upscale hotels.",
    language: "Uzbek, Russian. Limited English.",
    emergency: "101 (fire), 102 (police), 103 (ambulance)",
    businessHours: "Mon-Fri 9AM-6PM. Markets open early.",
    tipping: "5-10% at restaurants appreciated.",
    culturalNotes: "Silk Road heritage (Samarkand, Bukhara, Khiva). Incredible tilework. Plov (pilaf) is national dish. Rapidly opening to tourism. Warm hospitality.",
    manners: "Remove shoes in homes/mosques. Accept bread with both hands. Don't place bread upside down. Tea customs important.",
    dressCode: "Modest. Cover shoulders at mosques. Light fabrics for summer heat.",
    safetyNotes: "Very safe. Summer heat extreme. Drink bottled water. Register at hotels (required by law).",
    taxResidencyDays: 183,
    utcOffset: "+5"
  },
  "mongolia": {
    currency: "MNT (Tugrik). Cash essential outside Ulaanbaatar.",
    language: "Mongolian. Limited English. Russian sometimes.",
    emergency: "105 (police), 103 (ambulance)",
    businessHours: "Mon-Fri 9AM-6PM. Nomadic areas—no concept of business hours.",
    tipping: "Not expected. Tips appreciated for guides.",
    culturalNotes: "Nomadic culture. Ger (yurt) stays. Genghis Khan heritage. Vast steppes. Eagle hunters. Naadam festival (July). Throat singing.",
    manners: "Accept gifts with right hand or both. Don't whistle indoors. Don't lean on center pole in ger. Accept food/drink offered.",
    dressCode: "Layers. Extreme temperature swings. Warm for ger camp nights. Sun protection for steppe.",
    safetyNotes: "Very safe. Ulaanbaatar pickpockets. Rural areas remote—prepare supplies. Winter extreme (-30°C). Limited medical facilities outside UB.",
    taxResidencyDays: 183,
    utcOffset: "+8"
  },
  "luxembourg": {
    currency: "EUR (€). Cards everywhere.",
    language: "Luxembourgish, French, German. English widely spoken.",
    emergency: "112",
    businessHours: "Mon-Fri 9AM-6PM. Saturday to 5PM. Sunday closed.",
    tipping: "Round up. Service included.",
    culturalNotes: "Wealthiest country per capita. EU institutions. Multilingual by nature. Casemates du Bock. Banking center. Moselle wine region.",
    manners: "Polite, reserved. Punctual. Greet in French or Luxembourgish.",
    dressCode: "Smart casual. Business formal for financial sector.",
    safetyNotes: "Extremely safe. Expensive but slightly less than Switzerland. Excellent public transport (free since 2020!).",
    taxResidencyDays: 183,
    utcOffset: "+1"
  },
  "monaco": {
    currency: "EUR (€). Cards everywhere.",
    language: "French. English in hotels/business.",
    emergency: "112 or 17 (police), 18 (fire)",
    businessHours: "Mon-Fri 9AM-6PM. Luxury retail open late.",
    tipping: "15% at restaurants. Tip casino croupiers.",
    culturalNotes: "Tiny principality. F1 Grand Prix. Casino Monte Carlo. Super yacht harbor. Tax haven. Richest population per capita.",
    manners: "Formal and elegant. Dress to impress. Casino dress code enforced.",
    dressCode: "Smart to very smart. Casino: jacket required. Beachwear only at beach.",
    safetyNotes: "Safest place in Europe. Extremely expensive. Everything walkable. Camera surveillance everywhere.",
    taxResidencyDays: 183,
    utcOffset: "+1"
  },
  "malta": {
    currency: "EUR (€). Cards widely accepted.",
    language: "Maltese, English (both official).",
    emergency: "112",
    businessHours: "Mon-Fri 9AM-5PM. Saturday morning. Sunday closed. Festa (village festival) season summer.",
    tipping: "10% at restaurants appreciated.",
    culturalNotes: "Knights of Malta history. Ancient temples (older than pyramids). Festa culture. Mediterranean cuisine. Diving paradise. Friendly locals.",
    manners: "Friendly and family-oriented. Religious traditions respected. Greet in English or Maltese.",
    dressCode: "Casual. Cover shoulders at churches. Beach casual at coast.",
    safetyNotes: "Very safe. Summer heat intense. Driving on left (UK influence). Maltese driving can be chaotic.",
    taxResidencyDays: 183,
    utcOffset: "+1"
  },
  "cyprus": {
    currency: "EUR (€) in Republic of Cyprus. TRY in Northern Cyprus.",
    language: "Greek (south), Turkish (north). English widely spoken.",
    emergency: "112 or 199 (police), 199 (fire), 199 (ambulance)",
    businessHours: "Mon-Fri 8AM-1PM, then some reopen 4-7PM. Wednesday afternoon off. Summer siesta.",
    tipping: "10% at restaurants. Not required but appreciated.",
    culturalNotes: "Divided island. Greek Cypriot south. Ancient history. Meze dining culture. Halloumi cheese origin. Beach + mountain in 30 min.",
    manners: "Warm Mediterranean hospitality. Accept coffee/food offers. Family-centric.",
    dressCode: "Casual. Cover up at monasteries. Beach casual.",
    safetyNotes: "Very safe. Summer heat extreme. Crossing to North: bring passport. Drive on left.",
    taxResidencyDays: 183,
    utcOffset: "+2"
  },
  "estonia": {
    currency: "EUR (€). Almost cashless. Ultra-digital society.",
    language: "Estonian. Good English. Russian minority.",
    emergency: "112",
    businessHours: "Mon-Fri 9AM-6PM. Malls open later. Sunday variable.",
    tipping: "Round up. 10% for excellent service. Not expected.",
    culturalNotes: "Most digital society on earth (e-residency, e-governance). Tallinn old town UNESCO. Song Festival tradition. Sauna culture. Startup hub.",
    manners: "Reserved initially. Direct communication. Punctual. Personal space respected. Sauna etiquette: no swimwear in public saunas.",
    dressCode: "Casual. Layers for Baltic weather. Warm winter gear.",
    safetyNotes: "Very safe. Digital nomad visa available. E-residency for business. Cold winters.",
    taxResidencyDays: 183,
    utcOffset: "+2"
  },
  "latvia": {
    currency: "EUR (€). Cards widely accepted.",
    language: "Latvian. Russian widely spoken. English among youth.",
    emergency: "112",
    businessHours: "Mon-Fri 9AM-6PM. Central Market open 7AM-6PM.",
    tipping: "10% at restaurants. Not obligatory.",
    culturalNotes: "Art Nouveau architecture in Riga. Song and Dance Festival. Rye bread tradition. Midsummer (Jāņi) celebration huge. Black Balsam liqueur.",
    manners: "Punctual. Initially reserved. Warm once you know people. Respect for nature.",
    dressCode: "Casual. Warm layers for winter.",
    safetyNotes: "Very safe. Riga old town walkable. Cold winters. Watch for icy sidewalks.",
    taxResidencyDays: 183,
    utcOffset: "+2"
  },
  "lithuania": {
    currency: "EUR (€). Cards widely accepted.",
    language: "Lithuanian. English among youth. Some Russian.",
    emergency: "112",
    businessHours: "Mon-Fri 8AM-5PM. Shopping centers open late.",
    tipping: "5-10% at restaurants. Not required.",
    culturalNotes: "Basketball is religion. Vilnius Old Town UNESCO. Curonian Spit. Hill of Crosses. Šakotis (tree cake). Strong Catholic traditions.",
    manners: "Punctual. Direct communication. Warm hospitality at home. Remove shoes indoors.",
    dressCode: "Casual. Warm for winter.",
    safetyNotes: "Very safe. Cold winters. Excellent value destination. Good public transport.",
    taxResidencyDays: 183,
    utcOffset: "+2"
  },
  "bulgaria": {
    currency: "BGN (Lev). Pegged to EUR. Cash still common. Joining Eurozone soon.",
    language: "Bulgarian (Cyrillic alphabet). Some English in Sofia.",
    emergency: "112",
    businessHours: "Mon-Fri 9AM-6PM. Shops close for lunch in small towns.",
    tipping: "10% at restaurants. Round up taxis.",
    culturalNotes: "Head nodding means NO, shaking means YES (opposite!). Rose oil capital. Yogurt culture. Ancient Thracian heritage. Black Sea coast.",
    manners: "Remember: nodding = no, shaking = yes. Warm hosts. Rakia (brandy) offered frequently. Remove shoes in homes.",
    dressCode: "Casual. Modest at monasteries.",
    safetyNotes: "Very safe. Budget-friendly. Mountain roads in winter can be challenging. Black Sea resorts busy Jul-Aug.",
    taxResidencyDays: 183,
    utcOffset: "+2"
  },
  "serbia": {
    currency: "RSD (Serbian Dinar). Cash preferred. Cards in Belgrade.",
    language: "Serbian (Cyrillic & Latin). English among youth.",
    emergency: "192 (police), 193 (fire), 194 (ambulance)",
    businessHours: "Mon-Fri 8AM-5PM. Kafanas (taverns) open late. Belgrade nightlife legendary.",
    tipping: "10% at restaurants. Round up.",
    culturalNotes: "Belgrade nightlife world-famous (splavovi—river clubs). Kafana culture. Ćevapi national dish. Rakija brandy. Orthodox traditions. EXIT Festival.",
    manners: "Warm and hospitable. Rakija offered always—accept first glass. Family gatherings important.",
    dressCode: "Casual but stylish in Belgrade. Smart for nightlife.",
    safetyNotes: "Safe. Belgrade very walkable. Don't discuss Kosovo politics. Nightlife goes until sunrise.",
    taxResidencyDays: 183,
    utcOffset: "+1"
  },
  "portugal": {
    currency: "EUR (€). Cards widely accepted. MB Way popular.",
    language: "Portuguese. Good English.",
    emergency: "112",
    businessHours: "Mon-Fri 9AM-6PM. Lunch 1-2:30PM.",
    tipping: "5-10%. Not expected.",
    culturalNotes: "Fado music. Pastel de nata. Coffee culture.",
    manners: "Friendly, warm. Don't compare to Spain.",
    dressCode: "Relaxed casual.",
    safetyNotes: "Very safe. Digital nomad visa available.",
    taxResidencyDays: 183,
    utcOffset: "0"
  }
};

// Get country info for system prompt
export function getCountryBriefing(country: string): string {
  const key = (country || '').toLowerCase();
  const info = COUNTRY_DATABASE[key];
  if (!info) return '';
  
  return `
**COUNTRY BRIEFING FOR ${country.toUpperCase()}:**
- 💱 Currency: ${info.currency}
- 🗣️ Language: ${info.language}
- 🚨 Emergency: ${info.emergency}
- 🕐 Business Hours: ${info.businessHours}
- 💵 Tipping: ${info.tipping}
- 🎭 Culture: ${info.culturalNotes}
- 🤝 Manners: ${info.manners}
- 👔 Dress Code: ${info.dressCode}
- ⚠️ Safety: ${info.safetyNotes}
- 📋 Tax Residency: ${info.taxResidencyDays} days
- 🕐 UTC Offset: ${info.utcOffset}
`;
}

// Get regional business context for current time verification
export function getRegionalContext(country: string): string {
  const key = (country || '').toLowerCase();
  const info = COUNTRY_DATABASE[key];
  if (!info) return "Check local business hours before visiting. Hours vary by country. Government offices typically close earlier than shops.";
  return `${info.businessHours} | Tipping: ${info.tipping}`;
}

// Get season info based on hemisphere
export function getSeasonInfo(month: number, latitude: number): string {
  const isNorthern = latitude >= 0;
  if (isNorthern) {
    if (month >= 3 && month <= 5) return "Spring (March-May). Weather transitioning, pack layers.";
    if (month >= 6 && month <= 8) return "Summer (June-August). Peak travel season, book ahead.";
    if (month >= 9 && month <= 11) return "Autumn (September-November). Shoulder season, fewer crowds.";
    return "Winter (December-February). Cold, check heating in accommodations.";
  } else {
    if (month >= 3 && month <= 5) return "Autumn (March-May). Cooling down, shoulder season.";
    if (month >= 6 && month <= 8) return "Winter (June-August). Cold season, check conditions.";
    if (month >= 9 && month <= 11) return "Spring (September-November). Warming up, pleasant travel.";
    return "Summer (December-February). Peak season, book ahead.";
  }
}
