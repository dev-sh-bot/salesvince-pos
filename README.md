# Salevince POS

Salevince POS is a Laravel 12 point-of-sale application with React/Vite frontend assets.

## Requirements

- PHP 8.2 or newer
- Composer
- Node.js and npm
- A database: SQLite (quickest) or MySQL/MariaDB (available through Laragon)

The commands below are written for Windows PowerShell and assume the project is located at:

```powershell
cd C:\laragon\www\inpl-pos
```

## First-time setup

1. Install PHP and JavaScript dependencies:

   ```powershell
   composer install
   npm install
   ```

2. Create the local environment file and application key:

   ```powershell
   Copy-Item .env.example .env
   php artisan key:generate
   ```

3. Configure a database using one of the options below.

For the simplest local setup, you can also use file-backed cache and synchronous jobs by setting these values in `.env`:

```dotenv
CACHE_STORE=file
QUEUE_CONNECTION=sync
```

The repository does not include migrations for the `cache` and `jobs` tables. Those tables are only needed if you keep the database-backed cache and queue settings from `.env.example`.

### Option A: SQLite

This is the quickest local setup and matches the defaults in `.env.example`.

```powershell
New-Item -ItemType File -Path database\database.sqlite -Force
php artisan migrate --seed
```

Leave `DB_CONNECTION=sqlite` in `.env`.

### Option B: Laragon MySQL/MariaDB

1. Start MySQL from the Laragon control panel.
2. Create an empty database, for example `inpl_pos`.
3. Update the database section in `.env`:

   ```dotenv
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=inpl_pos
   DB_USERNAME=root
   DB_PASSWORD=
   ```

   Change `DB_USERNAME` and `DB_PASSWORD` if your local database uses different credentials.

4. Run the migrations and demo seeders:

   ```powershell
   php artisan migrate --seed
   ```

## Start the application

Use two terminals from the project directory.

### Terminal 1: Laravel server

```powershell
php artisan serve
```

Open [http://127.0.0.1:8000](http://127.0.0.1:8000).

### Terminal 2: Vite development assets

```powershell
npm run dev
```

Keep the Vite terminal running while developing so CSS and JavaScript changes are rebuilt automatically.

### Run all development services together

The project also includes a combined development command that starts the Laravel server, queue listener, log viewer, and Vite. If `CACHE_STORE=database` and `QUEUE_CONNECTION=database` are still enabled, create their tables first:

```powershell
php artisan make:cache-table
php artisan make:queue-table
php artisan migrate
```

Then run:

```powershell
composer run dev
```

If the combined command does not work in your shell, use the two separate commands above. Normal local development only requires `php artisan serve` and `npm run dev`.

## Laragon URL

Because the project is inside `C:\laragon\www`, Laragon may also expose it through an automatic virtual host such as:

```text
http://inpl-pos.test
```

If that URL is unavailable, use the `php artisan serve` URL instead.

## Demo accounts

These accounts are created by `php artisan migrate --seed`:

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@gmail.com` | `admin123` |
| User | `user@gmail.com` | `user123` |

Change or remove these seeded credentials before using the application outside local development.

## Useful commands

```powershell
# Check the Laravel version
php artisan --version

# Run the test suite
php artisan test

# Build production frontend assets
npm run build

# Clear cached configuration/routes/views
php artisan optimize:clear

# Create the public storage link when file uploads need it
php artisan storage:link
```

To rebuild the local database from scratch and reseed it, use the following only when it is safe to delete the current database data:

```powershell
php artisan migrate:fresh --seed
```

## Troubleshooting

- **`No application encryption key has been specified`:** run `php artisan key:generate`.
- **Database connection errors:** check the `DB_*` values in `.env`, confirm the database service is running, and run `php artisan optimize:clear`.
- **Missing tables:** run `php artisan migrate --seed`.
- **CSS or JavaScript is missing:** keep `npm run dev` running, or run `npm run build` and refresh the page.
- **Composer or npm command not found:** install Composer and Node.js, then restart the terminal so they are added to `PATH`.
