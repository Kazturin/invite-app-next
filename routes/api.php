<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\GuestInviteController;
use App\Http\Controllers\Api\ImageController;
use App\Http\Controllers\Api\SurveyController;
use App\Http\Controllers\Api\TemplateCategoryController;
use App\Http\Controllers\Api\TemplateController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::resource('event',\App\Http\Controllers\Api\EventController::class);
    Route::post('event/{event}/delete', [\App\Http\Controllers\Api\EventController::class, 'destroy']);
    Route::get('/guests/{id}',[\App\Http\Controllers\Api\GuestController::class,'index']);
    Route::post('/guest/delete/{guest}',[\App\Http\Controllers\Api\GuestController::class,'destroy']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/invitation/{invitation}',[\App\Http\Controllers\Api\InvitationController::class,'show']);
    Route::put('/invitation/{invitation}',[\App\Http\Controllers\Api\InvitationController::class,'update']);
    Route::get('/invitation-watermark/{url}',[\App\Http\Controllers\Api\InvitationController::class,'invitationWithWatermark'])
        ->where('url', '.*');
    Route::get('/survey', [SurveyController::class, 'getLatestSurvey']);
    Route::post('/survey/answer', [SurveyController::class, 'storeAnswer']);
    Route::post('/guest/invite', [GuestInviteController::class, 'save']);
    Route::put('/guest/invite/{guestInvite}', [GuestInviteController::class, 'update']);
    Route::delete('/event-image/{eventImage}', [\App\Http\Controllers\Api\EventController::class, 'deleteImage']);
});

Route::post('/feedback',[\App\Http\Controllers\Api\FeedbackController::class,'store']);
Route::post('/guest',[\App\Http\Controllers\Api\GuestController::class,'save']);
Route::get('/event-by-slug/{event:slug}',[\App\Http\Controllers\Api\EventController::class,'showForGuest']);
Route::get('/template-categories',TemplateCategoryController::class);
Route::get('/template/{template}',TemplateController::class);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/login-google', [AuthController::class, 'googleLogin']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword'])->name('password.reset');
Route::post('/upload-image',[ImageController::class, 'upload']);

Route::get('/nominatim/search', function (Request $request) {
    // Получаем все параметры запроса от Vue (q, format, email и т.д.)
    $queryParams = $request->all();

    // Отправляем запрос к Nominatim, добавив КЛЮЧЕВОЙ заголовок User-Agent
    $response = Http::withHeaders([
        // Это ОБЯЗАТЕЛЬНО. Укажите название своего проекта и email.
        'User-Agent' => 'toi-invite/1.0 (kazturin.a@gmail.com)' 
    ])->get('https://nominatim.openstreetmap.org/search', $queryParams);

    // Возвращаем ответ от Nominatim (JSON) обратно в Vue
    return $response->json();
});
