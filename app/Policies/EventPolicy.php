<?php

namespace App\Policies;

use App\Enums\RolesEnum;
use App\Models\Event;
use App\Models\Order;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class EventPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user)
    {
        return $user->hasAnyRole([RolesEnum::ADMIN->value, RolesEnum::MANAGER->value]);
    }

    /**
     * Determine whether the user can view the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Event  $event
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function view(User $user, Event $event)
    {
        if($user->hasAnyRole([RolesEnum::ADMIN->value, RolesEnum::MANAGER->value])) {
            return true;
        }
        
        return $user->id === $event->created_by;
    }

    /**
     * Determine whether the user can update the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Event  $event
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function update(User $user, Event $event)
    {
        if($user->hasAnyRole([RolesEnum::ADMIN->value, RolesEnum::MANAGER->value])) {
            return true;
        }
        
        return $user->id === $event->created_by;
    }

    /**
     * Determine whether the user can delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Event  $event
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function delete(User $user, Event $event)
    {
        if($user->hasAnyRole([RolesEnum::ADMIN->value, RolesEnum::MANAGER->value])) {
            return true;
        }
        
        return $user->id === $event->created_by;
    }
}
