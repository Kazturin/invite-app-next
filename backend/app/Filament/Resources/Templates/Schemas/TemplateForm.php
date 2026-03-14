<?php

namespace App\Filament\Resources\Templates\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;
use Filament\Forms;
use Filament\Schemas\Components\Section;

class TemplateForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make()
                ->schema([
                    Forms\Components\Select::make('category_id')
                    ->relationship('category', 'title_kk')
                    ->required(),
                Forms\Components\Toggle::make('active')
                    ->required()
                    ->default(true),
                Forms\Components\FileUpload::make('bg_img')
                    ->image()
                    ->directory('images/templates')
                    ->visibility('public'),
                Forms\Components\FileUpload::make('envelope_img')
                    ->required()
                    ->image()
                    ->disk('public')
                    ->directory('images/templates')
                    ->visibility('public'),
                Forms\Components\FileUpload::make('preview_img')
                    ->required()
                    ->image()
                    ->disk('public')
                    ->directory('images/templates')
                    ->visibility('public'),
                Forms\Components\FileUpload::make('without_text')
                    ->required()
                    ->image()
                    ->disk('public')
                    ->directory('images/templates')
                    ->visibility('public'),
                Forms\Components\TextInput::make('price')
                    ->required()
                    ->numeric()
                    ->prefix('$'),
                Forms\Components\Textarea::make('content')
                    ->label('Template JSON')
                    ->required()
                    ->rows(10)
                    ->formatStateUsing(fn ($state) => json_encode($state, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE))
                    // Преобразуем строку обратно в массив при сохранении
                    ->dehydrateStateUsing(fn ($state) => json_decode($state, true))
                    ->columnSpanFull(), 
                ])->columnSpanFull()
            ]);
    }
}
