<?php

use App\Http\Controllers\PostController;
use App\Http\Controllers\SiteController;
use App\Models\GuestInvite;
use App\Models\Survey;
use App\Models\SurveyAnswer;
use App\Models\Template;
use Illuminate\Support\Facades\Route;

Route::get('/404', function () {
    return response('Not Found', 404);
})->name('not-found');

