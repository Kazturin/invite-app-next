<?php


namespace App\Http\Controllers\Api;


use App\Http\Controllers\Controller;
use App\Http\Requests\FeedbackRequest;
use App\Mail\FeedbackMail;
use App\Models\Feedback;

use Illuminate\Support\Facades\Mail;

class FeedbackController extends Controller
{
    public function store(FeedbackRequest $request){

        $data = $request->validated();

        $feedback = Feedback::create($data);

        Mail::to('admin@toi-invite.kz')->send(new FeedbackMail($feedback));

        return response('', 204);

    }
}
