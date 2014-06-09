'use strict';

describe('formularLocalisation service', function () {
    var flService, flDefaults, $httpBackend;
    var validJson = [
        {
            key: "application.title",
            value: "My Application"
        },
        {
            key: "application.description",
            value: "My Description"
        },
        {
            key: "application.description",
            value: "Describe all the things"
        }
    ];
    var validJson2 = [
        {
            key: "application.title",
            value: "Meine Anwendung"
        }
    ];
    var customConfig = {
        locales: [
            {
                locale: "en-valid",
                url: "duplicateKeys.json"
            },
            {
                locale: "en-invalid",
                url: "invalidUrl.json"
            },
            {
                locale: "de-valid",
                url: "valid.json"
            }
        ]
    }

    describe('Configuration', function () {
        beforeEach(module('formularLocalisation'));
        beforeEach(inject(function (formularLocalisationService, formularLocalisationDefaults) {
            flService = formularLocalisationService;
            flDefaults = formularLocalisationDefaults;
        }));

        it('will create a default config', function () {
            expect(flDefaults.locales.length).toEqual(1);
        });

        it('should load a default config if no user specified one exits', function () {
            expect(flService.config).toEqual(flDefaults);
        });

        it('should set a default locale of "en-gb"', function () {
            expect(flService.locale).toEqual('en-gb');
        });

        it('should reset to default locale if an invalid/unavailable one is request', function () {
            flService.setLocale("invalid");
            expect(flService.locale).toEqual('en-gb');
        });
    });

    describe('Configuration - User Specified', function () {
        beforeEach(module('formularLocalisation', function ($provide) {
            $provide.value('formularLocalisationConfig', angular.copy(customConfig));
        }));

        it('should pick up a user specified config if available', inject(function (formularLocalisationService) {
            expect(formularLocalisationService.config).not.toBeNull();
            expect(formularLocalisationService.locale).toEqual('en-valid');
        }));
    });

    describe('Resources', function () {
        beforeEach(module('formularLocalisation', function ($provide) {
            $provide.value('formularLocalisationConfig', angular.copy(customConfig));
        }));
        beforeEach(inject(function (_$httpBackend_, formularLocalisationService) {
            flService = formularLocalisationService
            $httpBackend = _$httpBackend_;
        }));

        it('should load the specified current locales resources', function () {
            $httpBackend.expectGET('duplicateKeys.json').
                respond(validJson);
            expect(flService.resources).toEqual([]);
            flService.loadCurrentLocalisationResource();
            $httpBackend.flush();
            expect(flService.resources[flService.locale]).toBeDefined();
        });

        it('should flag the config with a failure if unable to load current resources', function () {
            flService.setLocale("en-invalid");
            $httpBackend.expectGET('invalidUrl.json').respond(500, '');
            flService.loadCurrentLocalisationResource();
            $httpBackend.flush();
            expect(flService.getLocaleConfig(flService.locale).failure).toEqual(true);
        });

        it('should know when a resource is available', function () {
            $httpBackend.expectGET('duplicateKeys.json').respond(validJson);
            expect(flService.isResourceAvailable("en-valid")).toEqual(false);
            flService.loadCurrentLocalisationResource();
            $httpBackend.flush();
            expect(flService.isResourceAvailable("en-valid")).toEqual(true);
        });
    });

    describe('Localised Strings', function () {
        beforeEach(module('formularLocalisation', function ($provide) {
            $provide.value('formularLocalisationConfig', customConfig);
        }));
        beforeEach(inject(function (_$httpBackend_, formularLocalisationService) {
            flService = formularLocalisationService
            $httpBackend = _$httpBackend_;
        }));

        describe('(valid)', function () {
            beforeEach(function () {
                $httpBackend.expectGET("duplicateKeys.json").respond(validJson);
                flService.loadCurrentLocalisationResource();
                $httpBackend.flush();
            });

            it('should return a localised string for the specified key', function () {
                expect(flService.getLocalisedString("application.title")).toEqual("My Application");
            });

            it('should resolve duplicate keys by selecting the first occurrence', function () {
                expect(flService.getLocalisedString("application.description")).toEqual("My Description");
            });

            it('should output keys that cannot be found', function () {
                expect(flService.getLocalisedString("not.a.real.key")).toEqual("not.a.real.key");
            });

            it('should return the localised string from the correct locale', function () {
                expect(flService.getLocalisedString("application.title")).toEqual("My Application");

                flService.setLocale("de-valid");
                $httpBackend.expectGET("valid.json").respond(validJson2);
                flService.loadCurrentLocalisationResource();
                $httpBackend.flush();

                expect(flService.getLocalisedString("application.title")).toEqual("Meine Anwendung");
            });
        });

        describe('(invalid)', function () {
            beforeEach(function () {
                flService.setLocale("en-invalid");
                $httpBackend.expectGET('invalidUrl.json').respond(500, '');
                flService.loadCurrentLocalisationResource();
                $httpBackend.flush();
            });

            it('should return keys when a resource has failed to load', function () {
                expect(flService.getLocalisedString("application.title")).toEqual("application.title");
            });
        })

    });
});
