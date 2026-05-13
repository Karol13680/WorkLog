# Worklog - System Zarządzania Czasem i Projektami

## Opis Projektu
**Worklog** to  aplikacja webowa służąca do efektywnego zarządzania projektami, zleceniami oraz śledzenia czasu pracy. System został zaprojektowany z myślą o freelancerach i małych zespołach, które potrzebują prostego, ale potężnego narzędzia do ewidencji czasu spędzonego nad zadaniami dla różnych klientów.

Aplikacja integruje warstwę wizualną zbudowaną w React z solidnym backendem w Flask, wykorzystując bazę danych PostgreSQL do przechowywania informacji o klientach, projektach i logach czasu.

## Główne Funkcjonalności
- **Zarządzanie Zleceniami (Jobs):** Pełny cykl życia zadania – od utworzenia, przez przypisanie priorytetu i klienta, aż po zakończenie.
- **Interaktywny Stoper:** Możliwość śledzenia czasu pracy w czasie rzeczywistym dla konkretnego zadania.
- **Baza Klientów i Kontaktów:** Centralny rejestr kontrahentów powiązanych z projektami.
- **System Raportowania:** Wizualizacja postępów i czasu pracy za pomocą czytelnych wykresów.
- **Eksport Danych:** Możliwość generowania dokumentów PDF z podsumowaniami prac.
- **Bezpieczeństwo:** Integracja z systemem **Clerk** zapewnia bezpieczne logowanie i zarządzanie profilami użytkowników.
- **Responsywny Design:** Interfejs dostosowany do urządzeń stacjonarnych i mobilnych.

## Technologie
### Frontend
- **React 19** – biblioteka UI.
- **TypeScript** – bezpieczeństwo typowania.
- **Vite** – szybkie środowisko budowania.
- **Sass (SCSS)** – zaawansowane stylowanie.
- **Clerk** – zaawansowana obsługa autentykacji.
- **Chart.js** – generowanie interaktywnych wykresów.

### Backend
- **Python 3.11** – stabilność i wydajność.
- **Flask** – lekki framework webowy.
- **SQLAlchemy** – potężny system ORM do obsługi bazy danych.
- **PostgreSQL** – relacyjna baza danych klasy korporacyjnej.
- **Flask-Migrate** – zarządzanie wersjonowaniem schematu bazy danych.

### Infrastruktura i Deployment
- **Docker** – konteneryzacja aplikacji.
- **Docker Compose** – orkiestracja usług (aplikacja + baza danych).

## Struktura Projektu
```text
Worklog/
├── app/                # Frontend (React + Vite)
│   ├── src/            # Kod źródłowy (komponenty, strony, API)
│   └── package.json    # Zależności frontendu
├── server/             # Backend (Flask)
│   ├── app/            # Logika biznesowa, modele, trasy API
│   ├── run.py          # Punkt wejściowy backendu
│   └── requirements.txt# Zależności Pythona
├── Dockerfile          # Instrukcja budowania obrazu (Multi-stage)
└── docker-compose.yml  # Konfiguracja usług Docker
```

## Instalacja i Uruchomienie

### Szybki start z Docker (rekomendowane)
Najprostszym sposobem na uruchomienie projektu jest użycie Docker Compose:

1. **Klonowanie repozytorium:**
   ```bash
   git clone <url-repozytorium>
   cd Worklog
   ```

2. **Przygotowanie zmiennych środowiskowych:**
   Upewnij się, że posiadasz odpowiednie klucze Clerk (wymagane do działania logowania).

3. **Uruchomienie kontenerów:**
   ```bash
   docker-compose up --build
   ```

Aplikacja będzie dostępna pod adresem: `http://localhost:5000` (serwer Flask serwuje również zbudowany frontend).

### Uruchomienie lokalne (Development)

#### Backend:
```bash
cd server
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python run.py
```

#### Frontend:
```bash
cd app
npm install
npm run dev
```

## Zmienne Środowiskowe
Aplikacja wymaga następujących zmiennych (można je zdefiniować w pliku `.env`):
- `DATABASE_URL` – format: `postgresql://użytkownik:hasło@host:port/nazwa_bazy`
- `VITE_CLERK_PUBLISHABLE_KEY` – klucz publiczny z panelu Clerk.
- `SECRET_KEY` – dowolny ciąg znaków dla sesji Flask.

---
Projekt stworzony w celach usprawnienia ewidencji pracy i zarządzania relacjami z klientami.
