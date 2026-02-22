<?php

namespace App\Filament\Resources\Events;

use App\Filament\Resources\Events\Pages\ManageEvents;
use App\Models\Event;
use App\Models\Order;
use BackedEnum;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Resources\Resource;
use Filament\Schemas\Components\Fieldset;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class EventResource extends Resource
{
    protected static ?string $model = Event::class;
    protected static ?string $navigationLabel = 'Шақыртулар';

    protected static ?string $modelLabel = 'Шақырту';

    protected static ?string $pluralModelLabel = 'Шақыртулар';

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Fieldset::make('Order')
                    ->relationship('order')
                    ->schema([
                        Select::make('status')
                            ->label('Статус')
                            ->options([
                                0 => 'Төленбеген',
                                1 => 'Төленген',
                                2 => 'Тегін',
                            ]),    
                    ]),
                Select::make('created_by')
                        ->relationship('user','name')
                        ->searchable()
                        ->label('Қолданушы')    
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('id')
                     ->searchable(),
                TextColumn::make('user.name'),
                TextColumn::make('title')
                    ->searchable(),
                TextColumn::make('slug')->url(fn($record)=>"/toi/$record->slug")->openUrlInNewTab(),
                TextColumn::make('date')
                    ->date(),
                TextColumn::make('guests_count')
                    ->counts('guests')
                    ->label('Қонақтар жауабы')
                    ->sortable(),
                TextColumn::make('order.status')
    ->label('Статус оплаты')
    ->formatStateUsing(fn ($state, $record) => $record->order?->statusLabel() ?? '—'),
                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                SelectFilter::make('order_status')
        ->label('Статус оплаты')
        ->options([
            Order::STATUS_NOT_PAID => 'Төлем жасалмаған',
            Order::STATUS_PAID => 'Төлем жасалған',
            Order::STATUS_FREE => 'Тегін',
        ])
        ->query(function (Builder $query, array $data) {
            if($data['value'])
            {
                $query->whereHas('order', function ($q) use ($data) {
                $q->where('status', $data['value']);
            });
            }
            
        }),
            ])
            ->recordActions([
                EditAction::make(),
                DeleteAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => ManageEvents::route('/'),
        ];
    }
}
