describe('localisation filter', function () {
    beforeEach(module('localisation', function($provide) {
        $provide.service('localisationService', function() {
            this.getLocalisedString = function (key) {
                if(key === "application.title") {
                    return "My Application";
                } else if(key === "application.description") {
                    return "My Description";
                } else {
                    return key;
                }
            };
        });
    }));

    it('should return the value for the specified key', inject(function (localiseFilter) {
        expect(localiseFilter("application.title")).toEqual("My Application");
        expect(localiseFilter("application.description")).toEqual("My Description");
    }));

});