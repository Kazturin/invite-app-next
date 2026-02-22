<?php


namespace App\Http\Controllers\Api;


use App\Http\Controllers\Controller;
use App\Http\Requests\GuestRequest;
use App\Http\Resources\GuestResource;
use App\Models\Guest;
use App\Models\GuestChild;
use App\Models\GuestInvite;
use http\Env\Response;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Http\Request;

class GuestInviteController extends Controller
{
    // public function index($id){

    //     $guests = Guest::where('event_id',$id)->get();

    //     return GuestResource::collection($guests);
    // }

    public function save(Request $request)
{
    $validator = Validator::make($request->all(), [
        'guest_id' => 'required|exists:guests,id',
        'invite_text' => 'required|string',
        'invite_code' => 'required|string',
    ]);

    if ($validator->fails()) {
        return response()->json(['message' => $validator->errors()->first()], 422);
    }

    $data = $request->only(['guest_id', 'invite_text', 'invite_code']);
    $guestInvite = GuestInvite::where('guest_id', $data['guest_id'])->first();

    if ($guestInvite) {
        $guestInvite->update($data);
    } else {
        $guestInvite = GuestInvite::create($data);
    }

    return response()->json(['message' => 'Invite saved successfully', 'data' => $guestInvite], 200);
}

    public function store(Request $request){

        $data = $request->validate([
            'guest_id' => 'required|exists:guests,id',
            'invite_text' => 'required|string',
            'invite_code' => 'required|string',
        ]);

        GuestInvite::create($data);

        return response("", 200);
    }

    public function update(Request $request, GuestInvite $guestInvite){

        $data = $request->validate([
            'guest_id' => 'required|exists:guests,id',
            'invite_text' => 'required|string',
            'invite_code' => 'required|string',
        ]);

        $guestInvite->update($data);

        return response("", 200);
    }

    // public function destroy(Guest $guest){

    //     $guest->delete();

    //     return response('', 204);
    // }

}
