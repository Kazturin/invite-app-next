# сборка бэкенда (FrankenPHP)
FROM dunglas/frankenphp:php8.4-alpine

# Установка расширений (добавьте те, что нужны вашему проекту)
RUN install-php-extensions \
    pdo_mysql \
    gd \
    intl \
    zip \
    opcache \
    pcntl \
    bcmath \
    redis

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /app

# Копируем Composer и ставим зависимости
COPY composer.json composer.lock ./
ENV COMPOSER_ALLOW_SUPERUSER=1
RUN composer install --no-autoloader --no-scripts

# Копируем код
COPY . .



# Установка Node.js и сборка ассетов (для админки/Vite)
RUN apk add --no-cache nodejs npm \
    && npm install \
    && npm run build \
    && rm -rf node_modules # Удаляем node_modules после сборки для уменьшения размера

RUN rm -rf bootstrap/cache/*.php

# Финализируем автозагрузку
RUN composer dump-autoload --optimize

# Настройка Octane для FrankenPHP
RUN php artisan octane:install --server=frankenphp --force

# Права и кеш
RUN chmod -R 775 storage bootstrap/cache \
    && php artisan storage:link

# 1. Берем за основу production-конфиг (рекомендуется для безопасности и производительности)
RUN cp $PHP_INI_DIR/php.ini-production $PHP_INI_DIR/php.ini

# 2. Создаем отдельный ini-файл с нашими переопределениями.
# Docker автоматически подхватит все файлы из папки conf.d
RUN echo "upload_max_filesize = 100M" > $PHP_INI_DIR/conf.d/custom.ini \
    && echo "post_max_size = 100M" >> $PHP_INI_DIR/conf.d/custom.ini \
    && echo "variables_order = EGPCS" >> $PHP_INI_DIR/conf.d/custom.ini

# Конфигурация FrankenPHP (Octane)