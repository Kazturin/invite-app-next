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
        Schema::create('guest_children', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('fullname');
            $table->unsignedBigInteger('guest_id')->index('guest_children_guest_id_foreign');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('guest_children');
    }
};
