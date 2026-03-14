<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('guest_invites', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('guest_id')->index('guest_invites_guest_id_foreign');
            $table->text('invite_text');
            $table->string('invite_code')->unique();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('guest_invites');
    }
};
