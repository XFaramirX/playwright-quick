const contactUs = {
    container: '.section-services',
};

const nav = {
    container: "nav",
};

const contact = {
    locator: '#cmp-contact',
    snapshot: `
    - heading [level=2]
    - button
    - heading [level=3]
    - paragraph
    `
}


export { contactUs, nav , contact };


//   //Captures a “snapshot” of the entire state of a component
//     await expect(page.locator('#cmp-contact')).toMatchAriaSnapshot(`
//       - heading [level=2]
//       - button
//       - heading [level=3]
//       - paragraph
//       `);


