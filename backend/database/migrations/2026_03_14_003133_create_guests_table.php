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
        Schema::create('guests', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('fullname');
            $table->string('relative', 50);
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->unsignedBigInteger('event_id')->index('guests_event_id_foreign');
            $table->smallInteger('status')->default(0);
            $table->boolean('personally_invited')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('guests');
    }
};
