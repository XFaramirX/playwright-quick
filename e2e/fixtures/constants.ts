import { devices } from '@playwright/test';

export const lightHouseThresholds = {
    performance: 50,
    accessibility: 50,
    'best-practices': 50,
    seo: 50,
    pwa: 50,
};

export const screenshotOptions = { maxDiffPixelRatio: 0.15, };

export const deviceMatrix = [
    {
        name: 'chromium',
        use: { ...devices['Desktop Chrome'] },
    },

    // {
    //     name: 'firefox',
    //     use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //     name: 'webkit',
    //     use: { ...devices['Desktop Safari'] },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
];


export const geolocationUsers = {
    eastCoast: {
        username: "eastCoastUser",
        geolocation: {
            longitude: -74.006,
            latitude: 40.7128,
        },
        locale: "en-us",
        timezoneId: "America/New_York",
    },
    central: {
        username: "centralTimeUser",
        geolocation: {
            longitude: -87.6298,
            latitude: 41.8781,
        },
        locale: "en-us",
        timezoneId: "America/Chicago",
    },

    mountain: {
        username: "mountainTimeUser",
        geolocation: {
            longitude: -104.9903,
            latitude: 39.7392,
        },
        locale: "en-us",
        timezoneId: "America/Denver",
    },
    alaska: {
        username: "alaskaTimeUser",
        geolocation: {
            longitude: -149.9003,
            latitude: 61.2181,
        },
        locale: "en-us",
        timezoneId: "America/Anchorage",
    },
    hawaii: {
        username: "hawaiiTimeUser",
        geolocation: {
            longitude: -157.8583,
            latitude: 21.3069,
        },
        locale: "en-us",
        timezoneId: "Pacific/Honolulu",
    },
    samoa: {
        username: "samoaTimeUser",
        geolocation: {
            longitude: -170.702,
            latitude: -14.2756,
        },
        locale: "en-us",
        timezoneId: "Pacific/Pago_Pago",
    },
    chamorro: {
        username: "chamorroTimeUser",
        geolocation: {
            longitude: 144.7937,
            latitude: 13.4443,
        },
        locale: "en-us",
        timezoneId: "Pacific/Guam",
    },
    london: {
        username: "londonUser",
        geolocation: {
            longitude: -0.1276,
            latitude: 51.5074,
        },
        locale: "en-gb",
        timezoneId: "Europe/London",
    },
    sydney: {
        username: "sydneyUser",
        geolocation: {
            longitude: 151.2093,
            latitude: -33.8688,
        },
        locale: "en-au",
        timezoneId: "Australia/Sydney",
    },
    toronto: {
        username: "torontoUser",
        geolocation: {
            longitude: -79.3832,
            latitude: 43.6532,
        },
        locale: "en-ca",
        timezoneId: "America/Toronto",
    },
};
