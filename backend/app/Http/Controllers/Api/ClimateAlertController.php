<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ClimateAlert;
use Illuminate\Http\JsonResponse;

class ClimateAlertController extends Controller
{
    public function index(): JsonResponse
    {
        $alerts = ClimateAlert::query()
            ->where('location', 'Gabiley')
            ->where('is_active', true)
            ->whereDate('valid_from', '<=', now()->toDateString())
            ->where(function ($query) {
                $query->whereNull('valid_until')
                    ->orWhereDate(
                        'valid_until',
                        '>=',
                        now()->toDateString()
                    );
            })
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'location' => 'Gabiley, Somaliland',
            'data' => $alerts,
        ]);
    }
}
