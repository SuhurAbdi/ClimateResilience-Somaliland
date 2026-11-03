<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('climate_forecasts', function (Blueprint $table) {
            $table->id();
            $table->string('location');
            $table->date('forecast_date');
            $table->decimal('rainfall_mm', 8, 2)->nullable();
            $table->decimal('temperature_c', 5, 2)->nullable();
            $table->string('conditions')->nullable();
            $table->string('source')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('climate_forecasts');
    }
};
