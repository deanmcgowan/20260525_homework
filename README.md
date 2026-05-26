# Stormaktstiden - PWA Lärarapp

En interaktiv Progressive Web App (PWA) för att lära sig om Sveriges stormaktstid (1611-1718). Optimerad för iPhone 12 och designad för en 12-årig elev med ADHD.

## 📚 Om Appen

Denna app hjälper elever att lära sig om Sveriges stormaktstid genom 7 olika engagerande inlärningslägen:

- **Snabbquiz** (3-5 min) - 5 slumpmässiga flervalsfrågor med slumpmässigt blandade svarsalternativ (Fisher-Yates shuffling)
- **Tidslinjen** (5-7 min) - Klicka för att placera händelser på en tidslinje (optimerad för touch)
- **Kungens Kort** (4-6 min) - Swipebara flashcards för varje kung
- **Snabbmatchning** (3-4 min) - Matcha kungar med händelser
- **Rita & Anteckna** (5-8 min) - Rita visuella minnesbilder
- **Ljudberättelse** (5-10 min) - Lyssna på berättelser om kungarna
- **Provtest** (10-15 min) - Simulera ett riktigt test

## 🎯 Funktioner

### ADHD-Optimerad Design
- Korta sessioner (3-15 minuter)
- Visuell feedback och belöningar
- Minimal distraktion
- Tydlig framstegsspårning
- Variation i inlärningsmetoder

### PWA-Funktionalitet
- ✅ Fungerar offline
- ✅ Installerbar till hemskärmen
- ✅ Snabb laddning
- ✅ App-liknande upplevelse
- ✅ Optimerad för iPhone 12 (390x844px)

### Gamification
- 🔥 Dagliga streaks
- ⭐ Stjärnsystem
- 🏆 Achievements/utmärkelser
- 📊 Framstegsspårning per kung
- 💯 Träffsäkerhetsstatistik

## 📖 Innehåll

### De 5 Kungarna
1. **Gustaf II Adolf** (1611-1632) - Lejonet från Norden
2. **Kristina** (1632-1654) - Drottning som abdikerade
3. **Karl X Gustav** (1654-1660) - Erövrade Skåne
4. **Karl XI** (1660-1697) - Införde envälde
5. **Karl XII** (1697-1718) - Krigarkunng

### Frågor
- 21 grundläggande studiefrågor
- 8 extra fördjupningsfrågor
- Totalt 29 frågor som täcker hela perioden

### Tidslinje
- 16 viktiga händelser från 1611-1718
- Visualiserade på en interaktiv tidslinje

## 🚀 Kom Igång

### Öppna Appen Lokalt
1. Öppna `index.html` i en webbläsare
2. För bästa upplevelse, använd iPhone 12 eller liknande enhet
3. Installera till hemskärmen för PWA-funktionalitet

### Utveckling
Appen är byggd med vanilla JavaScript och kräver ingen build-process:

```bash
# Servera appen (valfri HTTP-server)
python -m http.server 8000
# eller
npx serve
```

## 🐳 Deploying till Google Cloud Run

Denna app kan enkelt deployas till Google Cloud Run för produktion. Följ dessa steg:

### Förutsättningar
- Google Cloud Project med fakturering aktiverad
- Google Cloud SDK (gcloud) installerat
- Docker installerat lokalt (för lokal testning)

### Steg 1: Sätt upp Google Cloud Project

```bash
# Logga in på Google Cloud
gcloud auth login

# Sätt ditt projekt-ID (ersätt PROJECT_ID med ditt faktiska projekt-ID)
export PROJECT_ID="ditt-projekt-id"
gcloud config set project $PROJECT_ID

# Aktivera nödvändiga API:er
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable artifactregistry.googleapis.com
```

### Steg 2: Skapa Artifact Registry Repository

```bash
# Skapa ett Docker repository i Artifact Registry
gcloud artifacts repositories create stormaktstiden \
    --repository-format=docker \
    --location=europe-north1 \
    --description="Stormaktstiden PWA Docker images"

# Konfigurera Docker för att autentisera med Artifact Registry
gcloud auth configure-docker europe-north1-docker.pkg.dev
```

### Lokal Docker Testning

För att testa Docker-containern lokalt innan deployment till Cloud Run:

```bash
# Steg 1: Stoppa och ta bort gamla containers (om de finns)
docker stop stormaktstiden-local 2>/dev/null || true
docker rm stormaktstiden-local 2>/dev/null || true

# Steg 2: Ta bort gamla images för att undvika cachade versioner
docker rmi stormaktstiden-local 2>/dev/null || true

# Steg 3: Bygg imagen från scratch (utan cache)
docker build --no-cache -t stormaktstiden-local .

# Steg 4: Kör containern
docker run -d -p 8080:8080 --name stormaktstiden-local stormaktstiden-local

# Steg 5: Öppna http://localhost:8080 i din webbläsare
```

**Komplett skript för snabb ombyggnad:**
```bash
# Ett kommando som gör allt ovan
docker stop stormaktstiden-local 2>/dev/null || true && \
docker rm stormaktstiden-local 2>/dev/null || true && \
docker rmi stormaktstiden-local 2>/dev/null || true && \
docker build --no-cache -t stormaktstiden-local . && \
docker run -d -p 8080:8080 --name stormaktstiden-local stormaktstiden-local && \
echo "Container körs på http://localhost:8080"
```

**Användbara Docker-kommandon:**
```bash
# Visa container-loggar
docker logs stormaktstiden-local

# Följ loggar i realtid
docker logs -f stormaktstiden-local

# Stoppa containern
docker stop stormaktstiden-local

# Starta om containern
docker restart stormaktstiden-local

# Inspektera containern
docker inspect stormaktstiden-local

# Rensa alla oanvända Docker-resurser
docker system prune -a
```

**OBS:** Denna app är designad för lokal Docker-körning och deployment till Google Cloud Run.
Den publiceras inte till Docker Hub.

### Steg 3: Deploya till Cloud Run (Direkt från Cloud Build)

Du kan deploya direkt till Cloud Run utan att manuellt pusha till Artifact Registry:

```bash
# Deploya med Cloud Build (rekommenderat)
gcloud run deploy stormaktstiden-app \
    --source . \
    --platform managed \
    --region europe-north1 \
    --allow-unauthenticated \
    --memory 512Mi \
    --cpu 1 \
    --min-instances 0 \
    --max-instances 10
```

Detta kommando bygger Docker-imagen automatiskt och deployer den till Cloud Run.

### Steg 4: Få URL och Öppna Appen

```bash
# Hämta URL:en till din deployade app
gcloud run services describe stormaktstiden-app \
    --region=europe-north1 \
    --format='value(status.url)'

# Öppna appen i din webbläsare
gcloud run services describe stormaktstiden-app \
    --region=europe-north1 \
    --format='value(status.url)' | xargs open
```

### Uppdatera Appen

När du gör ändringar i koden, uppdatera deploymentent:

```bash
# Deploya ny version (Cloud Build bygger automatiskt)
gcloud run deploy stormaktstiden-app \
    --source . \
    --region europe-north1
```

### Kostnader

Cloud Run använder en "pay-as-you-go" modell:
- **Gratis tier**: 2 miljoner requests/månad
- **Kostnad**: Endast när appen körs (ingen kostnad vid stillastående)
- **Uppskattad kostnad**: För en liten educational app som denna, förmodligen inom gratis tier

### Felsökning

```bash
# Visa loggar från Cloud Run
gcloud run services logs read stormaktstiden-app --region=europe-north1

# Beskriva servicen för att se status
gcloud run services describe stormaktstiden-app --region=europe-north1
```

### Ta Bort Resurser

Om du vill ta bort alla resurser:

```bash
# Ta bort Cloud Run service
gcloud run services delete stormaktstiden-app --region=europe-north1

# Ta bort Artifact Registry repository
gcloud artifacts repositories delete stormaktstiden --location=europe-north1
```

### Filstruktur
```
/
├── index.html              # Huvudfil
├── manifest.json           # PWA manifest
├── service-worker.js       # Offline-funktionalitet
├── Dockerfile              # Docker container konfiguration
├── nginx.conf              # Nginx web server konfiguration
├── cloudrun.yaml           # Google Cloud Run service definition
├── .dockerignore           # Filer att exkludera från Docker build
├── styles/
│   └── main.css           # All styling
├── js/
│   ├── app.js             # Huvudapp och initialisering
│   ├── data.js            # All historisk data
│   ├── storage.js         # IndexedDB hantering
│   ├── utils.js           # Hjälpfunktioner
│   ├── progress.js        # Framstegsskärm
│   └── modes/
│       ├── quiz.js        # Quiz-läge
│       ├── timeline.js    # Tidslinje-läge
│       ├── cards.js       # Flashcard-läge
│       ├── story.js       # Berättelse-läge
│       ├── match.js       # Matchning-läge
│       ├── draw.js        # Rit-läge
│       ├── audio.js       # Audio-läge
│       └── test.js        # Test-läge
└── assets/
    ├── icon-192.svg       # App-ikon 192x192
    ├── icon-512.svg       # App-ikon 512x512
    └── audio/
        ├── gustaf_ii_adolf.mp3  # Ljudberättelse Gustaf II Adolf
        ├── kristina.mp3         # Ljudberättelse Kristina
        ├── karl_x_gustav.mp3    # Ljudberättelse Karl X Gustav
        ├── karl_xi.mp3          # Ljudberättelse Karl XI
        └── karl_xii.mp3         # Ljudberättelse Karl XII
```

## 🎧 Ljudberättelser

Appen inkluderar ett ljudberättelse-läge där elever kan lyssna på högkvalitativa inspelningar om de fem kungarna.

### Nuvarande Implementation
Appen använder professionellt genererade MP3-filer för varje kung, lagrade i `assets/audio/`:
- `gustaf_ii_adolf.mp3` - Berättelse om Gustaf II Adolf
- `kristina.mp3` - Berättelse om Drottning Kristina
- `karl_x_gustav.mp3` - Berättelse om Karl X Gustav
- `karl_xi.mp3` - Berättelse om Karl XI
- `karl_xii.mp3` - Berättelse om Karl XII

Dessa ljudfiler genererades med högkvalitativ svensk text-till-tal (TTS) för optimal inlärningsupplevelse.

### Implementation Detaljer
Ljudläget använder HTML5 Audio API för att spela upp MP3-filerna direkt i webbläsaren, vilket ger:
- Konsekvent ljudkvalitet på alla enheter
- Pålitlig uppspelning utan internetanslutning (när appen är offline)
- Bättre svensk uttal än standard Web Speech API
- Stöd för paus, återupptagning och navigering mellan berättelser

## 💾 Datalagring

Appen använder IndexedDB för att spara:
- Framsteg och statistik
- Svar på frågor
- Ritningar
- Upplåsta achievements

All data sparas lokalt på enheten och fungerar offline.

## 🎨 Design

### Färgpalett
- **Primär**: `#2563EB` (Kunglig blå)
- **Framgång**: `#10B981` (Grön)
- **Varning**: `#F59E0B` (Gul)
- **Fel**: `#EF4444` (Röd)
- **Bakgrund**: `#FFFBF5` (Krämvit)

### Typografi
- System-fonter för bästa prestanda
- 16-20px för huvudtext
- 24-32px för rubriker
- Hög kontrast för läsbarhet

## 🔧 Teknisk Stack

- **Frontend**: Vanilla HTML, CSS, JavaScript
- **Storage**: IndexedDB + LocalStorage
- **PWA**: Service Worker med cache-first strategi
- **Audio**: HTML5 Audio API med förinspelade MP3-filer
- **Offline**: Service Worker cache

## 📱 Browser Support

- ✅ iOS Safari 14+
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Edge 90+

Optimerad specifikt för:
- iPhone 12 (390x844px)
- iOS Safari med PWA-stöd

## 🐛 Debug

Öppna konsolen och använd:

```javascript
// Återställ all progress
window.debugApp.resetProgress()

// Lägg till stjärnor
window.debugApp.addStars(100)

// Lås upp alla achievements
window.debugApp.unlockAll()

// Visa aktuell progress
window.debugApp.getProgress()
```

## 📄 Licens

Skapad för utbildningsändamål.

## 👨‍💻 Utveckling

Appen är byggd med fokus på:
- Prestanda (< 1s laddningstid)
- Tillgänglighet (ADHD-vänlig)
- Offline-first arkitektur
- Minimal bundle-storlek
- Touch-optimerad interaktion

## 🎓 Pedagogisk Grund

Baserad på beprövade inlärningsmetoder:
- **Retrieval Practice** - Aktiv återkallning
- **Spaced Repetition** - Upprepning över tid
- **Interleaving** - Blandade övningstyper
- **Dual Coding** - Visuellt + verbalt
- **Immediate Feedback** - Omedelbar återkoppling

Speciellt anpassad för ADHD genom:
- Korta fokusperioder
- Variation och val
- Visuella belöningar
- Tydlig struktur
- Minimal överbelastning

---

**Lycka till med studierna! ⚔️📚**
