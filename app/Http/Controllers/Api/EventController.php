<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\EventRequest;
use App\Http\Resources\EventResource;
use App\Http\Resources\GuestInviteResource;
use App\Models\Event;
use App\Models\GuestInvite;
use App\Models\Order;
use App\Services\EventService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class EventController extends Controller
{
    protected $eventService;

    public function __construct(EventService $eventService)
    {
        $this->eventService = $eventService;
        // Authorization is handled via policies, but we can also use authorizeResource if we want standard mapping.
        // For now, I will use explicit authorize calls in methods as per the plan to keep it clear.
    }

    public function index(Request $request)
    {
        $user = $request->user();

        return EventResource::collection(Event::where('created_by', $user->id)
            ->where('status', '!=', Event::STATUS_DELETED)
            ->get());
    }

    public function show(Request $request, Event $event)
    {
        Log::info('show event '.$event->id);
        $this->authorize('view', $event);
        return new EventResource($event);
    }

    public function edit(Request $request, Event $event)
    {
        Log::info('edit event '.$event->id);
        $this->authorize('update', $event);
        return new EventResource($event);
    }

    public function store(EventRequest $request)
    {
        try {
            $data = $request->validated();
            if ($request->hasFile('audioFile')) {
                $data['audioFile'] = $request->file('audioFile');
            }
            if ($request->hasFile('gallery')) {
                $data['gallery'] = $request->file('gallery');
            }
            $event = $this->eventService->createEvent($data);
            return new EventResource($event);
        } catch (ValidationException $exception) {
            return response()->json(['message' => 'Бірінші қадам сақталмады, қайтадан бірінші қадамға өтіңіз'], 422);
        } catch (\Exception $e) {
            Log::info('test');
            Log::error($e->getMessage() . ' ' . $e->getLine() . ' ' . $e->getFile());
            return response()->json(['message' => 'Қате орын алды. Кейін қайталап көріңіз'], 500);
        }
    }

    public function update(EventRequest $request, Event $event)
    {
        Log::info('update event '.$event->id);
        $this->authorize('update', $event);

        $data = $request->validated();
        if ($request->hasFile('audioFile')) {
            $data['audioFile'] = $request->file('audioFile');
        }
        if ($request->hasFile('gallery')) {
            $data['gallery'] = $request->file('gallery');
        }

        $event = $this->eventService->updateEvent($event, $data);

        return new EventResource($event);
    }

    public function showForGuest(Event $event)
    {
        Log::info('showForGuest event '.$event->id);
        // if ($event->order->status === Order::STATUS_NOT_PAID) {
        //     return response("", 404);
        // }
        $inviteCode = request()->query('invite_code');
        $guestInvite = null;
        if ($inviteCode) {
            $guestInvite = GuestInvite::where('invite_code', $inviteCode)->with('guest')
                ->whereHas('guest', function ($query) use ($event) {
                    $query->where('event_id', $event->id);
                })->first();
        }

        // $event = Cache::remember('event' . $event->id, 120, function () use ($event) {
        //     return new EventResource($event);
        // });
        return response()->json([
            'event' => new EventResource($event),
            'guestInvite' => $guestInvite ? new GuestInviteResource($guestInvite) : null,
        ]);
    }

    public function destroy(Request $request, Event $event)
    {
        $this->authorize('delete', $event);

        $this->eventService->deleteEvent($event);

        return response('', 204);
    }

    public function deleteImage(\App\Models\EventImage $eventImage)
    {
        $this->authorize('update', $eventImage->event);
        
        if(\Illuminate\Support\Facades\Storage::disk('public')->exists($eventImage->path)){
            \Illuminate\Support\Facades\Storage::disk('public')->delete($eventImage->path);
        }
        $eventImage->delete();

        return response('', 204);
    }
}