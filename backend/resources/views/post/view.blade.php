<x-app-layout :meta-title="$post->meta_title ?: $post->title" :meta-description="$post->meta_description" :meta-image="asset($post->getThumbnail())">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
        <!-- Post Section -->
        <section class="w-full md:col-span-2 flex flex-col px-3 my-4">

            <article class="">
                <!-- Article Image -->
                
                <img class="w-full" src="{{$post->getThumbnail()}}">
              
                <div class="bg-white flex flex-col justify-start p-6">
                    <div class="flex gap-4">
                        @foreach($post->categories as $category)
                        <a href="#" class="text-blue-700 text-sm font-bold uppercase pb-4">
                            {{$category->title}}
                        </a>
                        @endforeach
                    </div>
                    <h1 class="text-3xl font-bold hover:text-gray-700 pb-4">
                        {{$post->title}}
                    </h1>
                    <p href="#" class="text-lg pb-8 italic text-gray-600">
                        Жарияланды
                        {{$post->getFormattedDate().' | Оқу: '. $post->human_read_time }}
                    </p>
                    <div class="text-lg">
                        {!! $post->body !!}
                    </div>
                    <div class="flex items-center space-x-4 border-t pt-4 my-10">
                        <span class="text-lg">Бөлісу:</span>
                        <a href="https://www.facebook.com/sharer/sharer.php?u={{ urlencode(url()->current()) }}"
                            target="_blank">
                            <img class="w-12" src="/icons/facebook.svg" alt="">
                        </a>

                        <a href="https://api.whatsapp.com/send?text={{ urlencode(url()->current()) }}"
                            target="_blank">
                            <img class="w-12" src="/icons/whatsapp.svg" alt="">
                        </a>

                    </div>
                    {{-- @livewire('upvote-downvote',['post' => $post])--}}
                    {{-- <livewire:upvote-downvote :post="$post"/>--}}
                </div>
            </article>

            <div class="w-full flex pt-6">
                <div class="w-1/2">
                    @if($prev)
                    <a href="{{route('view', $prev)}}"
                        class="block w-full bg-white shadow hover:shadow-md text-left p-6">
                        <p class="text-lg text-blue-800 font-bold flex items-center">
                            <i class="fas fa-arrow-left pr-1"></i>
                            Алдыңғы
                        </p>
                        <p class="pt-2">{{\Illuminate\Support\Str::words($prev->title, 5)}}</p>
                    </a>
                    @endif
                </div>
                <div class="w-1/2">
                    @if($next)
                    <a href="{{route('view', $next)}}"
                        class="block w-full bg-white shadow hover:shadow-md text-right p-6">
                        <p class="text-lg text-blue-800 font-bold flex items-center justify-end">Келесі
                            <i
                                class="fas fa-arrow-right pl-1"></i>
                        </p>
                        <p class="pt-2">
                            {{\Illuminate\Support\Str::words($next->title, 5)}}
                        </p>
                    </a>
                    @endif
                </div>
            </div>

            {{-- <livewire:comments :post="$post"/>--}}
        </section>

        <x-sidebar />
    </div>
</x-app-layout>