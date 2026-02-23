<?php

use App\Http\Controllers\PostController;
use App\Http\Controllers\SiteController;
use App\Models\GuestInvite;
use App\Models\Survey;
use App\Models\SurveyAnswer;
use App\Models\Template;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

//Route::middleware('auth:sanctum')->group(function () {
// Route::get('/debug-php-config', function () {
//     return response()->json([
//         'upload_max_filesize' => ini_get('upload_max_filesize'),
//         'post_max_size' => ini_get('post_max_size'),
//         'memory_limit' => ini_get('memory_limit'),
//     ]);
// });
Route::prefix('blog')->group(function () {

    Route::get('/', [PostController::class, 'home'])->name('home');
    Route::get('/search', [PostController::class, 'search'])->name('search');
    Route::get('/about-us', [SiteController::class, 'about'])->name('about-us');
    Route::get('/category/{category:slug}', [PostController::class, 'byCategory'])->name('by-category');
    Route::get('/{post:slug}', [PostController::class, 'show'])->name('view');
});
//});
Route::get('/404', function () {
    return response('Not Found', 404);
})->name('not-found');

//require __DIR__.'/auth.php';
//Route::get('/test',[\App\Http\Api\EventController::class,'store']);
