'use strict';

describe('formularLocalisation service', function () {
    var flService, flDefaults, $httpBackend;
    var enGbJson = [
        {
            key: "application.title",
            value: "My Application"
        },
        {
            key: "application.title",
                value: "My Application"
        }
    ];

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
            $provide.value('formularLocalisationConfig', {
                locales: [
                    {
                        locale: "TEST"
                    }
                ]
            });
        }));

        it('should pick up a user specified config if available', inject(function (formularLocalisationService) {
            expect(formularLocalisationService.config).not.toBeNull();
            expect(formularLocalisationService.locale).toEqual('TEST');
        }));
    });

    describe('Resources', function () {
        beforeEach(module('formularLocalisation'));
        beforeEach(inject(function (_$httpBackend_, formularLocalisationService) {
            flService = formularLocalisationService
            $httpBackend = _$httpBackend_;
            $httpBackend.expectGET('localisation/en-gb.json').
                respond(enGbJson);
        }));

        it('should load the specified current locales resources', function () {
            expect(flService.resources).toEqual([]);
            flService.loadCurrentLocalisationResource();
            $httpBackend.flush();
            expect(flService.resources[flService.locale]).toBeDefined();
        });
    });
});
