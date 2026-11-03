<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('livestock_advices', function (Blueprint $table) {
            $table->id();
            $table->string('climate_risk');
            $table->string('title_en');
            $table->text('advice_en');
            $table->string('title_so');
            $table->text('advice_so');
            $table->string('source')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('livestock_advices');
    }
};
