<?php

namespace Tests\Feature\Api;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Event;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Support\Str;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class AuthControllerTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Ensure the User role exists for registration and Google login tests
        if (class_exists(Role::class)) {
            Role::firstOrCreate(['name' => 'User', 'guard_name' => 'web']);
        }
    }

    public function test_user_can_register()
    {
        $password = 'Password123!';
        
        $response = $this->postJson('/api/register', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => $password,
            'password_confirmation' => $password,
        ]);

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'user' => ['id', 'name', 'email'],
                     'token'
                 ]);

        $this->assertDatabaseHas('users', [
            'email' => 'test@example.com',
        ]);
        
        $user = User::where('email', 'test@example.com')->first();
        if (class_exists(Role::class)) {
            $this->assertTrue($user->hasRole('User'));
        }
    }

    public function test_register_validation_fails()
    {
        $response = $this->postJson('/api/register', [
            'name' => '',
            'email' => 'not-an-email',
            'password' => 'short',
            'password_confirmation' => 'different',
        ]);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['name', 'email', 'password']);
    }

    public function test_user_can_login()
    {
        $password = 'Password123!';
        $user = User::factory()->create([
            'password' => Hash::make($password),
        ]);

        $response = $this->postJson('/api/login', [
            'email' => $user->email,
            'password' => $password,
        ]);

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'user' => ['id', 'name', 'email'],
                     'token'
                 ]);
    }

    public function test_login_fails_with_invalid_credentials()
    {
        $user = User::factory()->create([
            'password' => Hash::make('Password123!'),
        ]);

        $response = $this->postJson('/api/login', [
            'email' => $user->email,
            'password' => 'WrongPassword',
        ]);

        $response->assertStatus(422)
                 ->assertJsonFragment([
                     'message' => 'email немесе құпия сөз қате'
                 ]);
    }

    public function test_user_can_logout()
    {
        $user = User::factory()->create();
        $token = $user->createToken('main')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson('/api/logout');

        $response->assertStatus(200)
                 ->assertJson(['success' => true]);

        $this->assertDatabaseMissing('personal_access_tokens', [
            'tokenable_id' => $user->id,
        ]);
    }

    public function test_google_login_success()
    {
        config(['services.google_client_id' => 'test-client-id']);

        Http::fake([
            'https://oauth2.googleapis.com/tokeninfo*' => Http::response([
                'aud' => 'test-client-id',
                'sub' => '1234567890',
                'email' => 'google@example.com',
                'name' => 'Google User Name',
            ], 200)
        ]);

        $response = $this->postJson('/api/login-google', [
            'id_token' => 'valid-token',
        ]);

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'user' => ['id', 'name', 'email'],
                     'token'
                 ]);

        $this->assertDatabaseHas('users', [
            'email' => 'google@example.com',
            'google_id' => '1234567890',
            'name' => 'Google User Name',
        ]);
    }

    public function test_google_login_fails_with_invalid_token()
    {
        Http::fake([
            'https://oauth2.googleapis.com/tokeninfo*' => Http::response([], 400)
        ]);

        $response = $this->postJson('/api/login-google', [
            'id_token' => 'invalid-token',
        ]);

        $response->assertStatus(401)
                 ->assertJson(['message' => 'Жарамсыз Google токені (Invalid Google token)']);
    }

    public function test_google_login_fails_with_invalid_audience()
    {
        config(['services.google_client_id' => 'correct-client-id']);

        Http::fake([
            'https://oauth2.googleapis.com/tokeninfo*' => Http::response([
                'aud' => 'wrong-client-id',
                'sub' => '12345',
                'email' => 'test@test.com',
            ], 200)
        ]);

        $response = $this->postJson('/api/login-google', [
            'id_token' => 'valid-token',
        ]);

        $response->assertStatus(401)
                 ->assertJson(['message' => 'Қате Google қосымшасы (Invalid app audience)']);
    }

    public function test_forgot_password_sends_email()
    {
        $user = User::factory()->create();

        $response = $this->postJson('/api/forgot-password', [
            'email' => $user->email,
        ]);

        $response->assertStatus(200)
                 ->assertJson(['status' => true]);
    }

    public function test_reset_password_success()
    {
        Event::fake([PasswordReset::class]);
        $user = User::factory()->create();
        $token = Password::createToken($user);
        $newPassword = 'NewPassword123!';

        $response = $this->postJson('/api/reset-password', [
            'token' => $token,
            'email' => $user->email,
            'password' => $newPassword,
            'password_confirmation' => $newPassword,
        ]);

        $response->assertStatus(200)
                 ->assertJson(['status' => true]);

        Event::assertDispatched(PasswordReset::class, function ($event) use ($user) {
            return $event->user->id === $user->id;
        });

        $this->assertTrue(Hash::check($newPassword, $user->fresh()->password));
    }

    public function test_delete_account()
    {
        $user = User::factory()->create();
        $token = $user->createToken('main')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->deleteJson('/api/user');

        $response->assertStatus(200)
                 ->assertJson(['success' => true]);

        $this->assertDatabaseMissing('users', [
            'id' => $user->id,
        ]);
    }

    public function test_delete_account_with_paid_orders_anonymizes_user()
    {
        // For this test, if Event and Order models exist, we mock or create them
        // Check if Event / Order models exist
        if (!class_exists(\App\Models\Event::class) || !class_exists(\App\Models\Order::class)) {
            $this->markTestSkipped('Event or Order models do not exist.');
            return;
        }

        $user = User::factory()->create([
            'name' => 'Real Name',
            'email' => 'real@example.com',
            'google_id' => '12345',
        ]);
        
        $event = \App\Models\Event::create([
            'title' => 'Test Event',
            'created_by' => $user->id,
            'type' => 1, // sample type
            'place' => 'Astana',
            'date' => now(),
        ]);

        \App\Models\Order::create([
            'event_id' => $event->id,
            'status' => \App\Models\Order::STATUS_PAID,
            'price' => 1000,
        ]);

        $token = $user->createToken('main')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->deleteJson('/api/user');

        $response->assertStatus(200)
                 ->assertJson(['success' => true]);

        // User should not be deleted
        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'name' => 'Өшірілген қолданушы',
            'google_id' => null,
        ]);

        $anonymizedUser = $user->fresh();
        $this->assertStringStartsWith('deleted_' . $user->id, $anonymizedUser->email);
        $this->assertNotEquals('real@example.com', $anonymizedUser->email);
    }
}
