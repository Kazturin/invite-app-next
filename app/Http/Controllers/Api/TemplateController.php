<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\TemplateResource;
use App\Models\Template;
use Illuminate\Http\Request;

class TemplateController extends Controller
{
    public function __invoke(Template $template)
    {
        return new TemplateResource($template);
    }   
}
