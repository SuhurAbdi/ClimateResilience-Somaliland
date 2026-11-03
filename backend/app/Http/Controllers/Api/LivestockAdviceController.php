<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LivestockAdvice;
use Illuminate\Http\JsonResponse;

class LivestockAdviceController extends Controller
{
    public function index(): JsonResponse
    {
        $advice = LivestockAdvice::query()
            ->where('is_active', true)
            ->orderBy('climate_risk')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $advice,
        ]);
    }
}
