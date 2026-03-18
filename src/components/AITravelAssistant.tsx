import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Send, X, Bot, User, Minimize2, Maximize2, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import ConciergeSettings, { getConciergePrefs, ConciergePreferences } from './ConciergeSettings';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { useVoiceConversation } from '@/hooks/useVoiceConversation';
import BookingCards, { parseBookingBlocks } from '@/components/chat/BookingCards';
import { dummyThreats } from '@/data/threatData';
import { useDemoPersona } from '@/contexts/DemoPersonaContext';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface AITravelAssistantProps {
  currentLocation?: { country: string; city: string };
  citizenship?: string;
  userProfile?: any;
}

const AITravelAssistant: React.FC<AITravelAssistantProps> = ({ 
  currentLocation,
  citizenship,
  userProfile
}) => {
  const { t, currentLanguage } = useLanguage();
  const { activePersona } = useDemoPersona();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const exchangeCountRef = useRef(0);
  const getWelcomeMessage = (): string => {
    const city = currentLocation?.city || '';
    if (activePersona) {
      const p = activePersona;
      const nextTrip = p.travel.upcomingTrips[0];
      const personaGreetings: Record<string, string> = {
        en: `Hi ${p.profile.firstName} 👋 Welcome back! I see you're in **${p.profile.city}** right now.\n\nI've got your calendar loaded and I know your upcoming trips. ${nextTrip ? `Your next trip to **${nextTrip.destination}** (${nextTrip.dates}) is coming up — ${nextTrip.purpose}.` : ''}\n\nNeed me to help with anything? Flights, hotels${p.accommodation.mustHave.includes('gym') ? ' with a gym & sauna' : ''}, ${p.services.usesFrequently[0]?.toLowerCase()}, or something else? Just ask! ✈️`,
        es: `¡Hola ${p.profile.firstName} 👋! ¡Bienvenido de nuevo! Veo que estás en **${p.profile.city}** ahora mismo.\n\nTengo tu calendario cargado y conozco tus próximos viajes. ${nextTrip ? `Tu próximo viaje a **${nextTrip.destination}** (${nextTrip.dates}) se acerca — ${nextTrip.purpose}.` : ''}\n\n¿Necesitas ayuda con algo? Vuelos, hoteles${p.accommodation.mustHave.includes('gym') ? ' con gimnasio y sauna' : ''}, ${p.services.usesFrequently[0]?.toLowerCase()}, ¿o algo más? ¡Solo pregunta! ✈️`,
        pt: `Olá ${p.profile.firstName} 👋 Bem-vindo de volta! Vejo que você está em **${p.profile.city}** agora.\n\nTenho seu calendário carregado e conheço suas próximas viagens. ${nextTrip ? `Sua próxima viagem para **${nextTrip.destination}** (${nextTrip.dates}) está chegando — ${nextTrip.purpose}.` : ''}\n\nPrecisa de ajuda com algo? Voos, hotéis${p.accommodation.mustHave.includes('gym') ? ' com academia e sauna' : ''}, ${p.services.usesFrequently[0]?.toLowerCase()}, ou algo mais? É só perguntar! ✈️`,
        fr: `Salut ${p.profile.firstName} 👋 Content de te revoir ! Je vois que tu es à **${p.profile.city}** en ce moment.\n\nJ'ai chargé ton calendrier et je connais tes prochains voyages. ${nextTrip ? `Ton prochain voyage à **${nextTrip.destination}** (${nextTrip.dates}) approche — ${nextTrip.purpose}.` : ''}\n\nBesoin d'aide ? Vols, hôtels${p.accommodation.mustHave.includes('gym') ? ' avec salle de sport et sauna' : ''}, ${p.services.usesFrequently[0]?.toLowerCase()}, ou autre chose ? Demande ! ✈️`,
        de: `Hi ${p.profile.firstName} 👋 Willkommen zurück! Ich sehe, du bist gerade in **${p.profile.city}**.\n\nIch habe deinen Kalender geladen und kenne deine nächsten Reisen. ${nextTrip ? `Deine nächste Reise nach **${nextTrip.destination}** (${nextTrip.dates}) steht bevor — ${nextTrip.purpose}.` : ''}\n\nBrauchst du Hilfe? Flüge, Hotels${p.accommodation.mustHave.includes('gym') ? ' mit Fitnessstudio & Sauna' : ''}, ${p.services.usesFrequently[0]?.toLowerCase()}, oder etwas anderes? Frag einfach! ✈️`,
        zh: `你好 ${p.profile.firstName} 👋 欢迎回来！我看到你现在在**${p.profile.city}**。\n\n我已加载你的日历并了解你即将到来的旅行。${nextTrip ? `你的下一次旅行到**${nextTrip.destination}**（${nextTrip.dates}）即将到来——${nextTrip.purpose}。` : ''}\n\n需要帮忙吗？航班、酒店${p.accommodation.mustHave.includes('gym') ? '（带健身房和桑拿）' : ''}、${p.services.usesFrequently[0]?.toLowerCase()}，或其他？尽管问！✈️`,
        ar: `مرحباً ${p.profile.firstName} 👋 أهلاً بعودتك! أرى أنك في **${p.profile.city}** الآن.\n\nلقد حمّلت تقويمك وأعرف رحلاتك القادمة. ${nextTrip ? `رحلتك القادمة إلى **${nextTrip.destination}** (${nextTrip.dates}) قريبة — ${nextTrip.purpose}.` : ''}\n\nهل تحتاج مساعدة؟ رحلات طيران، فنادق${p.accommodation.mustHave.includes('gym') ? ' مع صالة رياضية وساونا' : ''}، ${p.services.usesFrequently[0]?.toLowerCase()}، أو أي شيء آخر؟ فقط اسأل! ✈️`,
        ja: `こんにちは ${p.profile.firstName} 👋 おかえりなさい！今 **${p.profile.city}** にいるんですね。\n\nカレンダーを読み込んで、今後の旅行を把握しています。${nextTrip ? `次の旅行先 **${nextTrip.destination}**（${nextTrip.dates}）が近づいています — ${nextTrip.purpose}。` : ''}\n\n何かお手伝いしましょうか？フライト、ホテル${p.accommodation.mustHave.includes('gym') ? '（ジム＆サウナ付き）' : ''}、${p.services.usesFrequently[0]?.toLowerCase()}、その他？何でも聞いてください！✈️`,
        it: `Ciao ${p.profile.firstName} 👋 Bentornato! Vedo che sei a **${p.profile.city}** in questo momento.\n\nHo caricato il tuo calendario e conosco i tuoi prossimi viaggi. ${nextTrip ? `Il tuo prossimo viaggio a **${nextTrip.destination}** (${nextTrip.dates}) si avvicina — ${nextTrip.purpose}.` : ''}\n\nHai bisogno di aiuto? Voli, hotel${p.accommodation.mustHave.includes('gym') ? ' con palestra e sauna' : ''}, ${p.services.usesFrequently[0]?.toLowerCase()}, o altro? Chiedi pure! ✈️`,
        ko: `안녕하세요 ${p.profile.firstName} 👋 다시 오셨군요! 지금 **${p.profile.city}**에 계시네요.\n\n캘린더를 로드했고 다가오는 여행을 알고 있습니다. ${nextTrip ? `**${nextTrip.destination}**(${nextTrip.dates})으로의 다음 여행이 다가오고 있습니다 — ${nextTrip.purpose}.` : ''}\n\n도움이 필요하신가요? 항공편, 호텔${p.accommodation.mustHave.includes('gym') ? '(헬스장 & 사우나 포함)' : ''}, ${p.services.usesFrequently[0]?.toLowerCase()}, 또는 다른 것? 물어보세요! ✈️`,
        hi: `नमस्ते ${p.profile.firstName} 👋 वापसी पर स्वागत है! मैं देख रहा हूँ कि आप अभी **${p.profile.city}** में हैं।\n\nमैंने आपका कैलेंडर लोड कर लिया है और आपकी आगामी यात्राओं के बारे में जानता हूँ। ${nextTrip ? `**${nextTrip.destination}** (${nextTrip.dates}) की आपकी अगली यात्रा जल्द आ रही है — ${nextTrip.purpose}।` : ''}\n\nकिसी चीज़ में मदद चाहिए? उड़ानें, होटल${p.accommodation.mustHave.includes('gym') ? ' जिम और सौना के साथ' : ''}, ${p.services.usesFrequently[0]?.toLowerCase()}, या कुछ और? बस पूछिए! ✈️`,
        ru: `Привет ${p.profile.firstName} 👋 С возвращением! Вижу, ты сейчас в **${p.profile.city}**.\n\nЯ загрузил твой календарь и знаю о предстоящих поездках. ${nextTrip ? `Твоя следующая поездка в **${nextTrip.destination}** (${nextTrip.dates}) уже скоро — ${nextTrip.purpose}.` : ''}\n\nНужна помощь? Авиабилеты, отели${p.accommodation.mustHave.includes('gym') ? ' с тренажёрным залом и сауной' : ''}, ${p.services.usesFrequently[0]?.toLowerCase()}, или что-то ещё? Просто спроси! ✈️`,
        tr: `Merhaba ${p.profile.firstName} 👋 Tekrar hoş geldin! Şu anda **${p.profile.city}**'da olduğunu görüyorum.\n\nTakvimini yükledim ve yaklaşan seyahatlerini biliyorum. ${nextTrip ? `**${nextTrip.destination}** (${nextTrip.dates}) seyahatin yaklaşıyor — ${nextTrip.purpose}.` : ''}\n\nBir konuda yardım ister misin? Uçuşlar, oteller${p.accommodation.mustHave.includes('gym') ? ' spor salonu ve sauna ile' : ''}, ${p.services.usesFrequently[0]?.toLowerCase()}, ya da başka bir şey? Sadece sor! ✈️`,
      };
      return personaGreetings[currentLanguage] || personaGreetings.en;
    }

    const greetings: Record<string, string> = {
      en: `Hi there 👋 I'm your personal concierge.${city ? ` I see you're in **${city}** right now.` : ''}\n\nThe more we chat — and the more you fill out your profile and share your calendar — the better I get at looking out for you. From flights and hotels to insurance gaps, luggage tips, and things you didn't even know you needed.\n\nThink of me as that well-traveled friend who's always one step ahead. Let's get started — **where are you headed next?** ✈️`,
      es: `¡Hola 👋! Soy tu concierge personal.${city ? ` Veo que estás en **${city}** ahora mismo.` : ''}\n\nCuanto más hablemos — y cuanto más completes tu perfil y compartas tu calendario — mejor podré cuidar de ti. Desde vuelos y hoteles hasta seguros, consejos de equipaje y cosas que ni sabías que necesitabas.\n\nPiensa en mí como ese amigo viajero que siempre va un paso adelante. Empecemos — **¿a dónde vas después?** ✈️`,
      pt: `Olá 👋 Sou seu concierge pessoal.${city ? ` Vejo que você está em **${city}** agora.` : ''}\n\nQuanto mais conversarmos — e quanto mais você preencher seu perfil e compartilhar seu calendário — melhor eu fico em cuidar de você. De voos e hotéis a lacunas de seguro, dicas de bagagem e coisas que você nem sabia que precisava.\n\nPense em mim como aquele amigo viajado que está sempre um passo à frente. Vamos começar — **para onde você vai depois?** ✈️`,
      fr: `Salut 👋 Je suis votre concierge personnel.${city ? ` Je vois que vous êtes à **${city}** en ce moment.` : ''}\n\nPlus on discute — et plus vous remplissez votre profil et partagez votre calendrier — mieux je peux veiller sur vous. Des vols et hôtels aux assurances, conseils bagages et choses que vous ne saviez même pas nécessaires.\n\nConsidérez-moi comme cet ami globe-trotter qui a toujours une longueur d'avance. C'est parti — **quelle est votre prochaine destination ?** ✈️`,
      de: `Hallo 👋 Ich bin dein persönlicher Concierge.${city ? ` Ich sehe, du bist gerade in **${city}**.` : ''}\n\nJe mehr wir chatten — und je mehr du dein Profil ausfüllst und deinen Kalender teilst — desto besser kann ich auf dich aufpassen. Von Flügen und Hotels bis zu Versicherungslücken, Gepäcktipps und Dingen, von denen du nicht mal wusstest, dass du sie brauchst.\n\nStell dir mich als den weitgereisten Freund vor, der immer einen Schritt voraus ist. Los geht's — **wohin geht's als Nächstes?** ✈️`,
      zh: `你好 👋 我是你的私人礼宾。${city ? `我看到你现在在**${city}**。` : ''}\n\n我们聊得越多——你越完善你的个人资料并分享你的日历——我就越能照顾好你。从航班和酒店到保险缺口、行李建议，以及你甚至不知道自己需要的东西。\n\n把我当作那个总是领先一步的旅行达人朋友。让我们开始吧——**你下一站去哪里？** ✈️`,
      ar: `مرحباً 👋 أنا مساعدك الشخصي.${city ? ` أرى أنك في **${city}** الآن.` : ''}\n\nكلما تحدثنا أكثر — وكلما أكملت ملفك الشخصي وشاركت تقويمك — أصبحت أفضل في الاعتناء بك. من الرحلات والفنادق إلى فجوات التأمين ونصائح الأمتعة وأشياء لم تكن تعلم أنك بحاجة إليها.\n\nاعتبرني ذلك الصديق المسافر الذي يسبقك بخطوة دائماً. لنبدأ — **إلى أين وجهتك القادمة؟** ✈️`,
      ja: `こんにちは 👋 あなた専属のコンシェルジュです。${city ? `今 **${city}** にいらっしゃるんですね。` : ''}\n\nチャットすればするほど——プロフィールを充実させてカレンダーを共有すればするほど——私はもっと上手にあなたをサポートできます。フライトやホテルから保険の抜け穴、荷物のコツ、必要だと気づいていなかったことまで。\n\n私のことは、いつも一歩先を行く旅慣れた友人だと思ってください。さあ始めましょう——**次はどこへ行きますか？** ✈️`,
      it: `Ciao 👋 Sono il tuo concierge personale.${city ? ` Vedo che sei a **${city}** in questo momento.` : ''}\n\nPiù chattiamo — e più compili il tuo profilo e condividi il tuo calendario — meglio posso prendermi cura di te. Dai voli e hotel alle lacune assicurative, consigli sui bagagli e cose che non sapevi nemmeno di aver bisogno.\n\nPensami come quell'amico viaggiatore che è sempre un passo avanti. Iniziamo — **dove vai dopo?** ✈️`,
      ko: `안녕하세요 👋 저는 당신의 개인 컨시어지입니다.${city ? ` 지금 **${city}**에 계시는군요.` : ''}\n\n대화를 많이 나눌수록 — 프로필을 채우고 캘린더를 공유할수록 — 더 잘 챙겨드릴 수 있어요. 항공편과 호텔부터 보험 공백, 수하물 팁, 그리고 필요한 줄도 몰랐던 것들까지.\n\n항상 한 발 앞서는 여행 고수 친구라고 생각해주세요. 시작해볼까요 — **다음 목적지는 어디인가요?** ✈️`,
      hi: `नमस्ते 👋 मैं आपका निजी कॉन्सियर्ज हूँ।${city ? ` मैं देख रहा हूँ कि आप अभी **${city}** में हैं।` : ''}\n\nजितना हम बात करेंगे — और जितना आप अपनी प्रोफ़ाइल भरेंगे और कैलेंडर साझा करेंगे — उतना ही बेहतर मैं आपका ख्याल रख पाऊँगा। फ्लाइट और होटल से लेकर बीमा की कमी, सामान की टिप्स और ऐसी चीज़ें जिनकी ज़रूरत आपको पता भी नहीं थी।\n\nमुझे उस अनुभवी यात्री दोस्त की तरह सोचिए जो हमेशा एक कदम आगे रहता है। चलिए शुरू करते हैं — **आगे कहाँ जाना है?** ✈️`,
      ru: `Привет 👋 Я ваш персональный консьерж.${city ? ` Вижу, вы сейчас в **${city}**.` : ''}\n\nЧем больше мы общаемся — и чем больше вы заполняете профиль и делитесь календарём — тем лучше я смогу о вас заботиться. От авиабилетов и отелей до пробелов в страховке, советов по багажу и вещей, о которых вы даже не знали, что они вам нужны.\n\nСчитайте меня тем самым другом-путешественником, который всегда на шаг впереди. Начнём — **куда вы направляетесь дальше?** ✈️`,
      tr: `Merhaba 👋 Ben kişisel concierge'ınızım.${city ? ` Şu anda **${city}**'da olduğunuzu görüyorum.` : ''}\n\nNe kadar çok sohbet edersek — profilinizi doldurdukça ve takviminizi paylaştıkça — sizinle o kadar iyi ilgilenebilirim. Uçuşlar ve otellerden sigorta boşluklarına, bagaj ipuçlarına ve ihtiyacınız olduğunu bile bilmediğiniz şeylere kadar.\n\nBeni her zaman bir adım önde olan gezgin bir arkadaş olarak düşünün. Haydi başlayalım — **bir sonraki durağınız neresi?** ✈️`,
    };
    return greetings[currentLanguage] || greetings.en;
  };

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: getWelcomeMessage(),
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const {
    isListening, isSpeaking, voiceEnabled,
    startListening, stopListening, speak, stopSpeaking,
    toggleVoice, sttSupported, ttsSupported, setVoiceGender
  } = useVoiceConversation();
  const [conciergePrefs, setConciergePrefs] = useState<ConciergePreferences>(getConciergePrefs);

  // Sync voice gender preference
  useEffect(() => {
    setVoiceGender(conciergePrefs.voiceGender);
  }, [conciergePrefs.voiceGender, setVoiceGender]);

  // Reset chat when persona or language changes, auto-enable voice for demo personas
  useEffect(() => {
    setMessages([{
      id: '1',
      content: getWelcomeMessage(),
      isUser: false,
      timestamp: new Date()
    }]);
    // Auto-enable voice for demo personas so speak-back works out of the box
    if (activePersona && !voiceEnabled && ttsSupported) {
      toggleVoice();
    }
  }, [activePersona?.id, currentLanguage]);

  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    // Only auto-scroll to bottom when there are user messages (not just the welcome)
    if (messages.length > 1) {
      scrollToBottom();
    } else {
      // For welcome message, scroll to top so user sees the greeting
      const viewport = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]');
      if (viewport) viewport.scrollTop = 0;
    }
  }, [messages]);

  const triggerFollowUp = async (lastAIResponse: string, lastUserMessage: string) => {
    const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/travel-assistant`;
    try {
      setIsTyping(true);
      const followUpPrompt = `The user just asked: "${lastUserMessage.slice(0, 200)}" and you answered. Now send ONE short, natural follow-up (max 2 sentences). Either: (a) ask if they need something related (like insurance, eSIM, VPN, transport, etc. from your knowledge base), or (b) share a quick related tip they might not have thought of. Be casual — like a friend still thinking about their question. Don't repeat what you already said. Don't say "by the way" every time — vary your opener.`;

      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: [
            { role: 'user', content: lastUserMessage },
            { role: 'assistant', content: lastAIResponse },
            { role: 'user', content: followUpPrompt }
          ],
          userContext: {
            currentCountry: activePersona ? activePersona.profile.country : currentLocation?.country,
            currentCity: activePersona ? activePersona.profile.city : currentLocation?.city,
            citizenship: activePersona ? activePersona.profile.nationality : citizenship,
            language: currentLanguage,
            demoPersonaContext: localStorage.getItem('demoAiContext') || undefined,
            threatIntelligence: dummyThreats
              .filter(t => t.isActive && (t.severity === 'critical' || t.severity === 'high' || t.severity === 'medium'))
              .map(t => `[${t.severity.toUpperCase()}] ${t.title} — ${t.location.city}, ${t.location.country}: ${t.description}`)
              .join('\n') || 'No active threats.',
          }
        }),
      });

      if (!resp.ok || !resp.body) { setIsTyping(false); return; }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let followUpContent = "";
      const followUpId = (Date.now() + 10).toString();

      setMessages(prev => [...prev, { id: followUpId, content: "", isUser: false, timestamp: new Date() }]);

      let streamDone = false;
      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });
        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") { streamDone = true; break; }
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              followUpContent += content;
              setMessages(prev => prev.map(m => m.id === followUpId ? { ...m, content: followUpContent } : m));
            }
          } catch { textBuffer = line + "\n" + textBuffer; break; }
        }
      }

      if (followUpContent && voiceEnabled) speak(followUpContent);
      setIsTyping(false);
    } catch {
      setIsTyping(false);
    }
  };

  const streamChat = async (userMessage: string) => {
    const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/travel-assistant`;
    
    const activeThreats = dummyThreats
      .filter(t => t.isActive && (t.severity === 'critical' || t.severity === 'high' || t.severity === 'medium'))
      .map(t => `[${t.severity.toUpperCase()}] ${t.title} — ${t.location.city}, ${t.location.country}: ${t.description} (Distance: ${t.distanceFromUser}km)`)
      .join('\n');

    const demoAiContext = localStorage.getItem('demoAiContext') || '';
    const awardCardsContext = localStorage.getItem('awardCardsAIContext') || '';
    const jetSearchContext = localStorage.getItem('jetSearchAIContext') || '';
    
    // Build city services context from cached AI data
    const userCity = activePersona ? activePersona.profile.city : currentLocation?.city;
    let cityServicesContext = '';
    if (userCity) {
      try {
        const cacheKey = 'supernomad_city_services_' + userCity.toLowerCase().replace(/\s/g, '_');
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          const parsed = JSON.parse(cached);
          const data = parsed.data;
          if (data?.categories) {
            cityServicesContext = `Verified providers in ${data.city}, ${data.country} (researched ${data.lastResearched}):\n` +
              data.categories.map((cat: any) => 
                `${cat.name}: ${cat.providers.map((p: any) => `${p.name} (★${p.rating}, ${p.website}, ${p.phone})`).join('; ')}`
              ).join('\n');
          }
        }
      } catch {}
    }
    
    const userContext = {
      currentCountry: activePersona ? activePersona.profile.country : currentLocation?.country,
      currentCity: userCity,
      citizenship: activePersona ? activePersona.profile.nationality : citizenship,
      language: currentLanguage,
      threatIntelligence: activeThreats || 'No active threats.',
      demoPersonaContext: demoAiContext || undefined,
      awardCardsContext: awardCardsContext || undefined,
      jetSearchContext: jetSearchContext || undefined,
      cityServicesContext: cityServicesContext || undefined,
      conciergePreferences: {
        userName: conciergePrefs.userName || undefined,
        personalityMode: conciergePrefs.personalityMode,
        aiName: conciergePrefs.aiName || 'Concierge',
      },
      userProfile: userProfile ? {
        travelStyle: userProfile.travel?.preferences,
        dietaryPreferences: userProfile.personal?.dietary,
        accommodationPreferences: userProfile.personal?.accommodation,
        professionalInfo: userProfile.lifestyle?.professional,
        familyInfo: userProfile.lifestyle?.family,
        hobbies: userProfile.personal?.hobbies,
        mobility: userProfile.travel?.mobility
      } : null
    };

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: messages
            .filter(m => m.id !== '1')
            .map(m => ({
              role: m.isUser ? 'user' : 'assistant',
              content: m.content
            }))
            .concat([{ role: 'user', content: userMessage }]),
          userContext
        }),
      });

      if (!resp.ok) {
        if (resp.status === 429) {
          toast({
            title: "Rate limit exceeded",
            description: "Please try again in a moment.",
            variant: "destructive"
          });
          return;
        }
        if (resp.status === 402) {
          toast({
            title: "Payment required",
            description: "Please add funds to continue using AI features.",
            variant: "destructive"
          });
          return;
        }
        throw new Error("Failed to start stream");
      }

      if (!resp.body) throw new Error("No response body");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let streamDone = false;
      let assistantContent = "";

      // Add initial assistant message
      const assistantId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, {
        id: assistantId,
        content: "",
        isUser: false,
        timestamp: new Date()
      }]);

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") {
            streamDone = true;
            break;
          }

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantContent += content;
              setMessages(prev => prev.map(m => 
                m.id === assistantId 
                  ? { ...m, content: assistantContent }
                  : m
              ));
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      // Proactive follow-up: max every 3rd exchange, with 50% randomness
      exchangeCountRef.current += 1;
      const shouldFollowUp = exchangeCountRef.current % 3 === 0 && Math.random() > 0.5 && assistantContent;

      // Auto-speak the final response; chain follow-up after speech ends
      if (assistantContent && voiceEnabled) {
        speak(assistantContent, () => {
          if (shouldFollowUp) {
            setTimeout(() => triggerFollowUp(assistantContent, userMessage), 1500);
          }
        });
      } else if (shouldFollowUp) {
        const followUpDelay = 3000 + Math.random() * 2000;
        setTimeout(() => triggerFollowUp(assistantContent, userMessage), followUpDelay);
      }

      setIsTyping(false);
    } catch (error) {
      console.error("Chat error:", error);
      toast({
        title: "Error",
        description: "Failed to get response. Please try again.",
        variant: "destructive"
      });
      setIsTyping(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    await streamChat(inputMessage);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-[8.5rem] right-4 sm:bottom-6 sm:right-6 z-40">
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 sm:h-16 sm:w-16 rounded-full gradient-premium shadow-large hover:shadow-glow transition-all duration-300 group"
          size="lg"
        >
          <div className="relative">
            <MessageCircle className="h-7 w-7 text-white group-hover:scale-110 transition-transform" />
            <div className="absolute -top-1 -right-1 h-3 w-3 bg-success rounded-full border-2 border-background animate-pulse" />
          </div>
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 right-0 sm:bottom-6 sm:right-6 z-50 w-full sm:w-auto max-w-full">
      <Card className={`w-full sm:w-96 max-w-full glass-morphism shadow-large transition-all duration-300 rounded-none sm:rounded-lg ${
        isMinimized ? 'h-16' : 'h-[100dvh] sm:h-[500px]'
      }`}>
        <CardHeader className="flex flex-row items-center justify-between p-3 sm:p-4 pb-2 gradient-mesh">
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg gradient-premium flex items-center justify-center flex-shrink-0">
              <Bot className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </div>
            <CardTitle className="text-xs sm:text-sm font-semibold truncate">{conciergePrefs.aiName || 'Concierge'}</CardTitle>
            <div className="h-2 w-2 bg-success rounded-full animate-pulse shadow-glow flex-shrink-0" />
          </div>
          <div className="flex gap-0.5">
            <ConciergeSettings onPrefsChange={setConciergePrefs} />
            {ttsSupported && (
              <Button
                variant="ghost"
                size="sm"
                onClick={voiceEnabled ? stopSpeaking : undefined}
                onClickCapture={toggleVoice}
                className={`h-8 w-8 p-0 ${voiceEnabled ? 'text-primary' : ''}`}
                title={voiceEnabled ? 'Disable voice' : 'Enable voice'}
              >
                {voiceEnabled ? <Volume2 className={`h-4 w-4 ${isSpeaking ? 'animate-pulse' : ''}`} /> : <VolumeX className="h-4 w-4" />}
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
              className="h-8 w-8 p-0"
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-0 flex flex-col h-[calc(100%-4rem)]">
            <ScrollArea ref={scrollAreaRef} className="flex-1 px-4">
              <div className="space-y-4 pb-4">
                {messages.map((message) => {
                  const { text, bookings } = !message.isUser 
                    ? parseBookingBlocks(message.content) 
                    : { text: message.content, bookings: [] };
                  
                  // Split text by booking placeholders
                  const parts = text.split(/\{\{BOOKING_CARD_(\d+)\}\}/);
                  
                  return (
                    <div
                      key={message.id}
                      className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                          message.isUser
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          {!message.isUser && <Bot className="h-4 w-4 mt-0.5 flex-shrink-0" />}
                          <div className="flex-1 min-w-0">
                            {parts.map((part, i) => {
                              if (i % 2 === 1) {
                                const idx = parseInt(part);
                                return bookings[idx] ? <BookingCards key={`b-${i}`} items={bookings[idx]} /> : null;
                              }
                              return part ? <span key={`t-${i}`} className="whitespace-pre-wrap">{part}</span> : null;
                            })}
                          </div>
                          {message.isUser && <User className="h-4 w-4 mt-0.5 flex-shrink-0" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-lg px-3 py-2 text-sm">
                        <div className="flex items-center gap-2">
                        <Bot className="h-4 w-4" />
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            <div className="border-t p-3 sm:p-4">
            <div className="flex gap-2">
                {sttSupported && (
                  <Button
                    onClick={() => {
                      if (isListening) {
                        stopListening();
                      } else {
                    startListening((text) => {
                          // Speech recognition finished – send the result
                          if (text.trim()) {
                            setInputMessage('');
                            const userMsg: Message = {
                              id: Date.now().toString(),
                              content: text,
                              isUser: true,
                              timestamp: new Date()
                            };
                            setMessages(prev => [...prev, userMsg]);
                            setIsTyping(true);
                            streamChat(text);
                          }
                        });
                      }
                    }}
                    variant={isListening ? 'default' : 'outline'}
                    size="sm"
                    className={`px-3 ${isListening ? 'animate-pulse bg-destructive hover:bg-destructive/90' : ''}`}
                    disabled={isTyping}
                    title={isListening ? 'Stop listening' : 'Voice input'}
                  >
                    {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </Button>
                )}
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder={isListening ? t('ai.listening') || 'Listening...' : t('ai.placeholder')}
                  className="flex-1"
                  disabled={isTyping}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                  size="sm"
                  className="px-3"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                {t('ai.concierge_label')} • {voiceEnabled ? t('ai.voice_on') : t('ai.always_thinking')}
              </p>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default AITravelAssistant;