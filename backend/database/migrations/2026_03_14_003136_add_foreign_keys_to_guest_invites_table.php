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
        Schema::table('guest_invites', function (Blueprint $table) {
            $table->foreign(['guest_id'])->references(['id'])->on('guests')->onUpdate('no action')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('guest_invites', function (Blueprint $table) {
            $table->dropForeign('guest_invites_guest_id_foreign');
        });
    }
};
