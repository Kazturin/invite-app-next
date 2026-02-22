<!DOCTYPE html>
<html lang="{{$lang}}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>Тойға шақыру</title>
    <meta name="description" content="{{$title}}">

    <meta property="og:title" content="Тойға шақыру">
    <meta property="og:type" content="website" />
    <meta property="og:description" content="{{$title}}">
    <meta property="og:url" content="{{ url()->current() }}" />
    <meta property="og:image" content="{{ asset('storage/images/invitations/620x640/'.basename($image)) }}">

    <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon">
</head>
<body>
<div id="app">
</div>
@vite('resources/js/app.js')
</body>
</html>
