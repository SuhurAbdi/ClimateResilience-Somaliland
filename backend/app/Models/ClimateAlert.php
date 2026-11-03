<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ClimateAlert extends Model
{
    protected $fillable = [
        'location',
        'alert_type',
        'severity',
        'title_en',
        'message_en',
        'title_so',
        'message_so',
        'valid_from',
        'valid_until',
        'source',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'valid_from' => 'date',
            'valid_until' => 'date',
            'is_active' => 'boolean',
        ];
    }
}
