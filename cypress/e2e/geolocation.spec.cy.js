describe('Geolocation Utility Integration Tests', () => {
  const apiKey =  'f897a99d971b5eef57be6fafa0d83239'; // This can be saved in .env file
  const baseUrlCity = 'http://api.openweathermap.org/geo/1.0/direct';
  const baseUrlZip = 'http://api.openweathermap.org/geo/1.0/zip';

  // Test for valid city/state input
  it('Fetches geolocation data for valid city/state: Marlboro, NJ', () => {
    const city = 'Marlboro';
    const state = 'NJ';
    const country = 'US';

    cy.request({
      method: 'GET',
      url: `${baseUrlCity}?q=${city},${state},${country}&appid=${apiKey}`,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.length.greaterThan(0);
      const { lat, lon } = response.body[0];
      cy.log(`Latitude: ${lat}, Longitude: ${lon}`);
    });
  });

  // Test for valid ZIP code input
  it('Fetches geolocation data for valid ZIP code: 07746', () => {
    const zipCode = '07746';
    const country = 'US';

    cy.request({
      method: 'GET',
      url: `${baseUrlZip}?zip=${zipCode},${country}&appid=${apiKey}`,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('lat');
      expect(response.body).to.have.property('lon');
      const { lat, lon } = response.body;
      cy.log(`Latitude: ${lat}, Longitude: ${lon}`);
    });
  });

  // Test for empty ZIP code input
  it('Handles empty ZIP code input', () => {
    const zipCode = '';
    const country = 'US';

    cy.request({
      method: 'GET',
      url: `${baseUrlZip}?zip=${zipCode},${country}&appid=${apiKey}`,
      failOnStatusCode: false, // Ensure the test does not fail on error status
    }).then((response) => {
      expect(response.status).to.eq(400); // Expect 400 for empty ZIP code
    }).then(() => {
      cy.log('Empty ZIP code input test passed because it correctly returned 400.');
    });
  });

  // Test for invalid city/state input
  it('Handles invalid city/state input: InvalidCity, ZZ', () => {
    const city = 'InvalidCity';
    const state = 'ZZ';
    const country = 'US';

    cy.request({
      method: 'GET',
      url: `${baseUrlCity}?q=${city},${state},${country}&appid=${apiKey}`,
      failOnStatusCode: false, // Ensure the test does not fail on error status
    }).then((response) => {
      if (response.status === 200) {
        expect(response.body).to.be.an('array').that.is.empty; // Check for empty array if status is 200
        cy.log('Invalid city/state input test passed because it returned an empty array.');
      } else {
        expect(response.status).to.eq(404); // Expect 404 if not 200
        cy.log('Invalid city/state input test passed because it correctly returned 404.');
      }
    });
  });

  // Test for multiple valid locations
it('Fetches geolocation data for multiple valid locations', () => {
  const locations = [
    { type: 'city', query: 'Marlboro,NJ,10001' },
    { type: 'city', query: 'New York,NY,10001' },
    { type: 'city', query: 'Chicago,IL,60601' },
    { type: 'zip', query: '10001' },
    { type: 'zip', query: '60601' },
  ];

  locations.forEach((location) => {
    let url;

    if (location.type === 'city') {
      url = `${baseUrlCity}?q=${location.query}&appid=${apiKey}`;
    } else if (location.type === 'zip') {
      url = `${baseUrlZip}?zip=${location.query}&appid=${apiKey}`;
    }

    cy.request({
      method: 'GET',
      url: url,
    }).then((response) => {
      expect(response.status).to.eq(200);

      if (location.type === 'city') {
        const locationsArray = response.body;
        cy.log(`Number of locations for ${location.query}: ${locationsArray.length}`);
        locationsArray.forEach((loc, index) => {
          cy.log(`• Location ${index + 1} for ${location.query}: Latitude: ${loc.lat}, Longitude: ${loc.lon}`);
        });
      } else if (location.type === 'zip') {
        const loc = response.body;
        cy.log(`Location for ${location.query}: Latitude: ${loc.lat}, Longitude: ${loc.lon}`);
      }
    });
  });
});




  // Test for multiple locations: one valid, one empty, one invalid
  it('Fetches geolocation data for multiple locations: valid, empty, and invalid', () => {
    const locations = [
      { type: 'city', query: 'Marlboro,NJ,US' },   // Valid
      { type: 'city', query: '' },                // Empty
      { type: 'city', query: 'InvalidCity,ZZ,US' }, // Invalid
    ];

    locations.forEach((location) => {
      let url = `${baseUrlCity}?q=${location.query}&appid=${apiKey}`;

      cy.request({
        method: 'GET',
        url: url,
        failOnStatusCode: false, // Ensure the test does not fail on error status
      }).then((response) => {
        if (location.query === '') {
          expect(response.status).to.eq(400); // Expect 400 for empty city/state input
          cy.log('Empty city/state input test passed because it correctly returned 400.');
        } else if (location.query === 'InvalidCity,ZZ,US') {
          if (response.status === 200) {
            expect(response.body).to.be.an('array').that.is.empty; // Check for empty array if status is 200
            cy.log('Invalid city/state input test passed because it returned an empty array.');
          } else {
            expect(response.status).to.eq(404); // Expect 404 if not 200
            cy.log('Invalid city/state input test passed because it correctly returned 404.');
          }
        } else {
          expect(response.status).to.eq(200); // Expect 200 for valid input
          const { lat, lon } = response.body[0] || response.body;
          cy.log(`Latitude: ${lat}, Longitude: ${lon}`);
        }
      });
    });
  });

  // Additional test for multiple valid and invalid locations
  it('Fetches geolocation data for multiple locations: valid and invalid', () => {
    const locations = [
      { type: 'city', query: 'Marlboro,NJ,US' },   // Valid
      { type: 'city', query: 'InvalidCity,ZZ,US' }, // Invalid
    ];

    locations.forEach((location) => {
      let url = `${baseUrlCity}?q=${location.query}&appid=${apiKey}`;

      cy.request({
        method: 'GET',
        url: url,
        failOnStatusCode: false, // Ensure the test does not fail on error status
      }).then((response) => {
        if (location.query === 'InvalidCity,ZZ,US') {
          if (response.status === 200) {
            expect(response.body).to.be.an('array').that.is.empty; // Check for empty array if status is 200
            cy.log('Invalid city/state input test passed because it returned an empty array.');
          } else {
            expect(response.status).to.eq(404); // Expect 404 if not 200
            cy.log('Invalid city/state input test passed because it correctly returned 404.');
          }
        } else {
          expect(response.status).to.eq(200); // Expect 200 for valid input
          const { lat, lon } = response.body[0] || response.body;
          cy.log(`Latitude: ${lat}, Longitude: ${lon}`);
        }
      });
    });
  });

  // Test for invalid ZIP code input
  it('Handles invalid ZIP code input: 00000', () => {
    const zipCode = '00000';
    const country = 'US';

    cy.request({
      method: 'GET',
      url: `${baseUrlZip}?zip=${zipCode},${country}&appid=${apiKey}`,
      failOnStatusCode: false, // Ensure the test does not fail on error status
    }).then((response) => {
      expect(response.status).to.eq(404); // Expect 404 for invalid ZIP code
    }).then(() => {
      cy.log('Invalid ZIP code input test passed because it correctly returned 404.');
    });
  });

  // Test for empty city/state input
  it('Handles empty city/state input gracefully', () => {
    cy.request({
      method: 'GET',
      url: `${baseUrlCity}?q=&appid=${apiKey}`,
      failOnStatusCode: false, // Ensure the test does not fail on error status
    }).then((response) => {
      expect(response.status).to.eq(400); // Expect 400 for empty city/state input
    }).then(() => {
      cy.log('Empty city/state input test passed because it correctly returned 400.');
    });
  });
});
