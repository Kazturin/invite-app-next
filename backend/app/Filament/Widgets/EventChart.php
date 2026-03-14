<?php

namespace App\Filament\Widgets;

use App\Models\Event;
use Filament\Widgets\ChartWidget;
use Illuminate\Support\Facades\DB;

class EventChart extends ChartWidget
{
    protected ?string $heading = 'Chart';

    protected ?string $pollingInterval = null;
    protected ?string $maxHeight = '300px';
    protected int|string|array $columnSpan = [
        'sm' => 1,
        'md' => 6,
        'lg' => 3
    ];

    public function getHeading(): string
    {
        return __('Енгізілгген тойлардың статусы');
    }

    protected function getData(): array
    {
        $query = DB::table('orders')
            ->select( DB::raw('(CASE
                        WHEN orders.status = "0" THEN "Төленбеген"
                        WHEN orders.status = "1" THEN "Төленген"
                        WHEN orders.status = "2" THEN "Тегін"
                        END) AS order_status'), DB::raw('count(*) as count'))
            ->join('events', 'events.id', '=', 'orders.event_id')
            ->where('events.status','!=',Event::STATUS_DELETED)
            ->groupBy('order_status')
            ->get();

        return [
            'datasets' => [
                [
                    'label' => 'Саны',
                    'data' => $query->pluck('count'),
                    'backgroundColor' => [
                        'rgba(54, 162, 235, .6)',
                    ],
                    'borderColor' => [
                        'rgba(54, 162, 235, .8)'
                    ],
                ],
            ],
            'labels' => $query->pluck('order_status'),
        ];
    }

    protected function getType(): string
    {
        return 'bar';
    }
}
