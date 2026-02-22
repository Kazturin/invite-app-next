<?php


namespace App\Http\Controllers\Api;


use App\Http\Controllers\Controller;
use App\Http\Requests\GuestRequest;
use App\Http\Resources\GuestResource;
use App\Models\Guest;
use App\Models\GuestChild;
use http\Env\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class GuestController extends Controller
{
    public function index($id){

        $guests = Guest::where('event_id',$id)->get();

        return GuestResource::collection($guests);
    }

    public function save(GuestRequest $request){

        $data = $request->validated();

    //     if ($data->fails()) {
    //     return response()->json(['message' => $data->errors()->first()], 422);
    // }

        if(isset($data['id'])){
           $guest = Guest::findOrFail($data['id']);
           $guest->update($data);
        }
        else{
            $guest = Guest::create($data);
        }

        $guest->child()->delete();

        if (count($data['child'])>0){
            foreach ($data['child'] as $child) {
                $child['guest_id'] = $guest->id;
                $this->createChild($child);
            }
        }
        return response("", 201);
    }

    public function destroy(Guest $guest){

        $guest->delete();

        return response('', 204);
    }

    private function createChild($data)
    {
        $validator = Validator::make($data, [
            'fullname' => 'required|string',
            'guest_id' => 'exists:App\Models\Guest,id'
        ]);

        return GuestChild::create($validator->validated());
    }
}
