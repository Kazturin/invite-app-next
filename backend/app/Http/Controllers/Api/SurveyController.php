<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Survey;
use App\Models\SurveyAnswer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class SurveyController extends Controller
{
    public function getLatestSurvey()
    {

        $survey = Survey::select(['id', 'question', 'options'])
        ->latest()
        ->first();

    if (!$survey) {
        return response()->json(['message' => 'Опрос не найден'], 404);
    }

    $answers = SurveyAnswer::where('survey_id', $survey->id)
        ->select('answer', 'user_id')
        ->get();
    $answersStats = $answers->groupBy('answer')
        ->map(function ($group) {
            return $group->count();
        })
        ->toArray();

    $userId = auth()->id();
    $userHasAnswered = $answers->contains('user_id', $userId);

    $stats = collect($survey->options)->mapWithKeys(function ($option) use ($answersStats) {
        return [$option['option'] => $answersStats[$option['option']] ?? 0];
    });

    return response()->json([
        'survey' => [
            'id' => $survey->id,
            'question' => $survey->question,
            'options' => $survey->options
        ],
        'stats' => $stats,
        'userHasAnswered' => $userHasAnswered
    ]);
    }

    public function storeAnswer(Request $request)
    {
        $validated = $request->validate([
            'survey_id' => 'required|exists:surveys,id',
            'answer' => 'required|string',
        ]);
    
        $user = auth()->user();
    
        if (SurveyAnswer::where('survey_id', $validated['survey_id'])->where('user_id', $user->id)->exists()) {
            return response()->json(['message' => 'Вы уже голосовали в этом опросе.'], 403);
        }
    
        SurveyAnswer::create([
            'survey_id' => $validated['survey_id'],
            'user_id' => $user->id,
            'answer' => $validated['answer']
        ]);
    
        return response()->json(['message' => 'Спасибо за ваш ответ!']);
    }
}
