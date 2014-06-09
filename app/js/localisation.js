'use strict';

angular.module('formularLocalisation', [ ])
    .value("formularLocalisationDefaults", {
        locales: [
            {
                locale: "en-gb",
                url: "localisation/en-gb.json"
            }
        ],
        debug: true
    })
    .service("formularLocalisationService",
    ["$rootScope", "$http", "$filter", "$log", "$injector", "formularLocalisationDefaults",
        function ($rootScope, $http, $filter, $log, $injector, formularLocalisationDefaults) {
            this.resourceAvailable = false;
            this.resources = [];

            this.getLocalisedString = function (key) {
                var result = "";

                if(this.resourceAvailable && this.resources[this.locale] != undefined) {
                    var matches = $filter('filter')(this.resources[this.locale] || [], {key:key});

                    if (matches.length > 1) {
                        this.log("More than one resource value found with key " + key + " using the first");
                    }
                    if(matches.length > 0) {
                        result = matches[0].value;
                    } else {
                        this.log("No resource value found with key " + key);
                        result = key;
                    }
                } else if(!this.resourceAvailable) {
                    this.loadCurrentLocalisationResource();
                    this.resourceAvailable = true;
                }

                if(this.getLocaleConfig(this.locale).failure) {
                    this.log("Failed to load this resource earlier, no values can be provided : " + key);
                    result = key;
                }

                return result;
            };

            this.isLocaleAvailable = function (locale) {
                return $filter('filter')(this.config.locales, {locale:locale}).length === 1;
            };

            this.getLocaleConfig = function (locale) {
                return $filter('filter')(this.config.locales, {locale:locale})[0];
            };

            this.isResourceAvailable = function (locale) {
                return this.resources[locale] != undefined;
            };

            // Check for a user specified config, otherwise use the defaults
            this.initConfig = function () {
                if ($injector.has("formularLocalisationConfig")) {
                    this.config = $injector.get("formularLocalisationConfig");
                    this.log("Locale config has been found");
                } else {
                    this.config = formularLocalisationDefaults;
                    this.log("No locale config found, using defaults");
                }

                this.setLocale(this.config.locales[0].locale);
            };

            this.loadCurrentLocalisationResource = function () {
                if(this.resources[this.locale] == undefined && !this.getLocaleConfig(this.locale).failure) {
                    $http({ method:"GET", url:this.getLocaleConfig(this.locale).url, cache:false })
                        .success(angular.bind(this, this.setCurrentLocalisationResource))
                        .error(angular.bind(this, function () {
                            this.log("Failed to load resouce : " + this.getLocaleConfig(this.locale).url);
                            this.getLocaleConfig(this.locale).failure = true;
                        }));
                }
            };

            this.setCurrentLocalisationResource = function (data) {
                if(data != undefined) {
                    this.resources[this.locale] = data;
                    this.resourceAvailable = true;
                    $rootScope.$broadcast('formularLocalisationResourceChange');
                }
            };

            this.setLocale = function (locale) {
                if(this.isLocaleAvailable(locale)) {
                    this.locale = locale;
                } else {
                    this.locale = this.config.locales[0].locale;
                }
                this.resourceAvailable = this.isResourceAvailable(this.locale);
            };

            this.log = function (message) {
                if (this.config.debug)
                    $log.log("formular: " + message);
            };

            this.initConfig();
        }])
    .filter('localise', ['formularLocalisationService', function (formularLocalisationService) {
        return function (key) {
            return formularLocalisationService.getLocalisedString(key);
        };
    }]);
