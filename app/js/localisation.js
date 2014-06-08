'use strict';

angular.module('formularLocalisation', [ ])
    .value("formularLocalisationDefaults", {
        locales: [
            {
                locale: "en-gb"
            }
        ]
    })
    .service("formularLocalisationService",
    ["$filter","$log", "$injector", "formularLocalisationDefaults",
        function ($filter, $log, $injector, formularLocalisationDefaults) {
            var config, locale;

            this.setLocale = function (locale) {
                if(this.isLocaleAvailable(locale))
                    this.locale = locale;
                else
                    this.locale = this.config.locales[0].locale;
            };

            this.isLocaleAvailable = function (locale) {
                return $filter('filter')(this.config.locales, {locale:locale}) === 1;
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

            this.initConfig();
        }]);
