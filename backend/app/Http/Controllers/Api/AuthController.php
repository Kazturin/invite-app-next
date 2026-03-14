<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Http\Resources\UserResource;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\Rules;
use Illuminate\Support\Facades\Http;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|string|unique:users,email',
            'password' => [
                'required',
                'confirmed',
                Password::min(8)->numbers()
            ]
        ]);

        /** @var \App\Models\User $user */
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => $data['password']
        ]);
        $user->assignRole('User');
        $token = $user->createToken('main')->plainTextToken;

        return response()->json([
            'user' => new UserResource($user),
            'token' => $token
        ]);
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email|string',
            'password' => [
                'required',
            ],
            'remember' => 'boolean'
        ]);
        $remember = $credentials['remember'] ?? false;
        unset($credentials['remember']);

        if (!Auth::attempt($credentials, $remember)) {
            return response()->json([
                'message' => 'email немесе құпия сөз қате'
            ], 422);
        }
        
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $token = $user->createToken('main')->plainTextToken;

        return response()->json([
            'user' => new UserResource($user),
            'token' => $token
        ]);
    }

    public function googleLogin(Request $request)
    {
        $request->validate([
            'id_token' => 'required|string',
        ]);

        $response = Http::get('https://oauth2.googleapis.com/tokeninfo', [
            'id_token' => $request->id_token,
        ]);

        if ($response->failed()) {
            return response()->json(['message' => 'Жарамсыз Google токені (Invalid Google token)'], 401);
        }

        $payload = $response->json();
        
        $clientId = config('services.google_client_id');
        
        if (!isset($payload['aud']) || $payload['aud'] !== $clientId) {
            return response()->json(['message' => 'Қате Google қосымшасы (Invalid app audience)'], 401);
        }

        $googleId = $payload['sub'];
        $email = $payload['email'];
        $name = $payload['name'] ?? 'Google User';

        $user = User::where('google_id', $googleId)
                    ->orWhere('email', $email)
                    ->first();

        if (!$user) {
            /** @var \App\Models\User $user */
            $user = User::create([
                'name' => $name,
                'email' => $email,
                'google_id' => $googleId,
                'password' => Str::random(40)
            ]);
            $user->assignRole('User');
        } elseif (!$user->google_id) {
            $user->update(['google_id' => $googleId]);
        }

        $token = $user->createToken('main')->plainTextToken;

        return response()->json([
            'user' => new UserResource($user),
            'token' => $token
        ]);
    }

    public function logout()
    {
        /** @var User $user */
        $user = Auth::user();
        $user->currentAccessToken()->delete();

        return response()->json([
            'success' => true
        ]);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'token' => ['required'],
            'email' => ['required', 'email'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $status = \Illuminate\Support\Facades\Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user) use ($request) {
                $user->password = $request->password;
                $user->setRememberToken(Str::random(60));
                $user->save();

                event(new PasswordReset($user));
            }
        );
        
        $isSuccess = $status == \Illuminate\Support\Facades\Password::PASSWORD_RESET;
        
        return response()->json([
            'status' => $isSuccess,
            'message' => __($status)
        ], $isSuccess ? 200 : 400);
    }

    public function forgotPassword(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email'],
        ]);
        
        $status = \Illuminate\Support\Facades\Password::sendResetLink(
            $request->only('email')
        );

        $isSuccess = $status == \Illuminate\Support\Facades\Password::RESET_LINK_SENT;

        return response()->json([
            'status' => $isSuccess,
            'message' => __($status)
        ], $isSuccess ? 200 : 400);
    }

    public function deleteAccount(Request $request)
    {
        /** @var User $user */
        $user = Auth::user();
        
        $hasPaidOrders = \App\Models\Event::where('created_by', $user->id)
            ->whereHas('order', function ($query) {
                $query->where('status', \App\Models\Order::STATUS_PAID);
            })->exists();

        $user->tokens()->delete();

        if ($hasPaidOrders) {
            $user->update([
                'name' => 'Өшірілген қолданушы',
                'email' => 'deleted_' . $user->id . '_' . uniqid() . '@example.com',
                'password' => Str::random(40),
                'google_id' => null,
            ]);
        } else {
            $user->delete();
        }

        return response()->json([
            'success' => true
        ]);
    }
}

