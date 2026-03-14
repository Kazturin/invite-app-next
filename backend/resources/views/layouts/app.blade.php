<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $metaTitle ?: 'Toi-Invite блог' }}</title>
    <meta name="description" content="{{ $metaDescription }}">

    <meta property="og:title" content="{{ $metaTitle ?: 'Toi-Invite блог' }}">
    <meta property="og:description" content="{{ $metaDescription ?? '' }}">
    <meta property="og:image" content="{{ $metaImage ?? asset('logo.png') }}">
    <meta property="og:url" content="{{ url()->current() }}">
    <meta property="og:type" content="Пост">

    <style>
        @import url('https://fonts.googleapis.com/css?family=Karla:400,700&display=swap');
    </style>
    <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon">
   <script async type="text/javascript" >
        (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
            m[i].l=1*new Date();
            for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
            k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
        (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

        ym(96119899, "init", {
            clickmap:true,
            trackLinks:true,
            accurateTrackBounce:true
        });
    </script>
    <noscript><div><img src="https://mc.yandex.ru/watch/96119899" style="position:absolute; left:-9999px;" alt="" /></div></noscript>

    <!-- Font Awesome -->
    <!--    <script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.0/js/all.min.js"
                integrity="sha256-KzZiKy0DWYsnwMF+X1DvQngQ2/FxF7MF3Ff72XcpuPs=" crossorigin="anonymous"></script>-->
    @vite('resources/admin/app.css')

</head>
<body class="bg-gray-50 font-family-karla">


<!-- Text Header -->
<header class="w-full bg-gradient-to-b from-yellow-500">
    <div class="container mx-auto">
        <div class="flex items-center justify-center space-x-2 py-12">
            <img class="w-24 md:w-28" src="/logo-without-text.png" alt="logo">
            <div>
                <a class="font-bold text-gray-700 uppercase hover:text-gray-700 text-3xl md:text-5xl" href="{{route('home')}}">
                    Toi-invite блог
                    </a>
            </div>
        </div>
    </div>
</header>

<!-- Topic Nav -->
<nav class="w-full py-4 border-t border-b bg-gray-100" x-data="{ open: false }">
    <div class="block sm:hidden">
        <a
            href="#"
            class="block md:hidden text-base font-bold uppercase text-center flex justify-center items-center"
            @click="open = !open"
        >
            Меню <i :class="open ? 'fa-chevron-down': 'fa-chevron-up'" class="fas ml-2"></i>
        </a>
    </div>
    <div :class="open ? 'block': 'hidden'" class="w-full flex-grow sm:flex sm:items-center sm:w-auto">
        <div
            class="w-full container mx-auto flex flex-col sm:flex-row items-center justify-between text-sm font-bold uppercase mt-0 px-6 py-2">
            <div class="flex flex-row flex-wrap space-2 items-center">
                <a href="{{route('home')}}" class="hover:bg-blue-600 hover:text-white rounded p-2 mx-2">Басты бет</a>
                @foreach($categories as $category)
                    <a href="{{route('by-category', $category)}}"
                       class="hover:bg-blue-600 hover:text-white rounded p-2 mx-2">{{$category->title}}</a>
                @endforeach
                <a href="/app/select-template" class="hover:bg-blue-600 hover:text-white rounded py-2 px-4 mx-2">Шақырту жасау</a>
                {{--                <a href="{{route('about-us')}}" class="hover:bg-blue-600 hover:text-white rounded py-2 px-4 mx-2">About--}}
                {{--                    us</a>--}}
            </div>

            <div class="flex items-center">
                <form method="get" action="{{route('search')}}">
                    <input name="q" value="{{request()->get('q')}}"
                           class="block w-full rounded-md border-0 px-3.5 py-2 t0ext-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 font-medium"
                           placeholder="Іздеу ..."/>
                </form>
{{--                <div>{{ Auth::user() }}</div>--}}
            </div>
        </div>
    </div>
</nav>


<div class="container mx-auto py-6">

    {{ $slot }}

</div>

<footer class="w-full border-t bg-white pb-12">
    <div class="w-full container mx-auto flex flex-col items-center">
        <a href="/" class="block uppercase py-6">&copy; toi-invite.kz</a>
    </div>
</footer>
@livewireScripts
@vite('resources/admin/app.js')
</body>
</html>
