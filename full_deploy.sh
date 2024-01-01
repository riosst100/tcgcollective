#!/bin/bash
rm -rf var/di var/generation/ var/page_cache/ var/report/ var/view_preprocessed var/cache/ var/tmp/ var/generation generated/
echo "starting deployment"
php bin/magento setup:upgrade
echo "starting compile" 
php bin/magento setup:di:compile
echo "Clean up static-content"
rm -rf pub/static/*
mkdir pub/static/_cache
mkdir pub/static/_cache/merged
php bin/magento setup:static-content:deploy -f

echo "clear cache"
php bin/magento cache:clean
echo "Deployment done" 

chmod -R 777 var/ pub/ bin/magento generated/
chmod -R 777 var pub generated
echo "chmod done"
