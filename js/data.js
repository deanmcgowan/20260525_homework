// Comprehensive data structure for Stormaktstiden learning content

const KINGS = [
    {
        id: 'gustaf-ii-adolf',
        name: 'Gustaf II Adolf',
        nickname: 'Lejonet från Norden',
        years: '1611-1632',
        reign: '1611-1632',
        image: '👑',
        summary: 'Blev kung när han bara var 17 år och förde Sverige in i trettioåriga kriget på protestanternas sida.',
        facts: [
            'Känd som "Lejonet från Norden"',
            'Förvandlade Sverige till en stormakt',
            'Vann flera stora slag i trettioåriga kriget',
            'Dog i slaget vid Lützen 1632',
            'Reformerade den svenska armén'
        ],
        achievements: [
            'Förde Sverige in i trettioåriga kriget',
            'Vann stora segrar vid Breitenfeld',
            'Moderniserade den svenska armén',
            'Expanderade svenskt territorium'
        ],
        death: 'Dog i slaget vid Lützen 1632',
        color: '#2563EB'
    },
    {
        id: 'kristina',
        name: 'Kristina',
        nickname: 'Drottning Kristina',
        years: '1632-1654',
        reign: '1632-1654 (myndig 1644)',
        image: '👸',
        summary: 'Blev drottning som 6-åring när hennes far Gustaf II Adolf dog. Abdikerade 1654 och konverterade till katolicismen.',
        facts: [
            'Blev drottning när hon bara var 6 år gammal',
            'Hennes kusin Karl X Gustav blev kung när hon abdikerade',
            'Lämnade Sverige och konverterade till katolicismen',
            'Intresserad av konst, vetenskap och filosofi',
            'Gifte sig aldrig'
        ],
        achievements: [
            'Främjade konst och vetenskap i Sverige',
            'Avslutade trettioåriga kriget (Westfaliska freden 1648)',
            'Sverige fick viktiga områden i Tyskland'
        ],
        abdication: 'Abdikerade 1654 och hennes kusin Karl X Gustav blev kung',
        color: '#EC4899'
    },
    {
        id: 'karl-x-gustav',
        name: 'Karl X Gustav',
        nickname: 'Krigarkungen',
        years: '1654-1660',
        reign: '1654-1660',
        image: '⚔️',
        summary: 'Kristinas kusin som blev kung när hon abdikerade. Känd för sina danska krig och att Sverige fick Skåne, Blekinge och Halland.',
        facts: [
            'Kristinas kusin, blev kung när hon abdikerade',
            'Förde krig mot Danmark',
            'Sveriges armé gick över Stora Bält när det var frusen',
            'Dog i lunginflammation 1660'
        ],
        achievements: [
            'Freden i Roskilde 1658',
            'Sverige fick Skåne, Blekinge, Halland och Bohuslän',
            'Expanderade svenskt territorium markant'
        ],
        death: 'Dog i lunginflammation 1660',
        color: '#F59E0B'
    },
    {
        id: 'karl-xi',
        name: 'Karl XI',
        nickname: 'Den envåldige härskaren',
        years: '1660-1697',
        reign: '1660-1697',
        image: '🛡️',
        summary: 'Var 4 år när han blev kung. Stärkte kungamakten och införde envälde. Han ville att kungen skulle lära sig läsa.',
        facts: [
            'Blev kung när han var bara 4 år gammal',
            'Var förmyndare hade makten först',
            'Införde envälde (absolutism)',
            'Ville att alla svenskar skulle lära sig läsa',
            'Stärkte den svenska armén',
            'Minskade adelns makt genom indelningsverket'
        ],
        achievements: [
            'Införde envälde och stärkte kungamakten',
            'Reducerade adelns makt',
            'Förbättrade Sveriges ekonomi',
            'Reformerade utbildningssystemet'
        ],
        color: '#8B5CF6'
    },
    {
        id: 'karl-xii',
        name: 'Karl XII',
        nickname: 'Hjältekungen',
        years: '1697-1718',
        reign: '1697-1718',
        image: '⚡',
        summary: 'Blev kung vid 15 års ålder. Känd som krigarkunng i det stora nordiska kriget. Dog vid Fredriksten 1718 vilket innebar slutet för stormaktstiden.',
        facts: [
            'Blev kung när han var 15 år',
            'Förde krig i nästan hela sin tid som kung',
            'Mycket skicklig militär strateg',
            'Bodde många år utomlands',
            'Dog vid Fredrikstens fästning i Norge 1718'
        ],
        achievements: [
            'Vann flera tidiga segrar i stora nordiska kriget',
            'Besegrade Danmark, Polen och Ryssland initialt',
            'Känd för sin personliga tapperhet'
        ],
        wars: [
            'Det stora nordiska kriget',
            'Krig mot Danmark, Polen och Ryssland',
            'Förlorade slaget vid Poltava 1709'
        ],
        death: 'Dog den 30 november vid Fredrikstens fästning i Norge, stormaktstiden tar slut',
        color: '#EF4444'
    }
];

const TIMELINE_EVENTS = [
    { year: 1611, event: 'Karl IX dör och Gustaf II Adolf blir kung', category: 'succession' },
    { year: 1618, event: 'Det trettioåriga kriget börjar. Krig mellan katoliker och protestanter', category: 'war' },
    { year: 1628, event: 'Skeppet Vasa sjunker i Stockholm', category: 'event' },
    { year: 1630, event: 'Sverige går med i trettioåriga kriget på protestanternas sida', category: 'war' },
    { year: 1631, event: 'Sverige vinner en stor seger vid Breitenfeld', category: 'victory' },
    { year: 1632, event: 'Gustaf II Adolf dör 6 november i slaget vid Lützen, Kristina (6 år gammal) blir drottning under en förmyndarregering ledd av Axel Oxenstierna', category: 'succession' },
    { year: 1644, event: 'Kristina blir myndig och blir drottning', category: 'succession' },
    { year: 1648, event: 'Det trettioåriga kriget slutade och blev fred i Europa', category: 'peace' },
    { year: 1654, event: 'Drottning Kristina abdikerade. Hennes kusin Karl X Gustav blev kung.', category: 'succession' },
    { year: 1658, event: 'Freden i Roskilde. Sverige får Skåne, Blekinge, Halland och Bohuslän.', category: 'peace' },
    { year: 1660, event: 'Karl X Gustav dör, hans son Karl XI blir kung', category: 'succession' },
    { year: 1686, event: 'infördes en lag om att alla svenskar skulle lära sig läsa', category: 'reform' },
    { year: 1697, event: 'Karl XI dör, hans son Karl XII blir kung, stöttet Tre Kronor brinner ner', category: 'succession' },
    { year: 1700, event: 'Danmark, Polen och Ryssland attackerar Sverige', category: 'war' },
    { year: 1709, event: 'Svenskarna besegrade i slaget vid Poltava', category: 'defeat' },
    { year: 1718, event: 'Karl XII dör den 30 november vid Fredrikstens fästning i Norge, stormaktstiden tar slut', category: 'end' }
];

const STUDY_QUESTIONS = [
    {
        id: 1,
        question: 'När var Gustaf II Adolf kung?',
        answer: '1611-1632',
        type: 'factual',
        kingId: 'gustaf-ii-adolf',
        difficulty: 'easy'
    },
    {
        id: 2,
        question: 'Vem hjälpte Gustaf II Adolf att styra landet?',
        answer: 'Axel Oxenstierna',
        type: 'factual',
        kingId: 'gustaf-ii-adolf',
        difficulty: 'medium'
    },
    {
        id: 3,
        question: 'Vad kallades Gustaf II Adolf för?',
        answer: 'Lejonet från Norden',
        type: 'factual',
        kingId: 'gustaf-ii-adolf',
        difficulty: 'easy'
    },
    {
        id: 4,
        question: 'I vilket slag dog Gustaf II Adolf?',
        answer: 'Slaget vid Lützen',
        type: 'factual',
        kingId: 'gustaf-ii-adolf',
        difficulty: 'medium'
    },
    {
        id: 5,
        question: 'Vad hände år 1648?',
        answer: 'Det trettioåriga kriget slutade och det blev fred i Europa',
        type: 'factual',
        kingId: 'kristina',
        difficulty: 'medium'
    },
    {
        id: 6,
        question: 'Varför gifte sig inte drottning Kristina?',
        answer: 'Hon ville inte gifta sig, hon var mer intresserad av konst, vetenskap och filosofi',
        type: 'analytical',
        kingId: 'kristina',
        difficulty: 'hard'
    },
    {
        id: 7,
        question: 'Vad gjorde Kristina år 1654?',
        answer: 'Hon abdikerade (lämnade tronen)',
        type: 'factual',
        kingId: 'kristina',
        difficulty: 'easy'
    },
    {
        id: 8,
        question: 'Vilka områden fick Sverige från Danmark 1658?',
        answer: 'Skåne, Blekinge, Halland och Bohuslän',
        type: 'factual',
        kingId: 'karl-x-gustav',
        difficulty: 'medium'
    },
    {
        id: 9,
        question: 'Hur dog Karl X Gustav?',
        answer: 'Lunginflammation',
        type: 'factual',
        kingId: 'karl-x-gustav',
        difficulty: 'easy'
    },
    {
        id: 10,
        question: 'Vad kallades lagen där adeln fick lämna tillbaka jord?',
        answer: 'Reduktionen/Indelningsverket',
        type: 'factual',
        kingId: 'karl-xi',
        difficulty: 'hard'
    },
    {
        id: 11,
        question: 'Vad innebar indelningsverket?',
        answer: 'Ett system där bönder gav mat och husrum till soldater i utbyte mot skattelättnader',
        type: 'analytical',
        kingId: 'karl-xi',
        difficulty: 'hard'
    },
    {
        id: 12,
        question: 'Vad var husförhör?',
        answer: 'Prästen kontrollerade att folk kunde läsa och förstå kristendomen',
        type: 'factual',
        kingId: 'karl-xi',
        difficulty: 'medium'
    },
    {
        id: 13,
        question: 'När började det stora nordiska kriget?',
        answer: '1700',
        type: 'factual',
        kingId: 'karl-xii',
        difficulty: 'medium'
    },
    {
        id: 14,
        question: 'Vad hände vid Poltava 1709?',
        answer: 'Sverige förlorade slaget mot Ryssland',
        type: 'factual',
        kingId: 'karl-xii',
        difficulty: 'medium'
    },
    {
        id: 15,
        question: 'Hur dog Karl XII?',
        answer: 'Han sköts vid Fredrikstens fästning i Norge 1718',
        type: 'factual',
        kingId: 'karl-xii',
        difficulty: 'easy'
    },
    {
        id: 16,
        question: 'Varför behövde Gustaf II Adolf bygga upp en stark armé?',
        answer: 'För att försvara Sverige och protestantismen i trettioåriga kriget',
        type: 'analytical',
        kingId: 'gustaf-ii-adolf',
        difficulty: 'hard'
    },
    {
        id: 17,
        question: 'Hur påverkade trettioåriga kriget människor av krigen?',
        answer: 'Många dog, städer förstördes, hungersnöd och fattigdom spred sig',
        type: 'analytical',
        kingId: 'gustaf-ii-adolf',
        difficulty: 'hard'
    },
    {
        id: 18,
        question: 'Varför blev böndernas situation sämre under Kristinas tid?',
        answer: 'Adeln fick mer makt och mark, bönderna fick betala mer skatt och hade mindre frihet',
        type: 'analytical',
        kingId: 'kristina',
        difficulty: 'hard'
    },
    {
        id: 19,
        question: 'Varför blev kungen mäktigare under Karl XI?',
        answer: 'Han införde envälde vilket betydde att kungen hade all makt och inte behövde lyssna på riksdagen',
        type: 'analytical',
        kingId: 'karl-xi',
        difficulty: 'hard'
    },
    {
        id: 20,
        question: 'Varför ville Karl XI också ha en stor armé trots fred?',
        answer: 'För att försvara Sveriges stora territorium och vara förberedd på krig',
        type: 'analytical',
        kingId: 'karl-xi',
        difficulty: 'hard'
    },
    {
        id: 21,
        question: 'Varför anklagades människor för häxeri?',
        answer: 'Folk var rädda och okunniga, ville hitta förklaringar till olyckor och sjukdomar',
        type: 'analytical',
        kingId: 'karl-xi',
        difficulty: 'hard'
    }
];

const EXTRA_QUESTIONS = [
    {
        id: 22,
        question: 'Vilka konsekvenser fick trettioåriga kriget för Sverige?',
        answer: 'Sverige blev en stormakt, fick nya territorier, men många dog och det kostade mycket pengar',
        type: 'analytical',
        kingId: 'gustaf-ii-adolf',
        difficulty: 'hard',
        isExtra: true
    },
    {
        id: 23,
        question: 'Hur förändrades makten i Sverige från Gustaf II Adolf till Karl XI?',
        answer: 'Makten gick från att delas mellan kung och adel till envälde där kungen hade all makt',
        type: 'analytical',
        difficulty: 'hard',
        isExtra: true
    },
    {
        id: 24,
        question: 'På vilka sätt påverkade Karl XI:s politik vanliga människor?',
        answer: 'Indelningsverket påverkade bönder, läskunnighetskrav påverkade alla, reduktionen påverkade adeln',
        type: 'analytical',
        kingId: 'karl-xi',
        difficulty: 'hard',
        isExtra: true
    },
    {
        id: 25,
        question: 'Varför började stormaktstiden ta slut under Karl XII?',
        answer: 'Sverige förlorade krig, förlorade territorier, ekonomin blev dålig, kungen dog',
        type: 'analytical',
        kingId: 'karl-xii',
        difficulty: 'hard',
        isExtra: true
    },
    {
        id: 26,
        question: 'Vad blev följderna av Karl XII:s död?',
        answer: 'Stormaktstiden tog slut, Sverige förlorade mycket territorium, makten gick till riksdagen',
        type: 'analytical',
        kingId: 'karl-xii',
        difficulty: 'hard',
        isExtra: true
    },
    {
        id: 27,
        question: 'Vad är likheter och skillnader mellan Gustaf II Adolf och Karl XII?',
        answer: 'Båda var krigarkungar och dog i krig, men Gustaf II Adolf vann sina krig medan Karl XII förlorade',
        type: 'comparative',
        difficulty: 'hard',
        isExtra: true
    },
    {
        id: 28,
        question: 'Hur skiljer sig Kristinas styre från Karl XI:s styre?',
        answer: 'Kristina delade makt med adeln och var intresserad av kultur, Karl XI hade envälde och fokuserade på militär och ekonomi',
        type: 'comparative',
        kingId: 'kristina',
        difficulty: 'hard',
        isExtra: true
    },
    {
        id: 29,
        question: 'Hur förändrades Sverige från början till slutet av stormaktstiden?',
        answer: 'Sverige gick från litet land till stormakt med stort territorium, sedan tillbaka till mindre land efter förluster',
        type: 'analytical',
        difficulty: 'hard',
        isExtra: true
    }
];

// Combine all questions
const ALL_QUESTIONS = [...STUDY_QUESTIONS, ...EXTRA_QUESTIONS];

// Multiple choice options for quiz mode
const QUIZ_TEMPLATES = [
    {
        question: 'När var Gustaf II Adolf kung?',
        options: ['1611-1632', '1632-1654', '1654-1660', '1697-1718'],
        correct: 0,
        kingId: 'gustaf-ii-adolf'
    },
    {
        question: 'Vad kallades Gustaf II Adolf?',
        options: ['Hjältekungen', 'Lejonet från Norden', 'Krigarkungen', 'Den vise kungen'],
        correct: 1,
        kingId: 'gustaf-ii-adolf'
    },
    {
        question: 'I vilket slag dog Gustaf II Adolf?',
        options: ['Poltava', 'Breitenfeld', 'Lützen', 'Narva'],
        correct: 2,
        kingId: 'gustaf-ii-adolf'
    },
    {
        question: 'Hur gammal var Kristina när hon blev drottning?',
        options: ['12 år', '15 år', '18 år', '6 år'],
        correct: 3,
        kingId: 'kristina'
    },
    {
        question: 'Vad gjorde Kristina år 1654?',
        options: ['Gifte sig', 'Abdikerade', 'Dog', 'Började ett krig'],
        correct: 1,
        kingId: 'kristina'
    },
    {
        question: 'När slutade det trettioåriga kriget?',
        options: ['1632', '1654', '1648', '1658'],
        correct: 2,
        kingId: 'kristina'
    },
    {
        question: 'Vilka områden fick Sverige från Danmark 1658?',
        options: ['Finland och Norge', 'Polen och Baltikum', 'Island och Grönland', 'Skåne, Blekinge, Halland och Bohuslän'],
        correct: 3,
        kingId: 'karl-x-gustav'
    },
    {
        question: 'Hur dog Karl X Gustav?',
        options: ['I strid', 'Lunginflammation', 'Gift', 'Olycka'],
        correct: 1,
        kingId: 'karl-x-gustav'
    },
    {
        question: 'Vad var freden i Roskilde?',
        options: ['Fred som avslutade trettioåriga kriget', 'Fred efter Karl XII:s död', 'Fred mellan Sverige och Danmark 1658', 'Fred mellan Sverige och Ryssland'],
        correct: 2,
        kingId: 'karl-x-gustav'
    },
    {
        question: 'Hur gammal var Karl XI när han blev kung?',
        options: ['6 år', '15 år', '4 år', '17 år'],
        correct: 2,
        kingId: 'karl-xi'
    },
    {
        question: 'Vad införde Karl XI?',
        options: ['Demokrati', 'Republik', 'Monarki', 'Envälde'],
        correct: 3,
        kingId: 'karl-xi'
    },
    {
        question: 'Vilket år infördes lag om läskunnighet?',
        options: ['1648', '1686', '1700', '1718'],
        correct: 1,
        kingId: 'karl-xi'
    },
    {
        question: 'Hur gammal var Karl XII när han blev kung?',
        options: ['17 år', '12 år', '15 år', '18 år'],
        correct: 2,
        kingId: 'karl-xii'
    },
    {
        question: 'När började det stora nordiska kriget?',
        options: ['1697', '1709', '1718', '1700'],
        correct: 3,
        kingId: 'karl-xii'
    },
    {
        question: 'Vilket slag förlorade Sverige 1709?',
        options: ['Lützen', 'Poltava', 'Narva', 'Breitenfeld'],
        correct: 1,
        kingId: 'karl-xii'
    },
    {
        question: 'När dog Karl XII?',
        options: ['1709', '1697', '1718', '1700'],
        correct: 2,
        kingId: 'karl-xii'
    },
    {
        question: 'Var dog Karl XII?',
        options: ['Vid Poltava i Ryssland', 'I Stockholm', 'Vid Narva', 'Vid Fredrikstens fästning i Norge'],
        correct: 3,
        kingId: 'karl-xii'
    },
    {
        question: 'Vad hände när Karl XII dog?',
        options: ['Sverige vann kriget', 'Stormaktstiden tog slut', 'Ett nytt krig började', 'Sverige blev större'],
        correct: 1,
        kingId: 'karl-xii'
    },
    {
        question: 'Vilket år sjönk skeppet Vasa?',
        options: ['1611', '1632', '1628', '1648'],
        correct: 2,
        kingId: 'gustaf-ii-adolf'
    },
    {
        question: 'Vem var Axel Oxenstierna?',
        options: ['En kung', 'En soldat', 'En präst', 'Gustaf II Adolfs viktigaste rådgivare'],
        correct: 3,
        kingId: 'gustaf-ii-adolf'
    }
];

// Story mode narrative
const STORY_CHAPTERS = [
    {
        id: 1,
        title: 'Början på en stormakt',
        text: 'Det är år 1611. Sverige är ett litet land i norra Europa. Din kung Gustaf II Adolf är bara 17 år gammal, men han har stora drömmar. Europa är i kris - katoliker och protestanter strider mot varandra i det som kommer att bli trettioåriga kriget.',
        choices: [
            { text: 'Bygg upp en stark armé', next: 2 },
            { text: 'Fokusera på handel och ekonomi', next: 3 }
        ]
    },
    {
        id: 2,
        title: 'Den starka armén',
        text: 'Du väljer att satsa på armén. Gustaf II Adolf moderniserar den svenska armén med nya taktiker och vapen. År 1630 går Sverige in i trettioåriga kriget för att försvara protestantismen. Vid Breitenfeld 1631 vinner ni en stor seger!',
        choices: [
            { text: 'Fortsätt kriget', next: 4 },
            { text: 'Gör fred nu', next: 5 }
        ]
    },
    {
        id: 3,
        title: 'Handel först',
        text: 'Du satsar på handel, men granländerna anfaller. Utan stark armé är det svårt att försvara Sverige. Kanske var det ett misstag att inte bygga upp försvaret först?',
        choices: [
            { text: 'Börja om och bygg armé', next: 2 }
        ]
    },
    {
        id: 4,
        title: 'Slaget vid Lützen',
        text: 'Det är 1632. Sverige fortsätter kriget. Men i slaget vid Lützen händer en tragedi - Gustaf II Adolf dödas i striden. Hans dotter Kristina är bara 6 år gammal. Axel Oxenstierna måste styra landet som förmyndare.',
        choices: [
            { text: 'Fortsätt till Kristinas tid', next: 6 }
        ]
    },
    {
        id: 5,
        title: 'Tidig fred',
        text: 'Att sluta fred nu skulle betyda att Sverige inte får de landområden som kommer i Westfaliska freden 1648. Historien förändras, men Sverige blir aldrig en riktigt stormakt.',
        choices: [
            { text: 'Prova en annan väg', next: 1 }
        ]
    },
    {
        id: 6,
        title: 'Drottning Kristina',
        text: 'År 1644 blir Kristina myndig. Hon är intelligent och intresserad av konst och vetenskap, men gillar inte att vara drottning. 1648 slutar trettioåriga kriget och Sverige får stora landområden i Tyskland.',
        choices: [
            { text: 'Fortsätt som drottning', next: 7 },
            { text: 'Abdikera', next: 8 }
        ]
    },
    {
        id: 7,
        title: 'Kristina fortsätter',
        text: 'Kristina fortsätter som drottning men är olycklig. Hon längtar efter frihet och vill studera. Till slut abdikerar hon ändå 1654.',
        choices: [
            { text: 'Gå vidare till Karl X Gustav', next: 8 }
        ]
    },
    {
        id: 8,
        title: 'Karl X Gustav',
        text: 'Kristinas kusin Karl X Gustav blir kung 1654. Han är en krigarkunng som försvarsare krig mot Danmark. Den svenska armén gör något otroligt - de går över Stora Bält när det är fruset! 1658 får Sverige Skåne, Blekinge, Halland och Bohuslän.',
        choices: [
            { text: 'Fortsätt till Karl XI', next: 9 }
        ]
    },
    {
        id: 9,
        title: 'Karl XI och enväldet',
        text: 'Karl XI blir kung 1660 när han bara är 4 år. När han blir äldre inför han envälde - kungen får all makt! Han tar tillbaka land från adeln och inför en lag om att alla ska kunna läsa.',
        choices: [
            { text: 'Fortsätt till Karl XII', next: 10 }
        ]
    },
    {
        id: 10,
        title: 'Karl XII och slutet',
        text: 'Karl XII blir kung 1697, bara 15 år gammal. Han är en modig krigare men 1700 attackerar Danmark, Polen och Ryssland Sverige samtidigt. Det stora nordiska kriget har börjat. Efter många år av krig förlorar Sverige vid Poltava 1709. Karl XII dör 1718 vid Fredrikstens fästning. Stormaktstiden är över.',
        choices: [
            { text: 'Starta om berättelsen', next: 1 }
        ]
    }
];

// Match mode pairs
const MATCH_PAIRS = [
    { left: 'Gustaf II Adolf', right: 'Lejonet från Norden', category: 'nicknames' },
    { left: 'Kristina', right: 'Abdikerade 1654', category: 'events' },
    { left: 'Karl X Gustav', right: 'Freden i Roskilde', category: 'events' },
    { left: 'Karl XI', right: 'Införde envälde', category: 'events' },
    { left: 'Karl XII', right: 'Dog vid Fredriksten', category: 'events' },
    { left: '1632', right: 'Gustaf II Adolf dog', category: 'dates' },
    { left: '1648', right: 'Trettioåriga kriget slutade', category: 'dates' },
    { left: '1658', right: 'Sverige fick Skåne', category: 'dates' },
    { left: '1709', right: 'Slaget vid Poltava', category: 'dates' },
    { left: '1718', right: 'Stormaktstiden slutade', category: 'dates' }
];

// Drawing prompts
const DRAWING_PROMPTS = [
    'Rita tidslinjen för stormaktstiden (1611-1718)',
    'Rita en symbol för Gustaf II Adolf (kanske ett lejon?)',
    'Rita en krona för drottning Kristina',
    'Rita ett svärd för Karl XII',
    'Rita kartan över Sverige före och efter 1658',
    'Rita symboler för de 5 kungarna'
];

// Audio content - matches the transcripts in audio_transcript.txt
const AUDIO_STORIES = [
    {
        kingId: 'gustaf-ii-adolf',
        title: 'Gustaf II Adolf',
        text: 'Gustaf den andre Adolf, även känd som Lejonet från Norden, var kung av Sverige mellan sexton elva och sexton trettiotvå. Han blev kung när han bara var sjutton år och förde Sverige in i trettioåriga kriget på protestanternas sida.\n\nGustaf den andre Adolf var känd som "Lejonet från Norden". Han förvandlade Sverige till en stormakt genom att modernisera den svenska armén med nya taktiker och vapen. Han vann flera stora slag i trettioåriga kriget, särskilt den stora segern vid Breitenfeld år sexton trettioett.\n\nTyvärr dog Gustaf den andre Adolf i slaget vid Lützen år sexton trettiotvå. Han var en av Sveriges mest kända kungar och hans insatser gjorde Sverige till en mäktig stormakt i Europa.'
    },
    {
        kingId: 'kristina',
        title: 'Drottning Kristina',
        text: 'Drottning Kristina var Sveriges drottning mellan sexton trettiotvå och sexton femtiofyra. Hon blev drottning när hon bara var sex år gammal efter att hennes far Gustaf den andre Adolf dog i slaget vid Lützen.\n\nKristina var mycket intelligent och intresserad av konst, vetenskap och filosofi. Under hennes tid som drottning främjade hon kulturen i Sverige. År sexton fyrtiåtta avslutades trettioåriga kriget med Westfaliska freden, och Sverige fick viktiga områden i Tyskland.\n\nÅr sexton femtiofyra abdikerade Kristina - det betyder att hon lämnade tronen frivilligt. Hon lämnade Sverige och konverterade till katolicismen. Hennes kusin Karl den tionde Gustav blev kung efter henne. Kristina gifte sig aldrig.'
    },
    {
        kingId: 'karl-x-gustav',
        title: 'Karl X Gustav',
        text: 'Karl den tionde Gustav, även känd som Krigarkungen, var kung av Sverige mellan sexton femtiofyra och sexton sextio. Han var Kristinas kusin som blev kung när hon abdikerade.\n\nKarl den tionde Gustav var känd för sina danska krig. Den mest berömda händelsen var när den svenska armén gick över Stora Bält när det var fruset - något som var mycket vågat och modigt!\n\nÅr sexton femtioåtta slöts freden i Roskilde. Genom denna fred fick Sverige Skåne, Blekinge, Halland och Bohuslän från Danmark. Detta expanderade Sveriges territorium markant. Karl den tionde Gustav dog av lunginflammation år sexton sextio.'
    },
    {
        kingId: 'karl-xi',
        title: 'Karl XI',
        text: 'Karl den elfte, även känd som Den envåldige härskaren, var kung av Sverige mellan sexton sextio och sexton nittiosju. Han blev kung när han bara var fyra år gammal, så förmyndare styrde landet först tills han blev äldre.\n\nKarl den elfte införde envälde, vilket också kallas absolutism. Det betydde att kungen fick all makt och inte behövde lyssna på riksdagen. Han tog tillbaka mark från adeln genom reduktionen, vilket minskade adelns makt.\n\nEn viktig reform var att Karl den elfte ville att alla svenskar skulle lära sig läsa. År sexton åttiåsex infördes en lag om läskunnighet. Präster kontrollerade att folk kunde läsa genom så kallade husförhör. Han stärkte också den svenska armén genom indelningsverket.'
    },
    {
        kingId: 'karl-xii',
        title: 'Karl XII',
        text: 'Karl den tolfte, även känd som Hjältekungen, var kung av Sverige mellan sexton nittiåsju och sjutton arton. Han blev kung när han var femton år gammal och är känd som en krigarkunng.\n\nÅr sjutton hundra började det stora nordiska kriget när Danmark, Polen och Ryssland attackerade Sverige samtidigt. Karl den tolfte var en mycket skicklig militär strateg och vann flera tidiga segrar.\n\nMen år sjutton hundra nio förlorade Sverige det viktiga slaget vid Poltava mot Ryssland. Detta var början på slutet för Sveriges stormaktstid. Karl den tolfte bodde många år utomlands efter detta.\n\nDen trettionde november år sjutton arton dog Karl den tolfte vid Fredrikstens fästning i Norge. Med hans död tog Sveriges stormaktstid slut. Sverige förlorade mycket territorium och makten gick från kungen tillbaka till riksdagen.'
    }
];

// Achievements system
const ACHIEVEMENTS = [
    { id: 'first-quiz', name: 'Första Quizet', icon: '🎯', description: 'Genomför ditt första quiz' },
    { id: 'perfect-quiz', name: 'Perfekt Quiz', icon: '💯', description: 'Få alla rätt i ett quiz' },
    { id: 'seven-streak', name: 'Veckostreak', icon: '🔥', description: 'Studera 7 dagar i rad' },
    { id: 'all-kings', name: 'Kungamästare', icon: '👑', description: 'Lär dig om alla 5 kungarna' },
    { id: 'timeline-master', name: 'Tidslinjemästare', icon: '📅', description: 'Klara tidslinjenutmaningen perfekt' },
    { id: 'hundred-stars', name: 'Stjärnsamlare', icon: '⭐', description: 'Samla 100 stjärnor' },
    { id: 'story-complete', name: 'Berättaren', icon: '📖', description: 'Genomför hela berättelsen' },
    { id: 'quick-learner', name: 'Snabblärare', icon: '⚡', description: 'Svara på 50 frågor' },
    { id: 'artist', name: 'Konstnär', icon: '🎨', description: 'Spara 5 teckningar' }
];

// Export all data
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        KINGS,
        TIMELINE_EVENTS,
        STUDY_QUESTIONS,
        EXTRA_QUESTIONS,
        ALL_QUESTIONS,
        QUIZ_TEMPLATES,
        STORY_CHAPTERS,
        MATCH_PAIRS,
        DRAWING_PROMPTS,
        AUDIO_STORIES,
        ACHIEVEMENTS
    };
}
