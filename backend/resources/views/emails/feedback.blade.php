<x-mail::message>
# Кері байланыс
<br>
 Аты-жөні: {{ $feedback->name }} <br>
 email: {{ $feedback->email }} <br>
 Хабарлама: {{ $feedback->message }} <br>
<hr>
Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
