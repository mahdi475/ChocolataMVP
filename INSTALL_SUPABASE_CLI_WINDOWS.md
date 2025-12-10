# Installing Supabase CLI on Windows

The Supabase CLI **cannot** be installed globally via `npm install -g supabase`. Use one of these methods instead:

## Method 1: Using Scoop (Recommended)

Scoop is a package manager for Windows. It's the easiest way to install Supabase CLI.

### Step 1: Install Scoop (if not already installed)

Open PowerShell as Administrator and run:

```powershell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
irm get.scoop.sh | iex
```

### Step 2: Add Supabase bucket and install

```powershell
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

### Step 3: Verify installation

```powershell
supabase --version
```

## Method 2: Using Chocolatey

If you have Chocolatey installed:

```powershell
choco install supabase
```

## Method 3: Using npm (Local Project Only)

You can install Supabase CLI as a dev dependency in your project:

```bash
npm install supabase --save-dev
```

Then use it with `npx`:

```bash
npx supabase --version
npx supabase login
npx supabase functions deploy send-order-email
```

## Method 4: Direct Download

1. Go to: https://github.com/supabase/cli/releases
2. Download the latest `supabase_windows_amd64.zip` (or `supabase_windows_arm64.zip` for ARM)
3. Extract the `supabase.exe` file
4. Add the folder to your Windows PATH environment variable

## After Installation

Once installed, you can proceed with the Edge Functions setup:

```bash
# Login to Supabase
supabase login

# Link your project
supabase link --project-ref your-project-ref

# Deploy functions
supabase functions deploy send-order-email
supabase functions deploy payment-webhook
supabase functions deploy send-order-status-email
```

## Troubleshooting

### "supabase: command not found"
- Make sure Supabase CLI is in your PATH
- Restart your terminal/PowerShell after installation
- Verify with `supabase --version`

### Permission Errors
- Run PowerShell as Administrator if needed
- Check that Scoop/Chocolatey have proper permissions

### Alternative: Use Supabase Dashboard

If you prefer not to use CLI, you can:
1. Create Edge Functions directly in Supabase Dashboard
2. Copy-paste the function code from `supabase/functions/` directory
3. Set secrets in Dashboard → Edge Functions → Secrets

