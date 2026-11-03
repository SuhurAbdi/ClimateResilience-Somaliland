<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('climate_alerts', function (Blueprint $table) {
            $table->id();
            $table->string('location');
            $table->string('alert_type');
            $table->string('severity')->default('moderate');
            $table->string('title_en');
            $table->text('message_en');
            $table->string('title_so');
            $table->text('message_so');
            $table->date('valid_from');
            $table->date('valid_until')->nullable();
            $table->string('source')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('climate_alerts');
    }
};
