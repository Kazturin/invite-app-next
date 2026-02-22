<?php

namespace App\Filament\Widgets;

use App\Models\Event;
use App\Models\Order;
use App\Models\User;
use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class StatsOverview extends StatsOverviewWidget
{
    protected function getStats(): array
    {
        return [
            Stat::make('Қолданушылар саны', User::role('User')->count()),
            Stat::make('Енгізілген шақыртулар', Event::where('status','!=',Event::STATUS_DELETED)->count()),
            Stat::make('Кіріс', strval(Order::where('status','=',1)->sum('price')).' Т'),
        ];
    }
}
