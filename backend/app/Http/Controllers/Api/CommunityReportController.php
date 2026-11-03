<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CommunityReport;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CommunityReportController extends Controller
{
    public function index(): JsonResponse
    {
        $reports = CommunityReport::query()
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'data' => $reports,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'location' => ['required', 'string', 'max:255'],
            'report_type' => [
                'required',
                'in:drought,flood,water_shortage,heavy_rain,other',
            ],
            'description' => ['required', 'string', 'max:3000'],
            'reporter_name' => ['nullable', 'string', 'max:255'],
            'reported_at' => ['required', 'date', 'before_or_equal:today'],
        ]);

        $report = CommunityReport::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Community report submitted successfully.',
            'data' => $report,
        ], 201);
    }
}
