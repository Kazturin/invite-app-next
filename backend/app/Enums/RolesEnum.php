<?php
namespace App\Enums;

enum RolesEnum: string
{
    case ADMIN = 'Admin';
    case MANAGER = 'Manager';
    case USER = 'User';

    public function getLabel(): string
    {
        return match ($this) {
            self::ADMIN => 'Админ',
            self::MANAGER => 'Менеджер',
            self::USER => 'Пользователь',
        };
    }
}