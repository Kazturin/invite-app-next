<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\TemplateCategoryResource;
use App\Models\TemplateCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class TemplateCategoryController extends Controller
{
    public function __invoke()
    {
        return Cache::remember('template_categories', now()->addDay(), function () {
            return TemplateCategoryResource::collection(TemplateCategory::all());
        });
    }
}
