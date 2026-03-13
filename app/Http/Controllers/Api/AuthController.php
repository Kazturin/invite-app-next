<?php

namespace App\Http\Controllers\Api;


use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\Rules;

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
            'password' => bcrypt($data['password'])
        ]);
        $user->assignRole('User');
        $token = $user->createToken('main')->plainTextToken;

        return response([
            'user' => $user,
            'token' => $token
        ]);
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email|string|exists:users,email',
            'password' => [
                'required',
            ],
            'remember' => 'boolean'
        ]);
        $remember = $credentials['remember'] ?? false;
        unset($credentials['remember']);

        if (!Auth::attempt($credentials, $remember)) {
            return response([
                'message' => 'email немесе құпия сөз қате'
            ], 422);
        }
        $user = Auth::user();
        $token = $user->createToken('main')->plainTextToken;

        return response([
            'user' => $user,
            'token' => $token
        ]);
    }

    public function googleLogin(Request $request){

        if ($request->sub){
            $user = User::where('google_id', $request->sub)->first();
            if (!$user){
                $data = $request->validate([
                    'name' => 'required|string',
                    'email' => 'required|email|string|unique:users,email',
                ]);
                $user = User::create([
                    'name' => $data['name'],
                    'email' => $data['email'],
                    'google_id' => $request->sub,
                    'password' => bcrypt(request(Str::random()))
                ]);
                $user->assignRole('User');

            }

            $token = $user->createToken('main')->plainTextToken;

            return response([
                'user' => $user,
                'token' => $token
            ]);
        }

        return response([
            'error' => 'email немесе құпия сөз қате'
        ], 422);
    }

    public function logout()
    {
        /** @var User $user */
        $user = Auth::user();
        $user->currentAccessToken()->delete();

        return response([
            'success' => true
        ]);
    }

    public function resetPassword(Request $request){
        $request->validate([
            'token' => ['required'],
            'email' => ['required', 'email'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $status = \Illuminate\Support\Facades\Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user) use ($request) {
                $user->forceFill([
                    'password' => Hash::make($request->password),
                    'remember_token' => Str::random(60),
                ])->save();

                event(new PasswordReset($user));
            }
        );
        return $status == \Illuminate\Support\Facades\Password::PASSWORD_RESET
            ? ['status'=>true,'message' => __($status)]
            : ['status'=>false,'message' => __($status)];
    }

    public function forgotPassword(Request $request){
        $request->validate([
            'email' => ['required', 'email'],
        ]);
        $status = \Illuminate\Support\Facades\Password::sendResetLink(
            $request->only('email')
        );

        return $status == \Illuminate\Support\Facades\Password::RESET_LINK_SENT
            ?  response(['status'=>true,'message' => __($status)],200)
            : ['status'=>false,'message' => __($status)];
    }

    public function deleteAccount(Request $request)
    {
        /** @var User $user */
        $user = Auth::user();
        $user->tokens()->delete();
        $user->delete();

        return response([
            'success' => true
        ]);
    }
}
