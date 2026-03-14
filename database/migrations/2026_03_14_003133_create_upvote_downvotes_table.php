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
        Schema::create('upvote_downvotes', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->boolean('is_upvote');
            $table->unsignedBigInteger('post_id')->index('upvote_downvotes_post_id_foreign');
            $table->unsignedBigInteger('user_id')->index('upvote_downvotes_user_id_foreign');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('upvote_downvotes');
    }
};
