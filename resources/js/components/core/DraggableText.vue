<template>
    <div
        class="draggable"
        :style="{ left: position.x + 'px', top: position.y + 'px' }"
        @mousedown="startDragging"
    >
       <slot></slot>
    </div>
</template>

<script>
export default {
    data() {
        return {
            isDragging: false,
            startPosition: { x: 0, y: 0 },
            position: { x: 0, y: 0 },
        };
    },
    props: {
        text: String,
    },
    methods: {
        startDragging(event) {
            this.isDragging = true;
            this.startPosition = {
                x: event.clientX - this.position.x,
                y: event.clientY - this.position.y,
            };

            // Добавляем обработчики событий на window
            window.addEventListener('mousemove', this.dragging);
            window.addEventListener('mouseup', this.stopDragging);
        },
        dragging(event) {
            if (this.isDragging) {
                this.position = {
                    x: event.clientX - this.startPosition.x,
                    y: event.clientY - this.startPosition.y,
                };
            }
        },
        stopDragging() {
            this.isDragging = false;

            // Удаляем обработчики событий с window
            window.removeEventListener('mousemove', this.dragging);
            window.removeEventListener('mouseup', this.stopDragging);
        },
    },
};
</script>

<style scoped>
.draggable {
    position: absolute;
    cursor: move;
    padding: 8px;
    background: transparent;
}
</style>
