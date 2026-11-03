<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ClimateForecast;
use Illuminate\Http\JsonResponse;

class ClimateForecastController extends Controller
{
    public function index(): JsonResponse
    {
        $forecasts = ClimateForecast::query()
            ->where('location', 'Gabiley')
            ->orderBy('forecast_date')
            ->get();

        return response()->json([
            'success' => true,
            'location' => 'Gabiley, Somaliland',
            'data' => $forecasts,
        ]);
    }
}