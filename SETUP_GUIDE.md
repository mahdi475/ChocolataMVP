# 🚀 SETUP GUIDE - Fixa Login/Logout

## Problem
- Login spinner i evighet
- Logout fungerar inte
- **Orsak**: Supabase är inte konfigurerat!

## ✅ Lösning (3 enkla steg):

### 1️⃣ Skaffa Supabase Credentials

1. Gå till: https://supabase.com/dashboard
2. Skapa nytt projekt ELLER välj befintligt
3. Gå till **Settings** → **API**
4. Kopiera:
   - **Project URL** (typ: `https://xxxxx.supabase.co`)
   - **anon public** key (lång sträng)

### 2️⃣ Skapa .env fil

Skapa en fil `.env` i projektets rot (`MVP(chocolata)/.env`):

```env
VITE_SUPABASE_URL=https://din-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=din_långa_anon_key_här
```

**VIKTIGT**: Ersätt med dina RIKTIGA värden från Supabase!

### 3️⃣ Setup Database

1. Gå till Supabase Dashboard → **SQL Editor**
2. Kör filen: `supabase-setup.sql` (kopiera hela innehållet och kör)
3. Kör filen: `fix-users-policy-v2.sql` (för att fixa user policies)
4. Kör filen: `supabase-storage-setup.sql` (för file upload)

### 4️⃣ Starta om servern

```bash
npm run dev
```

## 🎯 Efter detta fungerar:
- ✅ Login
- ✅ Logout
- ✅ Registrering
- ✅ Seller verification upload
- ✅ Alla features vi byggde!

## 🔥 Test Users (skapa dessa efter setup):

### Admin:
- Email: admin@chocolata.com
- Password: admin123

### Seller:
- Email: seller@chocolata.com
- Password: seller123

### Buyer:
- Email: buyer@chocolata.com
- Password: buyer123

---

## Troubleshooting

**Om login fortfarande spinner:**
1. Kolla browser console (F12) för error meddelanden
2. Verifiera att .env filen har rätt credentials
3. Kolla att alla SQL scripts körts i Supabase
4. Starta om servern (Ctrl+C och `npm run dev` igen)

**Om du inte har Supabase project:**
1. Gå till https://supabase.com
2. Klicka "New Project"
3. Välj organization (eller skapa ny)
4. Välj region (Europe West för Sverige)
5. Sätt database password
6. Vänta 2 min medan projektet skapas
7. Följ steg 1️⃣ ovan
