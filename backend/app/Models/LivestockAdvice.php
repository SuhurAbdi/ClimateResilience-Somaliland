<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LivestockAdvice extends Model
{
    protected $table = 'livestock_advices';
    protected $fillable = [
        'climate_risk',
        'title_en',
        'advice_en',
        'title_so',
        'advice_so',
        'source',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }
}
