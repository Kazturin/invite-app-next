<x-app-layout :meta-title="'Toi-invite блог - ' . $category->title">
    <div class="container mx-auto grid grid-cols-1 md:grid-cols-3 py-6">

        <!-- Posts Section -->
        <section class="w-full md:col-span-2  px-3">
            <div class=" flex flex-col items-center">
                @foreach($posts as $post)
                    <x-post-item :post="$post"/>
                @endforeach
            </div>
            {{ $posts->links() }}
        </section>

        <!-- Sidebar Section -->
        <x-sidebar />

    </div>
</x-app-layout>
