'use strict';

describe('formularLocalisation service', function () {
    beforeEach(module('formularLocalisation'));

    describe('Configuration', function () {
        it('will create a default config', inject(function (formularLocalisationDefaults) {
            expect(formularLocalisationDefaults.locales.length).toEqual(1);
        }));

        it('should load a default config if no user specified one exits',
            inject(function (formularLocalisationService, formularLocalisationDefaults) {
                expect(formularLocalisationService.config).toEqual(formularLocalisationDefaults);
            }));

        it('should set a default locale of "en-gb"', inject(function (formularLocalisationService) {
            expect(formularLocalisationService.locale).toEqual('en-gb');
        }));

        it('should reset to default locale if an invalid/unavailable one is request', inject(function (formularLocalisationService) {
            formularLocalisationService.setLocale("invalid");
            expect(formularLocalisationService.locale).toEqual('en-gb');
        }));

        describe('User Specified', function () {
            beforeEach(module('formularLocalisation', function ($provide) {
                $provide.value('formularLocalisationConfig', {
                    locales: [{
                        locale: "TEST"
                    }]
                });
            }));

            it('should pick up a user specified config if available', inject(function (formularLocalisationService) {
                expect(formularLocalisationService.config).not.toBeNull();
                expect(formularLocalisationService.locale).toEqual('TEST');
            }));
        });
    });
});
