'use strict';

angular.module('formularLocalisation', [ ])
    .value("formularLocalisationDefaults", {
        locales: [
            {
                locale: "en-gb",
                url: "localisation/en-gb.json"
            }
        ]
    })
    .service("formularLocalisationService",
    ["$http","$filter","$log", "$injector", "formularLocalisationDefaults",
        function ($http, $filter, $log, $injector, formularLocalisationDefaults) {
            this.resourceAvailable = false
            this.resources = [];

            this.setLocale = function (locale) {
                if(this.isLocaleAvailable(locale)) {
                    this.locale = locale;
                } else {
                    this.locale = this.config.locales[0].locale;
                }

                this.resourceAvailable = this.isResourceAvailable(this.locale);
            };

            this.isLocaleAvailable = function (locale) {
                return $filter('filter')(this.config.locales, {locale:locale}) === 1;
            };

            this.getLocaleConfig = function (locale) {
                return $filter('filter')(this.config.locales, {locale:locale})[0];
            };

            this.isResourceAvailable = function (locale) {
                return this.resources[locale];
            }

            // Check for a user specified config, otherwise use the defaults
            this.initConfig = function () {
                if ($injector.has("formularLocalisationConfig")) {
                    this.config = $injector.get("formularLocalisationConfig");
                    $log.log("formular: Locale config has been found");
                } else {
                    this.config = formularLocalisationDefaults;
                    $log.log("formular: No locale config found, using defaults");
                }

                this.setLocale(this.config.locales[0].locale);
            };

            this.loadCurrentLocalisationResource = function () {
                if(this.resources[this.locale] == undefined) {
                    $http({ method:"GET", url:this.getLocaleConfig(this.locale).url, cache:false })
                        .success(angular.bind(this, this.setCurrentLocalisationResource))
                        .error(function () {
                            $log.log("formular: Failed to load resouce : " + this.config.locales[this.locale].url)
                        });
                }
            }

            this.setCurrentLocalisationResource = function (data) {
                if(data != undefined) {
                    this.resources[this.locale] = data;
                    this.resourceAvailable = true;
                }
            }

            this.initConfig();
        }]);
