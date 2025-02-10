import { expect, request } from "@playwright/test";


export async function submitForm(fname: string, lname: string) {

    const apiContext = await request.newContext();

    let test = await apiContext.get('https://www.w3schools.com/action_page.php', {
        params: {
            fname: fname,
            lname: lname
        },
        headers: {
            'method': 'GET',
            'path': '/action_page.php?fname=Johnsd&lname=Does',
            'scheme': 'https',
            accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
            'accept-encoding': 'gzip, deflate, br, zstd',
            'accept-language': 'en-US',
            cookie: '_sharedID=0b022d3f-ff61-4c16-a896-14564416a3a5; _sharedID_cst=TyylLI8srA%3D%3D; _sharedID_last=Mon%2C%2010%20Feb%202025%2019%3A17%3A54%20GMT; _lr_retry_request=true; _lr_env_src_ats=false; _ga=GA1.1.923269181.1739215074; __gads=ID=af92255b85dabdc4:T=1739215077:RT=1739215077:S=ALNI_MZJWaL23NSUnp2Jm2v0fWzZVkYWFQ; __gpi=UID=00000feb59359f2d:T=1739215077:RT=1739215077:S=ALNI_MbFQvbGAD8afymhG_JCtsFwjmALvA; __eoi=ID=9139b5f74c64546c:T=1739215077:RT=1739215077:S=AA-AfjadQ2w00r7yaf2yD27h4rBO; _ga_9YNMTB56NB=GS1.1.1739215074.1.0.1739215075.0.0.0; cto_bundle=CJmjIV9ESHdqTGxucU4wUDgzZ0JEdTFZJTJGTVR4QWN4YjdraWpsQnF5bElaS0liRDFYUG81RTJocXN4engwTG9yJTJGU0xCUXhPRXQlMkJLckdYeDklMkZtblhkU0UyZkphbjV6R0lYVlYzTEtlaklKVk41NWp6TGk4M3BIMiUyRnlMTCUyRkZsMUxsbTBOamNSZ3MlMkJyVGN6aUxseXh3eHEwcFRtdE1jMDBKclRuM1NmdDJtTldhN2ZTYyUzRA',
            priority: 'u=0, i',
            referer: 'https://www.w3schools.com/html/tryit.asp?filename=tryhtml_form_submit',
            'sec-ch-ua': '"Not(A:Brand";v="99", "HeadlessChrome";v="133", "Chromium";v="133"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
            'sec-fetch-dest': 'iframe',
            'sec-fetch-mode': 'navigate',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-user': '?1',
            'upgrade-insecure-requests': '1',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.6943.16 Safari/537.36'
        }
    });

    expect(test.status()).toBe(200);
    console.log(await test.status());
    console.log(await test.body());
    console.log(await test.text());

}