<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="app-url" content="{{ url('/') }}">
    @include('layouts.partials.favicon')
    <title>@yield('title', 'Salevince POS')</title>
    @vite(['resources/sass/app.scss', 'resources/js/app.js'])
    @include('layouts.partials.icon-fonts')
    @yield('css')
</head>

<body class="snd-public-shell">
    <div id="app" class="d-flex flex-column min-vh-100">
        <nav class="snd-topbar" style="position:relative!important;">
            <a href="{{ url('/') }}" class="snd-topbar-label d-flex">
                <strong>Salevince POS</strong>
                <span>Operations workspace</span>
            </a>
            <div class="snd-topbar-actions">
                @guest
                    <a href="{{ route('login') }}" class="btn btn-outline-primary">{{ __('Login') }}</a>
                    @if (Route::has('register'))<a href="{{ route('register') }}" class="btn btn-primary">{{ __('Register') }}</a>@endif
                @else
                    <a href="{{ route('home') }}" class="btn btn-primary">{{ __('dashboard.title') }}</a>
                    <a href="{{ route('logout') }}" class="btn btn-outline-secondary" onclick="event.preventDefault(); document.getElementById('logout-form').submit();">{{ __('Logout') }}</a>
                    <form id="logout-form" action="{{ route('logout') }}" method="POST" class="d-none">@csrf</form>
                @endguest
            </div>
        </nav>
        <main class="flex-grow-1 py-4 px-3 px-md-4">@yield('content')</main>
    </div>
    @yield('js')
</body>

</html>
