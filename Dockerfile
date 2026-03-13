FROM dunglas/frankenphp:php8.4-alpine

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

COPY composer.json composer.lock ./
ENV COMPOSER_ALLOW_SUPERUSER=1
RUN composer install --no-autoloader --no-scripts

COPY . .

RUN apk add --no-cache nodejs npm \
    && npm install \
    && npm run build \
    && rm -rf node_modules # Удаляем node_modules после сборки для уменьшения размера

RUN rm -rf bootstrap/cache/*.php

RUN composer dump-autoload --optimize

RUN php artisan octane:install --server=frankenphp

RUN chmod -R 775 storage bootstrap/cache \
    && php artisan storage:link \
    && php artisan route:cache \
    && php artisan view:cache

RUN cp $PHP_INI_DIR/php.ini-production $PHP_INI_DIR/php.ini

RUN echo "upload_max_filesize = 100M" > $PHP_INI_DIR/conf.d/custom.ini \
    && echo "post_max_size = 100M" >> $PHP_INI_DIR/conf.d/custom.ini \
    && echo "memory_limit = 512M" >> $PHP_INI_DIR/conf.d/custom.ini \
    && echo "variables_order = EGPCS" >> $PHP_INI_DIR/conf.d/custom.ini \
    && echo "opcache.enable=1" >> $PHP_INI_DIR/conf.d/custom.ini \
    && echo "opcache.enable_cli=1" >> $PHP_INI_DIR/conf.d/custom.ini \
    && echo "opcache.memory_consumption=256" >> $PHP_INI_DIR/conf.d/custom.ini \
    && echo "opcache.interned_strings_buffer=16" >> $PHP_INI_DIR/conf.d/custom.ini \
    && echo "opcache.max_accelerated_files=20000" >> $PHP_INI_DIR/conf.d/custom.ini \
    && echo "opcache.validate_timestamps=0" >> $PHP_INI_DIR/conf.d/custom.ini \
    && echo "opcache.save_comments=1" >> $PHP_INI_DIR/conf.d/custom.ini \
    && echo "opcache.fast_shutdown=1" >> $PHP_INI_DIR/conf.d/custom.ini