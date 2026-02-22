export interface MatchProfile {
  name: string;
  age: number;
  gender: 'male' | 'female';
  avatar: string;
  profession: string;
  verified: boolean;
}

export interface MatchEntry {
  id: string;
  activity: string;
  activityEmoji: string;
  city: string;
  country: string;
  countryCode: string;
  when: string;
  profile: MatchProfile;
  matchScore: number;
  commonInterests: string[];
  message: string;
  voiceMessage: string;
}

// Avatars pool for reuse
const avatars = {
  f1: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&crop=face',
  f2: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=face',
  f3: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face',
  f4: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&crop=face',
  f5: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&h=80&fit=crop&crop=face',
  f6: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=80&h=80&fit=crop&crop=face',
  f7: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=80&h=80&fit=crop&crop=face',
  f8: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=80&h=80&fit=crop&crop=face',
  m1: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
  m2: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face',
  m3: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face',
  m4: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&h=80&fit=crop&crop=face',
  m5: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=80&h=80&fit=crop&crop=face',
  m6: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=80&h=80&fit=crop&crop=face',
  m7: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=80&h=80&fit=crop&crop=face',
  m8: 'https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=80&h=80&fit=crop&crop=face',
};

// Helper to build a match entry concisely
function m(
  id: string, emoji: string, activity: string, city: string, country: string, cc: string,
  when: string, name: string, age: number, gender: 'male'|'female', avatar: string,
  profession: string, score: number, interests: string[],
): MatchEntry {
  const genderEmoji = gender === 'female' ? '👩' : '👨';
  return {
    id, activity, activityEmoji: emoji, city, country, countryCode: cc, when,
    profile: { name, age, gender, avatar, profession, verified: true },
    matchScore: score, commonInterests: interests,
    message: `${emoji} ${activity} match! ${name} (${age}, ${profession}) in ${city} — ${when}. ${score}% match!`,
    voiceMessage: `${name}, a ${age}-year-old ${profession}, is looking for a ${activity.toLowerCase()} partner in ${city}, ${country}. ${score}% match!`,
  };
}

export const MATCH_POOL: MatchEntry[] = [
  // 1-10
  m('af-kabul','🏋️','CrossFit','Kabul','Afghanistan','AF','Saturday 7AM','Farida H.',28,'female',avatars.f1,'NGO Worker',85,['functional fitness']),
  m('al-tirana','🏃','Morning Run','Tirana','Albania','AL','Sunday 7AM','Arta K.',26,'female',avatars.f2,'Journalist',88,['5K runs','lakeside']),
  m('dz-algiers','⚽','Football','Algiers','Algeria','DZ','Friday 5PM','Mehdi B.',30,'male',avatars.m1,'Civil Engineer',87,['football','local league']),
  m('ad-andorra','⛷️','Skiing','Andorra la Vella','Andorra','AD','Saturday 9AM','Marc P.',34,'male',avatars.m2,'Ski Instructor',94,['off-piste','powder']),
  m('ao-luanda','🏄','Surfing','Luanda','Angola','AO','Sunday 6AM','João M.',29,'male',avatars.m3,'Marine Engineer',86,['beach breaks']),
  m('ag-stjohns','🏊','Open Water Swim','St. John\'s','Antigua and Barbuda','AG','Saturday 8AM','Keisha W.',27,'female',avatars.f3,'Dive Instructor',91,['sea swimming']),
  m('ar-buenos','💃','Tango','Buenos Aires','Argentina','AR','Friday 9PM','Valentina S.',31,'female',avatars.f4,'Dance Teacher',96,['milonga','tango nuevo']),
  m('am-yerevan','♟️','Chess Club','Yerevan','Armenia','AM','Saturday 2PM','Armen G.',35,'male',avatars.m4,'Software Architect',89,['rapid chess']),
  m('au-sydney','🏄','Surfing','Sydney','Australia','AU','Sunday 6AM','Liam C.',30,'male',avatars.m5,'Physiotherapist',91,['Bondi Beach','dawn sessions']),
  m('at-vienna','🎻','Classical Concert','Vienna','Austria','AT','Friday 7PM','Annika R.',33,'female',avatars.f5,'Musicologist',92,['Vienna Philharmonic']),

  // 11-20
  m('az-baku','🏎️','Karting','Baku','Azerbaijan','AZ','Saturday 4PM','Elnur A.',28,'male',avatars.m6,'F1 Engineer',88,['go-karting','motorsport']),
  m('bs-nassau','🤿','Scuba Diving','Nassau','Bahamas','BS','Wednesday 9AM','Tanya R.',29,'female',avatars.f6,'Marine Biologist',93,['reef diving']),
  m('bh-manama','🏓','Padel Tennis','Manama','Bahrain','BH','Thursday 7PM','Fatima A.',30,'female',avatars.f7,'Fintech Manager',90,['padel','doubles']),
  m('bd-dhaka','🏏','Cricket','Dhaka','Bangladesh','BD','Sunday 8AM','Rahim K.',27,'male',avatars.m7,'App Developer',87,['T20 cricket']),
  m('bb-bridge','🏄','Surfing','Bridgetown','Barbados','BB','Saturday 7AM','Dwayne S.',31,'male',avatars.m8,'DJ & Producer',89,['surf culture']),
  m('by-minsk','🎯','Archery','Minsk','Belarus','BY','Saturday 11AM','Alena V.',28,'female',avatars.f8,'Graphic Designer',86,['target archery']),
  m('be-brussels','🚴','Cycling','Brussels','Belgium','BE','Sunday 8AM','Thomas D.',32,'male',avatars.m1,'EU Policy Advisor',91,['road cycling']),
  m('bz-belize','🤿','Snorkeling','Belize City','Belize','BZ','Tuesday 10AM','Maria L.',26,'female',avatars.f1,'Ecologist',94,['barrier reef']),
  m('bj-porto','🥁','Drum Circle','Porto-Novo','Benin','BJ','Friday 6PM','Kofi A.',33,'male',avatars.m2,'Musician',88,['West African drums']),
  m('bt-thimphu','🥾','Mountain Trekking','Thimphu','Bhutan','BT','Saturday 6AM','Tshering D.',29,'female',avatars.f2,'Trek Guide',95,['Himalayan trails']),

  // 21-30
  m('bo-lapaz','🧗','Rock Climbing','La Paz','Bolivia','BO','Sunday 9AM','Carlos R.',28,'male',avatars.m3,'Geologist',90,['bouldering']),
  m('ba-sarajevo','☕','Coffee Culture Walk','Sarajevo','Bosnia and Herzegovina','BA','Saturday 10AM','Emina H.',30,'female',avatars.f3,'Barista Champion',87,['specialty coffee']),
  m('bw-gaborone','🦁','Safari Photography','Gaborone','Botswana','BW','Sunday 5AM','Kago M.',34,'male',avatars.m4,'Wildlife Guide',93,['big five']),
  m('br-rio','🏐','Beach Volleyball','Rio de Janeiro','Brazil','BR','Saturday 4PM','Fernanda L.',27,'female',avatars.f4,'Pro Volleyball Player',96,['Copacabana']),
  m('bn-bandar','🏸','Badminton','Bandar Seri Begawan','Brunei','BN','Thursday 6PM','Aziz H.',31,'male',avatars.m5,'Oil Engineer',85,['doubles']),
  m('bg-sofia','🎿','Skiing','Sofia','Bulgaria','BG','Saturday 8AM','Ivana P.',29,'female',avatars.f5,'Data Scientist',91,['Vitosha slopes']),
  m('bf-ouaga','🚴','Mountain Biking','Ouagadougou','Burkina Faso','BF','Sunday 7AM','Ibrahim T.',26,'male',avatars.m6,'Community Leader',84,['trail riding']),
  m('bi-bujum','🏃','Trail Running','Bujumbura','Burundi','BI','Saturday 6AM','Ange N.',28,'female',avatars.f6,'Nurse',86,['lake trails']),
  m('kh-phnom','🧘‍♀️','Yoga','Phnom Penh','Cambodia','KH','Daily 7AM','Sokha C.',25,'female',avatars.f7,'Yoga Teacher',93,['vinyasa flow']),
  m('cm-douala','⚽','Football','Douala','Cameroon','CM','Sunday 4PM','Jean-Pierre M.',30,'male',avatars.m7,'Sports Coach',88,['5-a-side']),

  // 31-40
  m('ca-toronto','🏒','Ice Hockey','Toronto','Canada','CA','Saturday 8PM','Ryan M.',33,'male',avatars.m8,'DevOps Engineer',92,['rec league']),
  m('cv-praia','🎸','Live Music Jam','Praia','Cape Verde','CV','Friday 8PM','Ana S.',27,'female',avatars.f8,'Singer',90,['morna music']),
  m('cf-bangui','🎨','Art Workshop','Bangui','Central African Republic','CF','Saturday 2PM','Marie T.',29,'female',avatars.f1,'Art Teacher',83,['painting']),
  m('td-ndjamena','🏃','Running Club','N\'Djamena','Chad','TD','Sunday 6AM','Hassan M.',32,'male',avatars.m1,'Logistics Manager',85,['distance running']),
  m('cl-santiago','🍷','Wine Tasting','Santiago','Chile','CL','Friday 7PM','Catalina V.',30,'female',avatars.f2,'Sommelier',94,['Chilean Carménère']),
  m('cn-shanghai','🏸','Badminton','Shanghai','China','CN','Saturday 9AM','Wei L.',29,'male',avatars.m2,'Tech Lead',89,['competitive play']),
  m('co-bogota','🧗','Bouldering','Bogotá','Colombia','CO','Sunday 10AM','Andrés G.',28,'male',avatars.m3,'Graphic Designer',91,['indoor climbing']),
  m('km-moroni','🤿','Diving','Moroni','Comoros','KM','Wednesday 8AM','Fatima Y.',26,'female',avatars.f3,'Marine Researcher',87,['coral reefs']),
  m('cg-brazza','🏃','Jogging Club','Brazzaville','Congo','CG','Saturday 6AM','Patrick N.',31,'male',avatars.m4,'Teacher',84,['riverside runs']),
  m('cr-sanjose','🏄','Surfing','San José','Costa Rica','CR','Sunday 6AM','Sofia M.',27,'female',avatars.f4,'Marine Biologist',93,['Pacific coast']),

  // 41-50
  m('hr-zagreb','🧗','Rock Climbing','Zagreb','Croatia','HR','Saturday 10AM','Ivana B.',30,'female',avatars.f5,'Architect',90,['Paklenica routes']),
  m('cu-havana','💃','Salsa Dancing','Havana','Cuba','CU','Friday 9PM','Carmen R.',28,'female',avatars.f6,'Dance Instructor',95,['casino rueda']),
  m('cy-nicosia','🎾','Tennis','Nicosia','Cyprus','CY','Saturday 5PM','Andreas K.',34,'male',avatars.m5,'Hotel Manager',88,['clay courts']),
  m('cz-prague','🍺','Craft Beer Tour','Prague','Czech Republic','CZ','Saturday 3PM','Jakub N.',31,'male',avatars.m6,'Brewmaster',92,['microbreweries']),
  m('dk-copenhagen','🚴','City Cycling','Copenhagen','Denmark','DK','Sunday 9AM','Freja L.',29,'female',avatars.f7,'Urban Planner',91,['bike culture']),
  m('dj-djibouti','🤿','Whale Shark Diving','Djibouti','Djibouti','DJ','Tuesday 7AM','Ali M.',33,'male',avatars.m7,'Marine Guide',94,['whale sharks']),
  m('dm-roseau','🥾','Rainforest Hike','Roseau','Dominica','DM','Saturday 7AM','Keisha J.',27,'female',avatars.f8,'Botanist',89,['Boiling Lake trail']),
  m('do-santo','🏖️','Beach Tennis','Santo Domingo','Dominican Republic','DO','Sunday 9AM','Miguel R.',30,'male',avatars.m8,'Resort Manager',87,['beach sports']),
  m('ec-quito','🧗','Mountaineering','Quito','Ecuador','EC','Saturday 5AM','Isabella C.',28,'female',avatars.f1,'Volcanologist',93,['Cotopaxi']),
  m('eg-cairo','🏛️','History Walk','Cairo','Egypt','EG','Friday 9AM','Ahmed S.',35,'male',avatars.m1,'Egyptologist',90,['pyramids']),

  // 51-60
  m('sv-sansal','🏄','Surfing','San Salvador','El Salvador','SV','Sunday 6AM','Diego L.',27,'male',avatars.m2,'Surf Instructor',92,['El Tunco']),
  m('gq-malabo','🎣','Deep Sea Fishing','Malabo','Equatorial Guinea','GQ','Saturday 6AM','Pedro N.',33,'male',avatars.m3,'Captain',86,['big game fishing']),
  m('er-asmara','☕','Coffee Ceremony','Asmara','Eritrea','ER','Saturday 3PM','Selam T.',29,'female',avatars.f2,'Barista',88,['traditional coffee']),
  m('ee-tallinn','🧖','Sauna Culture','Tallinn','Estonia','EE','Friday 6PM','Liis K.',30,'female',avatars.f3,'Startup Founder',91,['smoke sauna']),
  m('sz-mbabane','🥾','Hiking','Mbabane','Eswatini','SZ','Sunday 7AM','Sipho D.',28,'male',avatars.m4,'Park Ranger',87,['Sibebe Rock']),
  m('et-addis','🏃','Running','Addis Ababa','Ethiopia','ET','Saturday 6AM','Tigist B.',25,'female',avatars.f4,'Pro Runner',97,['altitude training']),
  m('fj-suva','🏄','Surfing','Suva','Fiji','FJ','Sunday 7AM','Ratu V.',31,'male',avatars.m5,'Tourism Director',89,['reef breaks']),
  m('fi-helsinki','🧖','Ice Swimming','Helsinki','Finland','FI','Saturday 8AM','Aino V.',32,'female',avatars.f5,'Wellness Coach',93,['avanto swimming']),
  m('fr-paris','🥂','Wine Tasting','Paris','France','FR','Friday 7PM','Camille D.',30,'female',avatars.f6,'Sommelier',92,['natural wines','Le Marais']),
  m('ga-libre','🎵','Live Music','Libreville','Gabon','GA','Friday 9PM','Jean-Marc O.',29,'male',avatars.m6,'Music Producer',86,['Afrobeat']),

  // 61-70
  m('gm-banjul','🏖️','Beach Yoga','Banjul','Gambia','GM','Saturday 7AM','Isatou J.',27,'female',avatars.f7,'Yoga Teacher',90,['sunrise yoga']),
  m('ge-tbilisi','🍷','Wine Tour','Tbilisi','Georgia','GE','Saturday 11AM','Nino G.',31,'female',avatars.f8,'Winemaker',94,['qvevri wine']),
  m('de-berlin','🎧','Techno Night','Berlin','Germany','DE','Saturday 11PM','Felix K.',29,'male',avatars.m7,'Sound Engineer',88,['Berghain area']),
  m('gh-accra','🏄','Surfing','Accra','Ghana','GH','Sunday 7AM','Kwame A.',28,'male',avatars.m8,'Web Developer',87,['Busua Beach']),
  m('gr-athens','⛵','Sailing','Athens','Greece','GR','Saturday 10AM','Eleni S.',34,'female',avatars.f1,'Marine Architect',93,['Saronic Gulf']),
  m('gd-stgeorge','🤿','Diving','St. George\'s','Grenada','GD','Wednesday 9AM','Derek W.',30,'male',avatars.m1,'Dive Master',91,['wreck diving']),
  m('gt-guatemala','🧗','Volcano Hiking','Guatemala City','Guatemala','GT','Sunday 5AM','Ana L.',28,'female',avatars.f2,'Adventure Guide',92,['Volcán Acatenango']),
  m('gn-conakry','🥁','Djembe Drumming','Conakry','Guinea','GN','Friday 5PM','Mamadou D.',33,'male',avatars.m2,'Master Drummer',89,['West African rhythm']),
  m('gw-bissau','🎣','Fishing','Bissau','Guinea-Bissau','GW','Saturday 6AM','Carlos S.',31,'male',avatars.m3,'Fisherman Guide',84,['river fishing']),
  m('gy-george','🐦','Birdwatching','Georgetown','Guyana','GY','Sunday 6AM','Priya R.',29,'female',avatars.f3,'Ornithologist',88,['harpy eagles']),

  // 71-80
  m('ht-portau','🎨','Painting Workshop','Port-au-Prince','Haiti','HT','Saturday 2PM','Marie C.',27,'female',avatars.f4,'Artist',86,['Haitian art']),
  m('hn-teguc','🏄','Surfing','Tegucigalpa','Honduras','HN','Sunday 7AM','Carlos M.',28,'male',avatars.m4,'Surf Coach',89,['Caribbean coast']),
  m('hu-budapest','♨️','Thermal Baths','Budapest','Hungary','HU','Saturday 10AM','Eszter N.',31,'female',avatars.f5,'Wellness Director',93,['Széchenyi baths']),
  m('is-reykjavik','🧖','Hot Springs','Reykjavik','Iceland','IS','Sunday 9AM','Björk S.',30,'female',avatars.f6,'Geothermal Engineer',95,['natural pools']),
  m('in-mumbai','🏏','Cricket','Mumbai','India','IN','Sunday 8AM','Arjun P.',28,'male',avatars.m5,'Tech Lead',90,['T20 matches']),
  m('id-bali','🏄‍♂️','Surfing','Canggu','Indonesia','ID','Tomorrow 6AM','Jake W.',27,'male',avatars.m6,'Content Creator',96,['dawn patrol']),
  m('ir-tehran','⛷️','Skiing','Tehran','Iran','IR','Friday 8AM','Dariush M.',32,'male',avatars.m7,'Civil Engineer',88,['Dizin resort']),
  m('iq-baghdad','♟️','Chess','Baghdad','Iraq','IQ','Saturday 3PM','Omar H.',34,'male',avatars.m8,'Professor',85,['classical chess']),
  m('ie-dublin','🏉','Rugby Watching','Dublin','Ireland','IE','Saturday 3PM','Siobhan O.',29,'female',avatars.f7,'Lawyer',91,['Six Nations']),
  m('il-telaviv','🏄','Surfing','Tel Aviv','Israel','IL','Friday 6AM','Yael K.',27,'female',avatars.f8,'Product Manager',92,['Mediterranean swells']),

  // 81-90
  m('it-milano','🏃‍♀️','Morning Run','Milano','Italy','IT','Saturday 7AM','Sofia R.',29,'female',avatars.f1,'UX Designer',94,['Parco Sempione']),
  m('jm-kingston','🎵','Reggae Jam','Kingston','Jamaica','JM','Friday 8PM','Marcus B.',30,'male',avatars.m1,'Music Producer',90,['live sessions']),
  m('jp-tokyo','🍜','Ramen Workshop','Tokyo','Japan','JP','Friday 12PM','Yuki T.',26,'female',avatars.f2,'Food Blogger',97,['Japanese cuisine']),
  m('jo-amman','🏛️','Archaeological Tour','Amman','Jordan','JO','Saturday 8AM','Layla F.',31,'female',avatars.f3,'Archaeologist',89,['Petra trails']),
  m('kz-almaty','⛷️','Skiing','Almaty','Kazakhstan','KZ','Saturday 9AM','Asel T.',28,'female',avatars.f4,'Winter Sports Coach',93,['Shymbulak']),
  m('ke-nairobi','🏃','Running Club','Nairobi','Kenya','KE','Sunday 6AM','Kipchoge W.',27,'male',avatars.m2,'Pro Runner',96,['marathon training']),
  m('ki-tarawa','🎣','Fishing','Tarawa','Kiribati','KI','Saturday 6AM','Teiti B.',29,'male',avatars.m3,'Fisherman',83,['lagoon fishing']),
  m('kw-kuwait','🏓','Padel','Kuwait City','Kuwait','KW','Thursday 7PM','Nour A.',30,'female',avatars.f5,'Investment Analyst',88,['padel doubles']),
  m('kg-bishkek','🐎','Horse Trekking','Bishkek','Kyrgyzstan','KG','Sunday 7AM','Aisuluu M.',28,'female',avatars.f6,'Nomadic Guide',94,['mountain treks']),
  m('la-vientiane','🧘','Meditation','Vientiane','Laos','LA','Daily 6AM','Kham P.',33,'male',avatars.m4,'Buddhist Teacher',90,['Vipassana']),

  // 91-100
  m('lv-riga','🎭','Theatre Night','Riga','Latvia','LV','Friday 7PM','Ilze B.',30,'female',avatars.f7,'Theatre Director',89,['contemporary plays']),
  m('lb-beirut','🍽️','Food Tour','Beirut','Lebanon','LB','Saturday 11AM','Nadia K.',29,'female',avatars.f8,'Chef',93,['Lebanese cuisine']),
  m('ls-maseru','🥾','Mountain Hike','Maseru','Lesotho','LS','Sunday 6AM','Thabo M.',31,'male',avatars.m5,'Guide',86,['Maluti Mountains']),
  m('lr-monrovia','🏄','Surfing','Monrovia','Liberia','LR','Saturday 7AM','James T.',28,'male',avatars.m6,'Aid Worker',85,['Robertsport']),
  m('ly-tripoli','🏛️','History Walk','Tripoli','Libya','LY','Friday 9AM','Ahmed G.',35,'male',avatars.m7,'Historian',84,['Roman ruins']),
  m('li-vaduz','⛷️','Skiing','Vaduz','Liechtenstein','LI','Saturday 9AM','Hans M.',33,'male',avatars.m8,'Banker',91,['Malbun slopes']),
  m('lt-vilnius','🎨','Street Art Tour','Vilnius','Lithuania','LT','Saturday 2PM','Goda R.',27,'female',avatars.f1,'Muralist',90,['Užupis district']),
  m('lu-luxembourg','🚴','Cycling','Luxembourg City','Luxembourg','LU','Sunday 8AM','Marc W.',34,'male',avatars.m1,'Fund Manager',88,['Mullerthal Trail']),
  m('mg-antanan','🐒','Wildlife Safari','Antananarivo','Madagascar','MG','Sunday 6AM','Riana A.',28,'female',avatars.f2,'Zoologist',92,['lemur watching']),
  m('mw-lilongwe','🏊','Lake Swimming','Lilongwe','Malawi','MW','Saturday 8AM','Chimwemwe B.',29,'male',avatars.m2,'Marine Guide',87,['Lake Malawi']),

  // 101-110
  m('my-kl','🏸','Badminton','Kuala Lumpur','Malaysia','MY','Saturday 9AM','Mei Ling T.',28,'female',avatars.f3,'Data Analyst',91,['competitive play']),
  m('mv-male','🤿','Diving','Malé','Maldives','MV','Wednesday 8AM','David L.',35,'male',avatars.m3,'Marine Biologist',91,['manta ray spots']),
  m('ml-bamako','🥁','Drum Circle','Bamako','Mali','ML','Friday 6PM','Oumar S.',30,'male',avatars.m4,'Griot Musician',89,['balafon']),
  m('mt-valletta','🤿','Diving','Valletta','Malta','MT','Sunday 9AM','Maria G.',29,'female',avatars.f4,'Historian',90,['Blue Hole']),
  m('mr-nouak','🐪','Camel Trekking','Nouakchott','Mauritania','MR','Saturday 6AM','Oumar D.',33,'male',avatars.m5,'Desert Guide',86,['Sahara crossing']),
  m('mu-port','🏌️','Golf','Port Louis','Mauritius','MU','Saturday 8AM','Rajiv P.',36,'male',avatars.m6,'CFO',90,['Île aux Cerfs']),
  m('mx-cdmx','💃','Salsa Night','Mexico City','Mexico','MX','Friday 9PM','Valentina R.',29,'female',avatars.f5,'Dance Instructor',95,['Roma Norte']),
  m('md-chisinau','🍷','Wine Cellar Tour','Chișinău','Moldova','MD','Saturday 11AM','Elena C.',30,'female',avatars.f6,'Oenologist',92,['Cricova cellars']),
  m('mc-monaco','🏎️','F1 Viewing','Monaco','Monaco','MC','Sunday 2PM','Oliver H.',38,'male',avatars.m7,'Hedge Fund Manager',87,['hospitality suite']),
  m('mn-ulaanbaatar','🐎','Horse Riding','Ulaanbaatar','Mongolia','MN','Sunday 7AM','Boldoo T.',28,'male',avatars.m8,'Nomadic Guide',94,['steppe riding']),

  // 111-120
  m('me-podgorica','🧗','Rock Climbing','Podgorica','Montenegro','ME','Saturday 9AM','Milica V.',29,'female',avatars.f7,'Climbing Coach',90,['Durmitor']),
  m('ma-marrakech','🧘','Yoga Retreat','Marrakech','Morocco','MA','Friday 7AM','Yasmine E.',31,'female',avatars.f8,'Wellness Coach',93,['Atlas Mountains']),
  m('mz-maputo','🏄','Surfing','Maputo','Mozambique','MZ','Sunday 6AM','Tiago F.',27,'male',avatars.m1,'Surf Instructor',88,['Tofo Beach']),
  m('mm-yangon','🧘','Meditation','Yangon','Myanmar','MM','Daily 5AM','Khin M.',30,'female',avatars.f1,'Meditation Teacher',91,['Shwedagon Pagoda']),
  m('na-windhoek','🦁','Safari','Windhoek','Namibia','NA','Sunday 5AM','Anna S.',32,'female',avatars.f2,'Safari Guide',93,['Etosha']),
  m('nr-yaren','🎣','Fishing','Yaren','Nauru','NR','Saturday 6AM','Derog A.',28,'male',avatars.m2,'Fisherman',82,['reef fishing']),
  m('np-kathmandu','🥾','Trekking','Kathmandu','Nepal','NP','Saturday 5AM','Pemba S.',30,'male',avatars.m3,'Sherpa Guide',97,['Annapurna Circuit']),
  m('nl-amsterdam','🚴','Canal Cycling','Amsterdam','Netherlands','NL','Sunday 10AM','Daan V.',31,'male',avatars.m4,'Creative Director',91,['bike culture']),
  m('nz-auckland','🏉','Rugby','Auckland','New Zealand','NZ','Saturday 3PM','Aroha T.',28,'female',avatars.f3,'Sports Physio',90,['All Blacks']),
  m('ni-managua','🏄','Surfing','Managua','Nicaragua','NI','Sunday 6AM','Roberto C.',27,'male',avatars.m5,'Surf Guide',89,['San Juan del Sur']),

  // 121-130
  m('ne-niamey','🏃','Running','Niamey','Niger','NE','Saturday 6AM','Amadou I.',29,'male',avatars.m6,'Community Leader',84,['morning runs']),
  m('ng-lagos','🎵','Afrobeats Night','Lagos','Nigeria','NG','Friday 9PM','Chioma O.',28,'female',avatars.f4,'Music Executive',92,['live Afrobeats']),
  m('kp-pyongyang','🏓','Table Tennis','Pyongyang','North Korea','KP','Saturday 10AM','Min-jun K.',30,'male',avatars.m7,'Coach',83,['ping pong']),
  m('mk-skopje','🥾','Hiking','Skopje','North Macedonia','MK','Sunday 7AM','Ana D.',29,'female',avatars.f5,'Outdoor Guide',88,['Matka Canyon']),
  m('no-oslo','⛷️','Cross-Country Skiing','Oslo','Norway','NO','Saturday 9AM','Ingrid H.',32,'female',avatars.f6,'Biathlete',95,['Holmenkollen']),
  m('om-muscat','🤿','Diving','Muscat','Oman','OM','Wednesday 8AM','Saif A.',34,'male',avatars.m8,'Marine Guide',90,['Daymaniyat Islands']),
  m('pk-lahore','🏏','Cricket','Lahore','Pakistan','PK','Sunday 8AM','Ali R.',28,'male',avatars.m1,'Cricket Coach',91,['Gaddafi Stadium']),
  m('pw-ngerulmud','🤿','Diving','Ngerulmud','Palau','PW','Tuesday 8AM','Kerai M.',29,'male',avatars.m2,'Dive Master',94,['Jellyfish Lake']),
  m('pa-panama','🏄','Surfing','Panama City','Panama','PA','Sunday 6AM','Sofia A.',27,'female',avatars.f7,'Travel Blogger',89,['Santa Catalina']),
  m('pg-portm','🐦','Birdwatching','Port Moresby','Papua New Guinea','PG','Saturday 6AM','James K.',31,'male',avatars.m3,'Ecologist',87,['birds of paradise']),

  // 131-140
  m('py-asuncion','⚽','Football','Asunción','Paraguay','PY','Sunday 4PM','Diego A.',29,'male',avatars.m4,'Sports Reporter',88,['local derby']),
  m('pe-lima','🍽️','Ceviche Workshop','Lima','Peru','PE','Saturday 12PM','Luciana M.',30,'female',avatars.f8,'Chef',94,['Peruvian cuisine']),
  m('ph-manila','🏄','Surfing','Manila','Philippines','PH','Sunday 5AM','Miguel S.',27,'male',avatars.m5,'Digital Nomad',90,['Siargao Island']),
  m('pl-warsaw','🎹','Jazz Club','Warsaw','Poland','PL','Friday 8PM','Agata K.',31,'female',avatars.f1,'Jazz Pianist',91,['live jazz']),
  m('pt-lisbon','🧘‍♀️','Sunset Yoga','Lisbon','Portugal','PT','Friday 6:30PM','Elena M.',33,'female',avatars.f2,'Digital Nomad Coach',92,['rooftop sessions']),
  m('qa-doha','🏎️','Karting','Doha','Qatar','QA','Saturday 5PM','Khalid A.',30,'male',avatars.m6,'Racing Enthusiast',89,['Lusail Circuit']),
  m('ro-bucharest','🎭','Theatre','Bucharest','Romania','RO','Friday 7PM','Ioana P.',29,'female',avatars.f3,'Actress',88,['indie theatre']),
  m('ru-moscow','♟️','Chess Club','Moscow','Russia','RU','Saturday 2PM','Dmitri V.',35,'male',avatars.m7,'Grandmaster',93,['rapid chess']),
  m('rw-kigali','🦍','Gorilla Trekking','Kigali','Rwanda','RW','Sunday 6AM','Grace M.',28,'female',avatars.f4,'Wildlife Guide',96,['Volcanoes NP']),
  m('kn-basseterre','⛵','Sailing','Basseterre','Saint Kitts and Nevis','KN','Saturday 10AM','James W.',33,'male',avatars.m8,'Yacht Captain',90,['Caribbean sailing']),

  // 141-150
  m('lc-castries','🤿','Reef Diving','Castries','Saint Lucia','LC','Wednesday 9AM','Shanelle J.',27,'female',avatars.f5,'Marine Biologist',91,['Piton reefs']),
  m('vc-kings','🏄','Surfing','Kingstown','Saint Vincent','VC','Sunday 7AM','Devon P.',29,'male',avatars.m1,'Surf Guide',87,['black sand']),
  m('ws-apia','🏉','Rugby','Apia','Samoa','WS','Saturday 3PM','Tui S.',30,'male',avatars.m2,'Rugby Coach',90,['Manu Samoa']),
  m('sm-sanmarino','🚴','Hill Cycling','San Marino','San Marino','SM','Sunday 8AM','Marco B.',32,'male',avatars.m3,'Architect',88,['Monte Titano']),
  m('st-saotome','🤿','Diving','São Tomé','São Tomé and Príncipe','ST','Tuesday 8AM','Rosa M.',28,'female',avatars.f6,'Marine Researcher',86,['volcanic reefs']),
  m('sa-riyadh','🏎️','Desert Rally','Riyadh','Saudi Arabia','SA','Friday 4PM','Faisal A.',34,'male',avatars.m4,'Rally Driver',93,['Dakar route']),
  m('sn-dakar','🏄','Surfing','Dakar','Senegal','SN','Sunday 7AM','Amadou F.',27,'male',avatars.m5,'Surf Instructor',89,['N\'Gor Island']),
  m('rs-belgrade','🎵','Jazz Night','Belgrade','Serbia','RS','Friday 9PM','Milena S.',30,'female',avatars.f7,'Saxophonist',91,['Savamala district']),
  m('sc-victoria','🤿','Diving','Victoria','Seychelles','SC','Wednesday 8AM','Pierre L.',32,'male',avatars.m6,'Dive Master',94,['Aldabra Atoll']),
  m('sl-freetown','🏖️','Beach Run','Freetown','Sierra Leone','SL','Saturday 6AM','Aminata K.',26,'female',avatars.f8,'Athlete',86,['Lumley Beach']),

  // 151-160
  m('sg-singapore','🎾','Tennis','Singapore','Singapore','SG','Saturday 6PM','Priya K.',31,'female',avatars.f1,'Fintech PM',88,['Marina Bay']),
  m('sk-bratislava','🍺','Beer Tasting','Bratislava','Slovakia','SK','Saturday 4PM','Marek H.',30,'male',avatars.m7,'Brewmaster',87,['Old Town pubs']),
  m('si-ljubljana','🧗','Climbing','Ljubljana','Slovenia','SI','Sunday 9AM','Maja K.',28,'female',avatars.f2,'Climbing Coach',91,['Julian Alps']),
  m('sb-honiara','🎣','Fishing','Honiara','Solomon Islands','SB','Saturday 6AM','Peter K.',31,'male',avatars.m8,'Fisherman',83,['reef fishing']),
  m('so-mogadishu','⚽','Football','Mogadishu','Somalia','SO','Friday 4PM','Abdi H.',27,'male',avatars.m1,'Youth Coach',84,['community league']),
  m('za-capetown','🥾','Table Mountain','Cape Town','South Africa','ZA','Sunday 7AM','Amara N.',28,'female',avatars.f3,'Wildlife Photographer',93,['sunrise hikes']),
  m('kr-seoul','🎮','E-Sports','Seoul','South Korea','KR','Saturday 7PM','Jimin P.',25,'male',avatars.m2,'Pro Gamer',92,['PC bang culture']),
  m('ss-juba','🏃','Running','Juba','South Sudan','SS','Saturday 6AM','Grace A.',28,'female',avatars.f4,'NGO Worker',83,['community runs']),
  m('es-barcelona','⚽','Football Match','Barcelona','Spain','ES','Saturday 9PM','Carlos D.',36,'male',avatars.m3,'Architect',89,['Camp Nou']),
  m('lk-colombo','🏏','Cricket','Colombo','Sri Lanka','LK','Sunday 8AM','Dinesh F.',29,'male',avatars.m4,'Cricket Coach',90,['SSC Ground']),

  // 161-170
  m('sd-khartoum','♟️','Chess','Khartoum','Sudan','SD','Saturday 3PM','Ahmed O.',32,'male',avatars.m5,'Engineer',84,['rapid chess']),
  m('sr-paramaribo','🐦','Birdwatching','Paramaribo','Suriname','SR','Sunday 6AM','Nina V.',28,'female',avatars.f5,'Ornithologist',87,['rainforest birds']),
  m('se-stockholm','🧖','Sauna & Swim','Stockholm','Sweden','SE','Saturday 9AM','Astrid L.',30,'female',avatars.f6,'Design Lead',92,['ice swimming']),
  m('ch-zurich','⛷️','Skiing','Zurich','Switzerland','CH','Saturday 9AM','Niklas B.',32,'male',avatars.m6,'Blockchain Dev',95,['Zermatt']),
  m('sy-damascus','🏛️','History Walk','Damascus','Syria','SY','Friday 9AM','Rami K.',34,'male',avatars.m7,'Historian',84,['Old City']),
  m('tw-taipei','🧘','Tai Chi','Taipei','Taiwan','TW','Daily 6AM','Mei-Ling C.',33,'female',avatars.f7,'Wellness Coach',90,['Da\'an Park']),
  m('tj-dushanbe','🥾','Mountain Trek','Dushanbe','Tajikistan','TJ','Saturday 6AM','Rustam S.',29,'male',avatars.m8,'Trek Guide',92,['Fann Mountains']),
  m('tz-dar','🏄','Surfing','Dar es Salaam','Tanzania','TZ','Sunday 6AM','Amani K.',27,'male',avatars.m1,'Marine Guide',88,['Coco Beach']),
  m('th-bangkok','🥊','Muay Thai','Bangkok','Thailand','TH','Tuesday 6PM','Nara P.',27,'female',avatars.f8,'Fitness Coach',93,['beginner-friendly']),
  m('tl-dili','🤿','Diving','Dili','Timor-Leste','TL','Wednesday 8AM','Mario S.',30,'male',avatars.m2,'Dive Instructor',87,['coral triangle']),

  // 171-180
  m('tg-lome','🏖️','Beach Volleyball','Lomé','Togo','TG','Saturday 4PM','Kodjo A.',28,'male',avatars.m3,'Sports Coach',86,['beach sports']),
  m('to-nukualofa','🏉','Rugby','Nuku\'alofa','Tonga','TO','Saturday 2PM','Sione T.',31,'male',avatars.m4,'Rugby Player',89,['Ikale Tahi']),
  m('tt-port','🎵','Steelpan Jam','Port of Spain','Trinidad and Tobago','TT','Friday 7PM','Asha M.',27,'female',avatars.f1,'Pannist',91,['carnival prep']),
  m('tn-tunis','🏛️','Medina Walk','Tunis','Tunisia','TN','Saturday 10AM','Leila B.',30,'female',avatars.f2,'Art Curator',89,['Sidi Bou Said']),
  m('tr-istanbul','🎭','Cultural Walk','Istanbul','Turkey','TR','Saturday 10AM','Elif D.',31,'female',avatars.f3,'Journalist',92,['Bosphorus cruise']),
  m('tm-ashgabat','🐎','Horse Riding','Ashgabat','Turkmenistan','TM','Sunday 7AM','Dovlet A.',29,'male',avatars.m5,'Equestrian',88,['Akhal-Teke']),
  m('tv-funafuti','🎣','Lagoon Fishing','Funafuti','Tuvalu','TV','Saturday 6AM','Tala S.',28,'male',avatars.m6,'Fisherman',82,['lagoon fishing']),
  m('ug-kampala','🏃','Running Club','Kampala','Uganda','UG','Sunday 6AM','Grace N.',27,'female',avatars.f4,'Runner',90,['Kololo Hill']),
  m('ua-kyiv','🎹','Piano Concert','Kyiv','Ukraine','UA','Friday 7PM','Oksana M.',30,'female',avatars.f5,'Concert Pianist',91,['National Philharmonic']),
  m('ae-dubai','🏓','Padel Tennis','Dubai','UAE','AE','Thursday 7PM','Layla A.',30,'female',avatars.f6,'E-commerce Director',90,['padel doubles']),

  // 181-190
  m('gb-london','🏃','Park Run','London','United Kingdom','GB','Saturday 9AM','Charlotte W.',32,'female',avatars.f7,'Investment Banker',90,['Hyde Park']),
  m('us-nyc','🏀','Basketball','New York','United States','US','Saturday 10AM','DeAndre J.',28,'male',avatars.m7,'Marketing Director',88,['Central Park']),
  m('uy-montevideo','⚽','Football','Montevideo','Uruguay','UY','Sunday 4PM','Matías R.',30,'male',avatars.m8,'Sports Journalist',89,['Estadio Centenario']),
  m('uz-tashkent','♟️','Chess','Tashkent','Uzbekistan','UZ','Saturday 2PM','Nodira K.',28,'female',avatars.f8,'Chess Master',93,['rapid chess']),
  m('vu-port','🤿','Diving','Port Vila','Vanuatu','VU','Wednesday 8AM','Tom B.',31,'male',avatars.m1,'Dive Master',89,['SS President Coolidge']),
  m('va-vatican','🏛️','Art History Walk','Vatican City','Vatican','VA','Friday 9AM','Marco R.',40,'male',avatars.m2,'Art Historian',87,['Sistine Chapel']),
  m('ve-caracas','🏄','Surfing','Caracas','Venezuela','VE','Sunday 6AM','Gabriela M.',27,'female',avatars.f1,'Surf Coach',88,['Los Roques']),
  m('vn-hanoi','🍜','Street Food Tour','Hanoi','Vietnam','VN','Saturday 6PM','Linh N.',26,'female',avatars.f2,'Food Blogger',94,['Old Quarter']),
  m('ye-sanaa','☕','Coffee Ceremony','Sana\'a','Yemen','YE','Saturday 3PM','Fatima A.',29,'female',avatars.f3,'Barista',85,['Yemeni coffee']),
  m('zm-lusaka','🦁','Safari','Lusaka','Zambia','ZM','Sunday 5AM','Mwila C.',30,'male',avatars.m3,'Safari Guide',92,['South Luangwa']),

  // 191-200
  m('zw-harare','🥾','Hiking','Harare','Zimbabwe','ZW','Saturday 7AM','Tafadzwa M.',28,'male',avatars.m4,'Park Ranger',88,['Chimanimani']),
  m('cy-limassol','🏊','Open Water Swim','Limassol','Cyprus','CY2','Saturday 8AM','Stavros P.',33,'male',avatars.m5,'Swimmer',89,['Mediterranean']),
  m('es-madrid','🎨','Prado Museum Tour','Madrid','Spain','ES2','Saturday 10AM','Isabel G.',31,'female',avatars.f4,'Art Historian',91,['Velázquez']),
  m('it-roma','🍷','Aperitivo Evening','Rome','Italy','IT2','Friday 7:30PM','Luca M.',33,'male',avatars.m6,'Film Producer',89,['Trastevere']),
  m('us-miami','🏄','Surfing','Miami','United States','US2','Sunday 7AM','Alex T.',28,'male',avatars.m7,'Photographer',90,['South Beach']),
  m('au-melbourne','☕','Coffee Culture Walk','Melbourne','Australia','AU2','Saturday 10AM','Olivia B.',29,'female',avatars.f5,'Barista Champion',92,['laneways']),
  m('de-munich','🍺','Brewery Tour','Munich','Germany','DE2','Saturday 3PM','Felix K.',31,'male',avatars.m8,'Software Engineer',86,['craft beer']),
  m('fr-lyon','🍽️','Gastronomic Tour','Lyon','France','FR2','Saturday 12PM','Pierre D.',35,'male',avatars.m1,'Michelin Chef',94,['Les Halles']),
  m('jp-kyoto','🍵','Tea Ceremony','Kyoto','Japan','JP2','Friday 3PM','Sakura H.',28,'female',avatars.f6,'Tea Master',95,['matcha ceremony']),
  m('br-saopaulo','🎵','Samba Night','São Paulo','Brazil','BR2','Friday 10PM','Juliana C.',27,'female',avatars.f7,'Dancer',93,['Vila Madalena']),
];

// ─── Persona-specific sports matches ───────────────────────────────────
// Meghan — F1 & fitness matches (London-based)
export const MEGHAN_SPORTS_MATCHES: MatchEntry[] = [
  {
    id: 'meghan-f1-silverstone',
    activity: 'F1 Grand Prix — Silverstone',
    activityEmoji: '🏎️',
    city: 'London',
    country: 'United Kingdom',
    countryCode: 'GB',
    when: 'June 14, 2026 · Trackside',
    profile: { name: 'Victoria S.', age: 38, gender: 'female', avatar: avatars.f5, profession: 'Motorsport Journalist', verified: true },
    matchScore: 97,
    commonInterests: ['F1 trackside', 'paddock access', 'motorsport networking'],
    message: '🏎️ F1 trackside match! Victoria (38, Motorsport Journalist) is also going to Silverstone GP — 97% match!',
    voiceMessage: 'Great news, Meghan! Victoria, a 38-year-old Motorsport Journalist, is also going to the Silverstone Grand Prix trackside. You have a 97% match on interests — F1, paddock access, motorsport networking. Would you like to connect?',
  },
  {
    id: 'meghan-yoga-london',
    activity: 'Sunrise Yoga — Hyde Park',
    activityEmoji: '🧘‍♀️',
    city: 'London',
    country: 'United Kingdom',
    countryCode: 'GB',
    when: 'Saturday 6:30AM',
    profile: { name: 'Priya N.', age: 35, gender: 'female', avatar: avatars.f3, profession: 'Wellness Founder', verified: true },
    matchScore: 94,
    commonInterests: ['morning yoga', 'wellness', 'healthy lifestyle'],
    message: '🧘‍♀️ Yoga match! Priya (35, Wellness Founder) — sunrise yoga at Hyde Park. 94% match!',
    voiceMessage: 'Meghan, Priya is a 35-year-old Wellness Founder who does sunrise yoga at Hyde Park every Saturday at 6:30 AM. You share a 94% match on wellness and healthy lifestyle interests.',
  },
  {
    id: 'meghan-run-singapore',
    activity: 'Morning Run — Marina Bay',
    activityEmoji: '🏃‍♀️',
    city: 'Singapore',
    country: 'Singapore',
    countryCode: 'SG',
    when: 'Mar 3 · 6AM',
    profile: { name: 'Rachel K.', age: 40, gender: 'female', avatar: avatars.f1, profession: 'CMO, Tech Startup', verified: true },
    matchScore: 95,
    commonInterests: ['running', 'marketing leadership', 'business travel'],
    message: '🏃‍♀️ Running match! Rachel (40, CMO) in Singapore while you\'re there — 95% match!',
    voiceMessage: 'Meghan, since you\'re heading to Singapore next week, Rachel, a 40-year-old CMO, would love a running partner at Marina Bay. You\'re a 95% match on running and marketing leadership.',
  },
];

// John — Triathlon & sports matches (Singapore-based)
export const JOHN_SPORTS_MATCHES: MatchEntry[] = [
  {
    id: 'john-ironman-bintan',
    activity: 'Ironman 70.3 Training Partner',
    activityEmoji: '🏊‍♂️',
    city: 'Singapore',
    country: 'Singapore',
    countryCode: 'SG',
    when: 'Training daily · Race Apr 4',
    profile: { name: 'Marcus T.', age: 44, gender: 'male', avatar: avatars.m5, profession: 'CFO, FinTech', verified: true },
    matchScore: 98,
    commonInterests: ['Ironman 70.3', 'triathlon training', 'executive athlete'],
    message: '🏊‍♂️ Ironman match! Marcus (44, CFO) training for Bintan 70.3 too — 98% match!',
    voiceMessage: 'John, meet Marcus! He\'s a 44-year-old CFO also training for the Ironman 70.3 in Bintan on April 4th. You\'re a 98% match — both executive athletes and triathletes. He swims at OCBC Aquatic Centre every morning.',
  },
  {
    id: 'john-ski-verbier',
    activity: 'Ski Partner — Verbier',
    activityEmoji: '⛷️',
    city: 'Verbier',
    country: 'Switzerland',
    countryCode: 'CH',
    when: 'Apr 18-25 · Family trip',
    profile: { name: 'Stefan W.', age: 42, gender: 'male', avatar: avatars.m2, profession: 'Tech VP, Family Man', verified: true },
    matchScore: 96,
    commonInterests: ['alpine skiing', 'family ski trips', 'tech leadership'],
    message: '⛷️ Ski match! Stefan (42, Tech VP) also skiing Verbier with family — 96% match!',
    voiceMessage: 'John, Stefan is a 42-year-old Tech VP who\'s also taking his family skiing in Verbier the same week as you. He has kids around the same ages. 96% match on skiing, family trips, and tech leadership.',
  },
  {
    id: 'john-cycle-eastcoast',
    activity: 'Sunday Cycling — 60km East Coast',
    activityEmoji: '🚴‍♂️',
    city: 'Singapore',
    country: 'Singapore',
    countryCode: 'SG',
    when: 'Sundays 7AM',
    profile: { name: 'Raj P.', age: 41, gender: 'male', avatar: avatars.m4, profession: 'CTO, Enterprise SaaS', verified: true },
    matchScore: 95,
    commonInterests: ['long-distance cycling', 'triathlon', 'tech exec'],
    message: '🚴‍♂️ Cycling match! Raj (41, CTO) for Sunday 60km rides — 95% match!',
    voiceMessage: 'John, Raj is a 41-year-old CTO who does 60-kilometer Sunday rides on the East Coast route. He\'s also into triathlon. You\'re a 95% match. He starts at 7 AM.',
  },
];
