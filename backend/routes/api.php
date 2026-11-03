<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ClimateForecastController;
use App\Http\Controllers\Api\ClimateAlertController;
use App\Http\Controllers\Api\LivestockAdviceController;
use App\Http\Controllers\Api\CommunityReportController;
use App\Http\Controllers\Api\AuthController;

/*
|--------------------------------------------------------------------------
| Public Authentication Routes
|--------------------------------------------------------------------------
*/

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

/*
|--------------------------------------------------------------------------
| Climate Information Routes
|--------------------------------------------------------------------------
*/

Route::get('/forecasts', [ClimateForecastController::class, 'index']);

Route::get('/alerts', [ClimateAlertController::class, 'index']);

Route::get('/livestock-advice', [LivestockAdviceController::class, 'index']);

Route::get('/community-reports', [CommunityReportController::class, 'index']);
Route::post('/community-reports', [CommunityReportController::class, 'store']);

/*
|--------------------------------------------------------------------------
| Protected Authentication Routes
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
});
