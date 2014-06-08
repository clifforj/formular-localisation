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
    ["$log", "$injector", "formularLocalisationDefaults",
        function ($log, $injector, formularLocalisationDefaults) {
            var config, locale;

            this.setLocale = function (locale) {
                this.locale = locale;
            };

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
