<article class="bg-white    flex flex-col shadow my-4">
    <!-- Article Image -->
    <a href="{{route('view', $post)}}" class="hover:opacity-75">
        <img src="{{$post->getThumbnail()}}" alt="{{$post->title}}" class="aspect-[4/3] object-contain">
    </a>
    <div class="bg-white flex flex-col justify-start p-6">
        <div class="flex gap-4">
            @foreach($post->categories as $category)
                <a href="#" class="text-blue-700 text-sm font-bold uppercase pb-4">
                    {{$category->title}}
                </a>
            @endforeach
        </div>
        <a href="{{route('view', $post)}}" class="text-2xl md:text-3xl font-bold hover:text-gray-700 pb-4">
            {{$post->title}}
        </a>
        @if ($showAuthor)
            <p href="#" class="text-lg text-gray-400 italic pb-3">
                Жарияланды
                {{$post->getFormattedDate()}} | {{ $post->human_read_time }}
            </p>
        @endif
        <div class="text-lg pb-6">
            {{$post->shortBody()}}
        </div>
        <a  href="{{route('view', $post)}}" class="uppercase bg-blue-600 hover:bg-blue-700 text-white rounded py-2 px-4 w-max">Оқу <i
                class="fas fa-arrow-right"></i></a>
    </div>
</article>
