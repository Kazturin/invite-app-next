<?php

namespace App\Filament\Resources\Posts\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class PostForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make()
                    ->schema([
                        TextInput::make('title')
                            ->required()
                            ->maxLength(2048),
                        RichEditor::make('body')
                            ->required(),
                        TextInput::make('meta_title')
                            ->maxLength(255),
                        Textarea::make('meta_description')
                            ->maxLength(255),
                        Toggle::make('active')
                            ->required(),
                        DateTimePicker::make('published_at'),
                    ])->columnSpan(8),

                Section::make()
                    ->schema([
                        FileUpload::make('thumbnail'),
                        Select::make('categories')
                            ->multiple()
                            ->relationship('categories', 'title')
                            ->preload(),
                    ])->columnSpan(4)
            ])->columns(12);
    }
}
