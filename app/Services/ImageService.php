<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\ImageManager;
use Intervention\Image\Typography\FontFactory;

class ImageService
{
    protected $manager;

    public function __construct()
    {
        $this->manager = new ImageManager(new Driver());
    }

    /**
     * Save image and create composite preview.
     *
     * @param string $image Base64 string
     * @param string $envelope_img Path to envelope image (relative to public path or absolute)
     * @return string Relative path to saved original file
     * @throws \Exception
     */
    public function saveImage($image, $envelope_img)
    {
        Log::info('image save');
        if (preg_match('/^data:image\/(\w+);base64,/', $image, $type)) {
            $imageData = substr($image, strpos($image, ',') + 1);
            $type = strtolower($type[1]);

            Log::info($type);

            if (!in_array($type, ['jpg', 'jpeg', 'png', 'gif'])) {
                throw new \Exception('invalid image type');
            }
            $imageData = str_replace(' ', '+', $imageData);
            $imageData = base64_decode($imageData);

            if ($imageData === false) {
                throw new \Exception('base64_decode failed');
            }
        } else {
            throw new \Exception('did not match data URI with image data');
        }

        $dir = 'images/invitations/';
        $file = Str::random() . '.' . $type;
        $relativePath = $dir . $file;

        Log::info('save image relative path');
        Log::info($relativePath);

        Storage::disk('public')->put($relativePath, $imageData);

        $path = storage_path('app/public/images/invitations/620x640/');

        if (!is_dir($path)) {
            mkdir($path, 0755, true);
        }

        Log::info('create canvas');
        $canvas = $this->manager->create(620, 640)->fill('#f3f3f3');

        Log::info('read envelope image '.$envelope_img);
        
        // Resolve the envelope image path
        $resolvedEnvelopePath = $envelope_img;
        
        // If it's a URL or a path containing '/storage/', extract the relative path from the last occurrence
        if (str_contains($envelope_img, '/storage/')) {
            $parts = explode('/storage/', $envelope_img);
            // Take the last part which should be the relative path after the last /storage/
            $envelope_relativePath = ltrim(end($parts), '/');
            $resolvedEnvelopePath = storage_path('app/public/' . $envelope_relativePath);
            Log::info('envelope_relativePath: ' . $envelope_relativePath);
            Log::info('resolvedEnvelopePath: ' . $resolvedEnvelopePath);
        } elseif (!file_exists($resolvedEnvelopePath) && !str_starts_with($resolvedEnvelopePath, 'http')) {
            // Try prefixing with public storage path if it's just a relative path
            $resolvedEnvelopePath = storage_path('app/public/' . ltrim($envelope_img, '/'));
        }

        Log::info('Resolved envelope path: ' . $resolvedEnvelopePath);

        $env = $this->manager->read($resolvedEnvelopePath)
            ->resize(487, 550)
            ->rotate(10);

        Log::info('envelope image read');

        $inv = $this->manager->read($imageData)
            ->resize(352, 500);

        $canvas->place($env, 'top-left', 4, 0);
        $canvas->place($inv, 'center');

        Log::info('save image 620x640');
        Log::info($path . $file);
        $canvas->save($path . $file);

        Log::info('return relative path');
        return $relativePath;
    }

    /**
     * Add watermark to image.
     *
     * @param string $path Relative path to image in storage/app/public
     * @return string Data URL
     */
    public function addWatermark($path)
    {
        $fullPath = storage_path('app/public/' . $path);

        $image = $this->manager->read($fullPath);

        $image->text('Tolem jasalmagan', 120, 900, function (FontFactory $font) {
            $font->file(public_path('/fonts/Baltica_KZ.ttf'));
            $font->size(200);
            $font->color('rgba(0, 0, 0, 0.3)');
            $font->align('center');
            $font->valign('bottom');
            $font->angle(90);
        });

        return $image->toGif()->toDataUri();
    }
}
