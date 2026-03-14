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
        Schema::create('post_views', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('ip_address', 55);
            $table->string('user_agent', 510);
            $table->unsignedBigInteger('post_id')->index('post_views_post_id_foreign');
            $table->unsignedBigInteger('user_id')->nullable()->index('post_views_user_id_foreign');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('post_views');
    }
};
