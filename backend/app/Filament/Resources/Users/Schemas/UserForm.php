<?php

namespace App\Filament\Resources\Users\Schemas;

use Filament\Forms\Components\CheckboxList;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\TextInput;
use Filament\Pages\Page;
use Filament\Resources\Pages\CreateRecord;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Illuminate\Support\Facades\Hash;

class UserForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make()
                ->schema([
                    TextInput::make('name')
                    ->required(),
                TextInput::make('email')
                    ->label('Email address')
                    ->email()
                    ->required(),
                TextInput::make('password')
                    ->label(__('Password'))
                    ->password()
                    ->required(fn(Page $livewire): bool => $livewire instanceof CreateRecord)
                    ->minLength('8')
                    ->dehydrateStateUsing(fn($state)=>Hash::make($state)),
                CheckboxList::make('roles')
                    ->label(__('Roles'))
                    ->columns(3)
                    ->relationship('roles','name'),
                ])->columnSpanFull(),
            ]);
    }
}
