<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ClimateForecast extends Model
{
    protected $fillable = [
        'location',
        'forecast_date',
        'rainfall_mm',
        'temperature_c',
        'conditions',
        'source',
    ];

    protected function casts(): array
    {
        return [
            'forecast_date' => 'date',
            'rainfall_mm' => 'decimal:2',
            'temperature_c' => 'decimal:2',
        ];
    }
}
