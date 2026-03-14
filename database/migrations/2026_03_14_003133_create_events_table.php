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
        Schema::create('events', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('type')->default('wedding');
            $table->string('title');
            $table->string('slug');
            $table->text('description')->nullable();
            $table->string('hashtag')->nullable();
            $table->string('place');
            $table->dateTime('date');
            $table->string('video_link')->nullable();
            $table->string('photos_link')->nullable();
            $table->string('audio')->nullable();
            $table->smallInteger('status')->default(0);
            $table->unsignedBigInteger('created_by')->index('events_created_by_foreign');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
