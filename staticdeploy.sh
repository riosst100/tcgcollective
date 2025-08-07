rm -rf var/cache var/page_cache var/view_preprocessed pub/static/*
php bin/magento setup:static-content:deploy -f
