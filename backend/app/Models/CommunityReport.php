<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CommunityReport extends Model
{
    protected $fillable = [
        'location',
        'report_type',
        'description',
        'reporter_name',
        'reported_at',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'reported_at' => 'date',
        ];
    }
}
