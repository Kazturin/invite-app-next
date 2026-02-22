<table class="w-full text-sm">
    <thead>
        <tr>
            <th class="text-left p-2">Жауап нұсқасы</th>
            <th class="text-left p-2">Саны</th>
        </tr>
    </thead>
    <tbody>
        @foreach ($getRecord()->answers()
            ->selectRaw('answer, COUNT(*) as count')
            ->groupBy('answer')
            ->pluck('count', 'answer') as $answer => $count)
            <tr>
                <td class="p-2">{{ $answer }}</td>
                <td class="p-2 font-bold">{{ $count }}</td>
            </tr>
        @endforeach
    </tbody>
</table>
