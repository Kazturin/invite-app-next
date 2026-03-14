<?php

namespace App\Filament\Resources\TemplateCategories;

use App\Filament\Resources\TemplateCategories\Pages\ManageTemplateCategories;
use App\Models\TemplateCategory;
use BackedEnum;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\TextInput;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class TemplateCategoryResource extends Resource
{
    protected static ?string $model = TemplateCategory::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;
    
    protected static ?string $navigationLabel = 'Шаблон категориялары';

    protected static ?string $modelLabel = 'Шаблон категориясы';

    protected static ?string $pluralModelLabel = 'Шаблон категориялары';

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('title_kk')
                    ->required(),
                TextInput::make('title_ru')
                    ->required(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('title_kk')
                    ->searchable(),
                TextColumn::make('title_ru')
                    ->searchable(),
            ])
            ->filters([
                //
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
            'index' => ManageTemplateCategories::route('/'),
        ];
    }
}
